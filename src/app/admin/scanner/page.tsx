import React from 'react';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { ScannerClient } from './ScannerClient';

export const revalidate = 0;

export default async function ScannerPage() {
    // Fetch live attendance stats for today
    // For simplicity, we'll just count total checked in vs total active tickets
    const { count: checkedInCount } = await supabaseAdmin
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .not('checked_in_at', 'is', null);

    const { count: totalTickets } = await supabaseAdmin
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

    const remaining = (totalTickets || 0);
    const total = (checkedInCount || 0) + remaining;

    return (
        <div className="space-y-8 max-h-screen">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-black text-neutral-800 tracking-tight uppercase font-mono">Entry Scanner</h2>
                    <p className="text-xs text-neutral-500 font-mono mt-1 uppercase tracking-widest">Door Control & Guest Verification</p>
                </div>

                <div className="text-right">
                    <div className="flex items-baseline gap-2 justify-end">
                        <span className="text-3xl font-black text-neutral-900 font-mono">{checkedInCount || 0}</span>
                        <span className="text-xs font-black text-neutral-400 font-mono uppercase">/ {total} In</span>
                    </div>
                    <p className="text-[10px] text-green-600 font-bold font-mono uppercase tracking-widest">Live Attendance</p>
                </div>
            </div>

            <ScannerClient />
        </div>
    );
}
