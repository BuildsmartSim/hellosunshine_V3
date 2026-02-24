'use server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { resend } from '@/lib/resend';

export async function fetchBroadcastAudiencesAction() {
    try {
        // Fetch all active events with past ticket holders for targeting
        const { data: events, error } = await supabaseAdmin
            .from('app_events')
            .select('id, title')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return { success: true, audiences: events || [] };
    } catch (err: any) {
        console.error('Failed to fetch audiences:', err);
        return { success: false, error: 'Could not load audiences.' };
    }
}

export async function sendBroadcastEmailAction(audienceId: string | 'all', subject: string, message: string) {
    try {
        if (!process.env.RESEND_API_KEY) {
            console.warn('RESEND_API_KEY missing. Simulating broadcast send.');
            await new Promise(r => setTimeout(r, 1000));
            return { success: true, recipientCount: 1 };
        }

        let emails: Set<string> = new Set();

        if (audienceId === 'all') {
            // Fetch all unique emails from profiles who have tickets
            const { data: profiles, error } = await supabaseAdmin
                .from('profiles')
                .select('email');

            if (error) throw error;
            profiles?.forEach(p => p.email && emails.add(p.email));
        } else {
            // Fetch all tickets for a specific event to extract their emails
            // Step 1: Find all products associated with this event location
            const { data: eventDetails } = await supabaseAdmin
                .from('app_events')
                .select('location')
                .eq('id', audienceId)
                .single();

            if (!eventDetails?.location) {
                return { success: false, error: 'Event location not found to target' };
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
                    const productIds = products.map(p => p.id);
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
