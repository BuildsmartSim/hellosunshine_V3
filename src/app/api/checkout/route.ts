import { NextResponse } from 'next/server';
import { inventory } from '@/lib/inventory';
export const dynamic = 'force-dynamic';

import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { priceId, email, name, metadata } = body;

        console.log('Checkout requested for:', email, priceId);

        // 1. Check Inventory
        const stock = await inventory.checkAvailability(priceId);
        if (!stock.available) {
            console.warn(`Blocked checkout for sold-out item: ${priceId}`);
            return NextResponse.json(
                { error: 'Sorry, this ticket tier has just sold out.' },
                { status: 409 } // 409 Conflict
            );
        }

        if (!process.env.STRIPE_SECRET_KEY) {
            console.warn('Stripe not configured. Redirecting to mock success for development.');
            const mockSessionId = `test_session_${Date.now()}`;
            const origin = req.headers.get('origin') || 'http://localhost:3000';

            return NextResponse.json({
                url: `${origin}/tickets/success?session_id=${mockSessionId}&id=demo-ticket-id`
            });
        }

        const stripe = (await import('@/lib/stripe')).getStripe();

        // 2. Create Session with Metadata
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    quantity: 1,
                    price_data: {
                        currency: 'gbp',
                        product_data: {
                            name: stock.productName || `Ticket: ${priceId}`
                        },
                        unit_amount: stock.priceAmountPence || 0 // Fetched securely from DB
                    }
                }
            ],
            mode: 'payment',
            customer_email: email,
            success_url: `${req.headers.get('origin')}/tickets/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get('origin')}/tickets`,
            metadata: {
                customer_name: name,
                product_id: stock.productId, // Link to our internal UUID
                internal_tier_id: priceId,
                referral_code: metadata?.referral_code || null,
                ...metadata
            },
        });

        // 3. Create Pending Ticket Reservation to lock inventory
        const supabase = (await import('@/lib/supabaseAdmin')).supabaseAdmin;
        const { error: reserveError } = await supabase
            .from('tickets')
            .insert({
                product_id: stock.productId,
                stripe_session_id: session.id,
                status: 'pending'
            });

        if (reserveError) {
            console.error('Failed to reserve pending ticket:', reserveError);
            // We still proceed, but log that inventory lock failed for this checkout.
        }

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        console.error('Checkout API error:', err);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
