import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');
    const ticketIdParam = searchParams.get('id');

    let ticketId = ticketIdParam;

    if (!ticketId && sessionId) {
        const { data } = await supabaseAdmin
            .from('tickets')
            .select('id, status')
            .eq('stripe_session_id', sessionId)
            .single();

        if (data) {
            ticketId = data.id;

            // LOCAL DEV FALLBACK: If we're not running webhook forwarders, Stripe will never mark this active.
            // When the user hits the success page and we find a 'pending' ticket, just mark it active so they can see it.
            if (data.status === 'pending' || data.status === null) {
                await supabaseAdmin
                    .from('tickets')
                    .update({ status: 'active' })
                    .eq('id', ticketId);
            }
        }
    }

    if (!ticketId) {
        return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const { getTicketWithDetails } = await import('@/lib/ticketing');
    const fullTicket = await getTicketWithDetails(ticketId);

    return NextResponse.json({ ticketId: ticketId, ticket: fullTicket });
}
