'use server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import Stripe from 'stripe';
import { revalidatePath } from 'next/cache';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'dummy_key', {
    apiVersion: '2025-01-27.acacia' as any,
});

export async function searchTicketsAction(query: string) {
    if (!query) {
        const { data } = await supabaseAdmin
            .from('tickets')
            .select(`
                id, created_at, status, stripe_session_id,
                profile:profiles ( full_name, email ),
                product:app_products ( name ),
                slot:event_slots (
                    product:app_products ( name )
                )
            `)
            .order('created_at', { ascending: false })
            .limit(10);
        return { success: true, data: data || [] };
    }

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
        return { success: true, data: [] };
    }

    const { data: tickets, error: ticketError } = await supabaseAdmin
        .from('tickets')
        .select(`
            id, created_at, status, stripe_session_id,
            profile:profiles!inner ( full_name, email ),
            product:app_products ( name ),
            slot:event_slots (
                product:app_products ( name )
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

export async function refundTicketAction(ticketId: string, stripeSessionId: string | null, reason: string) {
    try {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error("Missing STRIPE_SECRET_KEY. Cannot process live refunds locally.");
        }

        if (stripeSessionId) {
            const session = await stripe.checkout.sessions.retrieve(stripeSessionId);
            if (session.payment_intent) {
                await stripe.refunds.create({
                    payment_intent: session.payment_intent as string,
                    reason: 'requested_by_customer'
                });
            }
        }

        // 1. Update database status and store reason
        const { data: ticket, error: updateError } = await supabaseAdmin
            .from('tickets')
            .update({
                status: 'refunded',
                refund_reason: reason
            })
            .eq('id', ticketId)
            .select('*, profile:profiles(full_name, email), product:app_products(name)')
            .single();

        if (updateError) throw updateError;

        // 2. Fetch Chief's notification details
        const { data: settings } = await supabaseAdmin
            .from('admin_settings')
            .select('*')
            .eq('id', 'default')
            .single();

        // 3. Trigger Email Notification (Placeholder for Telegram)
        if (settings?.chief_email && ticket) {
            try {
                const { resend } = await import('@/lib/resend');
                await resend.emails.send({
                    from: 'Hello Sunshine <onboarding@resend.dev>',
                    to: settings.chief_email,
                    subject: `⚠️ Refund Issued: ${ticket.profile?.full_name}`,
                    html: `
                        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                            <h2 style="color: #d32f2f; text-transform: uppercase;">Refund Alert</h2>
                            <p>A refund has been processed for a ticket.</p>
                            <hr />
                            <p><strong>Guest:</strong> ${ticket.profile?.full_name} (${ticket.profile?.email})</p>
                            <p><strong>Product:</strong> ${ticket.product?.name}</p>
                            <p><strong>Reason:</strong> ${reason}</p>
                            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                            <hr />
                            <p style="font-size: 10px; color: #999; text-transform: uppercase;">Log entry created in Admin Dashboard</p>
                        </div>
                    `
                });
            } catch (emailErr) {
                console.error('Failed to send refund email notice:', emailErr);
            }
        }

        // 4. Telegram Notification
        if (settings?.telegram_bot_token && settings?.telegram_chat_id && ticket) {
            try {
                const { sendTelegramMessage } = await import('@/lib/notifications');
                const message = `
<b>⚠️ REFUND ISSUED</b>
<b>Guest:</b> ${ticket.profile?.full_name}
<b>Product:</b> ${ticket.product?.name}
<b>Reason:</b> ${reason}
<b>Email:</b> ${ticket.profile?.email}
<i>Log entry created in Admin Dashboard</i>
                `.trim();
                await sendTelegramMessage(settings.telegram_bot_token, settings.telegram_chat_id, message);
            } catch (tgErr) {
                console.error('Failed to send Telegram refund notice:', tgErr);
            }
        }

        revalidatePath('/admin/refunds');
        revalidatePath('/admin');
        return { success: true };
    } catch (error: any) {
        console.error('Refund action failed:', error);
        return { success: false, error: error.message || 'Refund failed' };
    }
}

export async function checkInTicketAction(ticketId: string, notes?: string) {
    try {
        // 1. Fetch ticket with latest status
        const { data: ticket, error: fetchError } = await supabaseAdmin
            .from('tickets')
            .select(`
                *,
                profile:profiles(full_name, email),
                product:app_products(name),
                slot:event_slots(
                    product:app_products(name)
                )
            `)
            .eq('id', ticketId)
            .single();

        if (fetchError || !ticket) {
            return { success: false, error: 'Ticket not found.' };
        }

        // 2. Validation Business Rules
        if (ticket.status === 'refunded') {
            return { success: false, error: 'CANCELLED: This ticket has been refunded.' };
        }

        if (ticket.checked_in_at) {
            return {
                success: false,
                error: `ALREADY SCANNED: This ticket was used at ${new Date(ticket.checked_in_at).toLocaleTimeString()}.`,
                guestName: ticket.profile?.full_name
            };
        }

        // 3. Mark as Checked In
        const { error: updateError } = await supabaseAdmin
            .from('tickets')
            .update({
                checked_in_at: new Date().toISOString(),
                check_in_notes: notes || null,
                status: 'used' // Mark as used
            })
            .eq('id', ticketId);

        if (updateError) throw updateError;

        revalidatePath('/admin');
        revalidatePath('/admin/scanner');

        return {
            success: true,
            guestName: ticket.profile?.full_name,
            productName: ticket.slot?.product?.name || ticket.product?.name
        };
    } catch (error: any) {
        console.error('Check-in action failed:', error);
        return { success: false, error: 'Server error during check-in.' };
    }
}
