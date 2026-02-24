'use server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import Stripe from 'stripe';
import { revalidatePath } from 'next/cache';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'dummy_key', {
    apiVersion: '2025-01-27.acacia' as any,
});

export async function searchTicketsAction(query: string) {
    if (!query) {
        // Return latest 10 if query is empty
        const { data } = await supabaseAdmin
            .from('tickets')
            .select(`
                id, created_at, status, stripe_session_id,
                profile:profiles ( full_name, email ),
                slot:slots (
                    start_time,
                    product:products ( name )
                )
            `)
            .order('created_at', { ascending: false })
            .limit(10);
        return { success: true, data: data || [] };
    }

    // Try finding exact profile IDs that match the search (ilike is case-insensitive)
    const { data: profiles, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`);

    if (profileError) {
        console.error('Failed to search profiles:', profileError);
        return { success: false, error: 'Database search error' };
    }

    const profileIds = profiles.map((p: any) => p.id);

    if (profileIds.length === 0) {
        return { success: true, data: [] }; // no matching profiles found
    }

    // Fetch tickets for those profiles
    const { data: tickets, error: ticketError } = await supabaseAdmin
        .from('tickets')
        .select(`
            id, created_at, status, stripe_session_id,
            profile:profiles!inner ( full_name, email ),
            slot:slots (
                start_time,
                product:products ( name )
            )
        `)
        .in('profile_id', profileIds)
        .order('created_at', { ascending: false });

    if (ticketError) {
        console.error('Failed to fetch tickets for search:', ticketError);
        return { success: false, error: 'Failed to fetch tickets' };
    }

    return { success: true, data: tickets || [] };
}

export async function refundTicketAction(ticketId: string, stripeSessionId: string | null) {
    try {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error("Missing STRIPE_SECRET_KEY. Cannot process live refunds locally.");
        }

        if (stripeSessionId) {
            // Retrieve session to get payment intent
            const session = await stripe.checkout.sessions.retrieve(stripeSessionId);
            if (session.payment_intent) {
                // Issue full refund via Stripe
                await stripe.refunds.create({
                    payment_intent: session.payment_intent as string,
                    reason: 'requested_by_customer'
                });
            } else {
                console.warn(`No payment intent found for session ${stripeSessionId}. It might be a free or bypassed ticket.`);
            }
        } else {
            console.warn(`No stripe_session_id for ticket ${ticketId}. Proceeding with internal DB refund only.`);
        }

        // Update database status to refunded
        const { error } = await supabaseAdmin
            .from('tickets')
            .update({ status: 'refunded' })
            .eq('id', ticketId);

        if (error) throw error;

        revalidatePath('/admin');
        return { success: true };
    } catch (error: any) {
        console.error('Refund action failed:', error);
        return { success: false, error: error.message || 'Refund failed' };
    }
}
