import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { upsertProfile } from '@/lib/ticketing';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get('stripe-signature') as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any;

        try {
            // 1. Upsert Profile
            const { customer_details, metadata } = session;
            const profile = await upsertProfile({
                email: customer_details.email,
                full_name: metadata.customer_name || customer_details.name,
                phone: metadata.phone || customer_details.phone,
                age: metadata.age,
                gender: metadata.gender,
                waiver_accepted: metadata.waiver_accepted === 'true',
                waiver_accepted_at: metadata.waiver_accepted_at,
            });

            // 1.5 Handle Ambassador/Referral Code
            let ambassadorId = null;
            if (metadata.referral_code) {
                const { data: ambassador } = await supabaseAdmin
                    .from('ambassadors')
                    .select('id')
                    .eq('referral_code', metadata.referral_code)
                    .single();

                if (ambassador) {
                    ambassadorId = ambassador.id;
                }
            }

            // 2. Finalize Ticket (Upsert pending to active)
            const { data: ticket, error: ticketError } = await supabaseAdmin
                .from('tickets')
                .upsert({
                    profile_id: profile.id,
                    slot_id: session.metadata.slot_id || null,
                    product_id: session.metadata.product_id || null,
                    stripe_session_id: session.id,
                    status: 'active',
                    ambassador_id: ambassadorId
                }, { onConflict: 'stripe_session_id' })
                .select()
                .single();

            if (ticketError) throw ticketError;

            // 3. Send Email
            try {
                const { sendTicketEmail } = await import('@/lib/ticketing');
                await sendTicketEmail(ticket.id);
            } catch (emailErr) {
                console.error('Failed to send ticket email:', emailErr);
                // We don't want to crash the whole webhook if email fails, 
                // but we might want to log it for retry.
            }

            // 4. Update Loyalty (Increment total_sweats)
            const { error: updateError } = await supabaseAdmin.rpc('increment_sweats', {
                profile_uuid: profile.id
            });

            if (updateError) {
                // Fallback if the RPC doesn't exist yet
                await supabaseAdmin
                    .from('profiles')
                    .update({ total_sweats: (profile.total_sweats || 0) + 1 })
                    .eq('id', profile.id);
            }

        } catch (err) {
            console.error('Error processing webhook success:', err);
            return NextResponse.json({ error: 'Database sync failed' }, { status: 500 });
        }
    } else if (event.type === 'checkout.session.expired') {
        const session = event.data.object as any;

        // Delete the pending ticket reservation to release inventory back to the pool
        const { error: deleteError } = await supabaseAdmin
            .from('tickets')
            .delete()
            .match({
                stripe_session_id: session.id,
                status: 'pending'
            });

        if (deleteError) {
            console.error('Error cleaning up expired session:', deleteError);
            // Even if delete fails, we return 200 so Stripe doesn't retry a failed cleanup
        } else {
            console.log(`Successfully cleaned up expired session: ${session.id}`);
        }
    } else if (event.type === 'charge.refunded') {
        const charge = event.data.object as any;
        const paymentIntentId = charge.payment_intent;

        // 1. Find the checkout session using the payment intent
        let stripeSessionId = charge.metadata?.session_id;

        if (!stripeSessionId && paymentIntentId) {
            try {
                const sessions = await stripe.checkout.sessions.list({
                    payment_intent: paymentIntentId,
                    limit: 1
                });
                if (sessions.data.length > 0) {
                    stripeSessionId = sessions.data[0].id;
                }
            } catch (err) {
                console.error('Error fetching session from Stripe during refund:', err);
            }
        }

        // 2. Find and cancel the ticket
        if (stripeSessionId) {
            const { data: ticket } = await supabaseAdmin
                .from('tickets')
                .select('id, profile_id')
                .eq('stripe_session_id', stripeSessionId)
                .single();

            if (ticket) {
                await supabaseAdmin
                    .from('tickets')
                    .update({ status: 'cancelled' })
                    .eq('id', ticket.id);

                // Decrement sweats
                const { error: updateError } = await supabaseAdmin.rpc('decrement_sweats', {
                    profile_uuid: ticket.profile_id
                });

                if (updateError) {
                    // Fallback: get current and decrement
                    const { data: profile } = await supabaseAdmin
                        .from('profiles')
                        .select('total_sweats')
                        .eq('id', ticket.profile_id)
                        .single();

                    if (profile) {
                        await supabaseAdmin
                            .from('profiles')
                            .update({ total_sweats: Math.max(0, (profile.total_sweats || 0) - 1) })
                            .eq('id', ticket.profile_id);
                    }
                }

                console.log(`Successfully cancelled ticket ${ticket.id} due to refund.`);
            }
        }
    }

    return NextResponse.json({ received: true });
}
