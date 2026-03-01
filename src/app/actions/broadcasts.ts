'use server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { resend } from '@/lib/resend';

import { requireAdminOrPin } from '@/lib/auth';

const LONDON_AREAS = new Set([
    'london', 'dagenham', 'barnet', 'harringay', 'tower hamlets', 'hounslow',
    'city of westminster', 'waltham forest', 'ilford', 'islington', 'wandsworth',
    'bromley', 'fulham', 'lewisham', 'southwark', 'brent', 'camden', 'hackney',
    'hammersmith', 'croydon', 'ealing', 'enfield', 'greenwich', 'haringey',
    'harrow', 'havering', 'hillingdon', 'kensington', 'kingston', 'lambeth',
    'merton', 'newham', 'redbridge', 'richmond', 'sutton', 'waltham', 'westminster',
    'barking', 'bexley'
]);

export async function fetchBroadcastAudiencesAction(pin?: string) {
    try {
        const auth = await requireAdminOrPin(pin);
        if (!auth.authorized) throw new Error(auth.error);

        // Fetch all active events with past ticket holders for targeting
        const { data: events, error } = await supabaseAdmin
            .from('app_events')
            .select('id, title')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Fetch unique historical events
        const { data: historicalData } = await supabaseAdmin
            .from('archived_bookings')
            .select('event_name, event_year');

        const historicalMap = new Map<string, any>();
        historicalData?.forEach((row: any) => {
            if (row.event_name && row.event_year) {
                const key = `hist:${row.event_name}:${row.event_year}`;
                if (!historicalMap.has(key)) {
                    historicalMap.set(key, {
                        id: key,
                        title: `${row.event_name} (${row.event_year})`
                    });
                }
            }
        });

        // Fetch unique regions (cities)
        const { data: regionData } = await supabaseAdmin
            .from('archived_bookings')
            .select('city')
            .not('city', 'is', null);

        const regionMap = new Map<string, any>();
        let hasLondon = false;

        regionData?.forEach((row: any) => {
            if (row.city) {
                const cityLower = row.city.toLowerCase();

                // Group London areas together
                if (LONDON_AREAS.has(cityLower) || cityLower.includes('london')) {
                    hasLondon = true;
                    return; // Skip adding as individual city
                }

                const key = `region:${row.city}`;
                if (!regionMap.has(key)) {
                    regionMap.set(key, {
                        id: key,
                        title: row.city
                    });
                }
            }
        });

        if (hasLondon) {
            regionMap.set('region:Greater London (All Boroughs)', {
                id: 'region:Greater London (All Boroughs)',
                title: 'Greater London (All Boroughs)'
            });
        }

        return {
            success: true,
            audiences: events || [],
            historical: Array.from(historicalMap.values()),
            regions: Array.from(regionMap.values()).sort((a, b) => a.title.localeCompare(b.title))
        };
    } catch (err: any) {
        console.error('Failed to fetch audiences:', err);
        return { success: false, error: 'Could not load audiences.' };
    }
}

export async function sendBroadcastEmailAction(audienceIds: string[] | 'all', subject: string, message: string, pin?: string) {
    try {
        const auth = await requireAdminOrPin(pin);
        if (!auth.authorized) throw new Error(auth.error);

        if (!process.env.RESEND_API_KEY) {
            console.warn('RESEND_API_KEY missing. Simulating broadcast send.');
            await new Promise(r => setTimeout(r, 1000));
            return { success: true, recipientCount: 1 };
        }

        let emails: Set<string> = new Set();

        if (audienceIds === 'all') {
            // Fetch all unique emails from profiles who have tickets + archived
            const { data: profiles, error } = await supabaseAdmin
                .from('profiles')
                .select('email');

            if (error) throw error;
            profiles?.forEach((p: any) => p.email && emails.add(p.email));

            const { data: archived } = await supabaseAdmin
                .from('archived_bookings')
                .select('email');
            archived?.forEach((p: any) => p.email && emails.add(p.email));
        } else {
            // It's an array of targeted audiences
            for (const audienceId of audienceIds) {
                if (audienceId.startsWith('hist:')) {
                    const parts = audienceId.split(':');
                    const eventName = parts[1];
                    const eventYear = parseInt(parts[2]);

                    const { data: archived } = await supabaseAdmin
                        .from('archived_bookings')
                        .select('email')
                        .eq('event_name', eventName)
                        .eq('event_year', eventYear);

                    archived?.forEach((p: any) => p.email && emails.add(p.email));
                } else if (audienceId === 'region:Greater London (All Boroughs)') {
                    // Fetch all and filter in memory to handle case-insensitive checks against our Set
                    const { data: archived } = await supabaseAdmin
                        .from('archived_bookings')
                        .select('email, city');

                    archived?.forEach((p: any) => {
                        if (p.email && p.city) {
                            const cityLower = p.city.toLowerCase();
                            if (cityLower.includes('london') || LONDON_AREAS.has(cityLower)) {
                                emails.add(p.email);
                            }
                        }
                    });
                } else if (audienceId.startsWith('region:')) {
                    const city = audienceId.replace('region:', '');

                    const { data: archived } = await supabaseAdmin
                        .from('archived_bookings')
                        .select('email')
                        .eq('city', city);

                    archived?.forEach((p: any) => p.email && emails.add(p.email));
                } else {
                    // Fetch all tickets for a specific event to extract their emails
                    const { data: eventDetails } = await supabaseAdmin
                        .from('app_events')
                        .select('location')
                        .eq('id', audienceId)
                        .single();

                    if (!eventDetails?.location) {
                        continue; // Skip if location not found
                    }

                    const { data: locations } = await supabaseAdmin
                        .from('locations')
                        .select('id')
                        .eq('name', eventDetails.location)
                        .single();

                    if (locations) {
                        const { data: products } = await supabaseAdmin
                            .from('products')
                            .select('id')
                            .eq('location_id', locations.id);

                        if (products && products.length > 0) {
                            const productIds = products.map((p: any) => p.id);
                            const { data: tickets } = await supabaseAdmin
                                .from('tickets')
                                .select('profile:profiles (email)')
                                .in('product_id', productIds);

                            tickets?.forEach((t: any) => {
                                if (t.profile && t.profile.email) {
                                    emails.add(t.profile.email);
                                }
                            });
                        }
                    }
                }
            }
        }

        const emailList = Array.from(emails);

        if (emailList.length === 0) {
            return { success: false, error: 'No recipients found for this audience.' };
        }

        // Send via Resend using bcc to hide emails from each other
        const { error } = await resend.emails.send({
            from: 'Hello Sunshine Sauna <hello@hellosunshinesauna.com>',
            to: ['hello@hellosunshinesauna.com'], // Send to selves, blind copy everyone else
            bcc: emailList,
            subject: subject,
            text: message, // Assuming plain text for the quick blast
        });

        if (error) {
            console.error('Broadcast Resend error:', error);
            return { success: false, error: 'Failed to send broadcast via Resend.' };
        }

        return { success: true, recipientCount: emailList.length };
    } catch (err: any) {
        console.error('Broadcast error:', err);
        return { success: false, error: 'Internal server error while sending broadcast.' };
    }
}
