import React from 'react';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { RefundManager } from './RefundManager';

export const revalidate = 0;

export default async function RefundsPage() {
    const { data: tickets } = await supabaseAdmin
        .from('tickets')
        .select(`
            *,
            profile:profiles(full_name, email),
            product:products(name),
            slot:slots(
                product:products(name)
            )
        `)
        .in('status', ['active', 'used'])
        .order('created_at', { ascending: false })
        .limit(20);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-black text-neutral-800 tracking-tight uppercase font-mono">Refund Center</h2>
                <p className="text-xs text-neutral-500 font-mono mt-1 uppercase tracking-widest">Process secure refunds with mandatory reason tracking</p>
            </div>

            <RefundManager initialTickets={tickets || []} />
        </div>
    );
}
