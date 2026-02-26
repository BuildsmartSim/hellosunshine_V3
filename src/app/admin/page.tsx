import React from 'react';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { EventToggle } from './EventToggle';
import { DeleteEventButton } from './events/DeleteEventButton';
import Link from 'next/link';
import { GuestManager } from './GuestManager';

export const revalidate = 0; // Ensure fresh data on every load

interface EventRow {
    id: string;
    title: string;
    location: string;
    dates: string;
    is_featured: boolean;
    is_active: boolean;
}

export default async function AdminDashboard() {
    // Fetch all events using the full-access admin client
    const { data: events, error } = await supabaseAdmin
        .from('app_events')
        .select('*')
        .order('created_at', { ascending: false });

    // Fetch quick stats (ticket sales vs capacity)
    const { count: ticketCount } = await supabaseAdmin
        .from('tickets')
        .select('*', { count: 'exact', head: true });

    const { data: productsData } = await supabaseAdmin
        .from('products')
        .select('stock_limit');

    const totalCapacity = productsData?.reduce((sum: number, p: any) => sum + (p.stock_limit || 0), 0) || 0;
    const ticketPercentage = totalCapacity > 0 ? Math.round(((ticketCount || 0) / totalCapacity) * 100) : 0;

    // Fetch latest purchases
    const { data: latestTickets } = await supabaseAdmin
        .from('tickets')
        .select(`
            id, created_at, status,
            profile:profiles ( full_name, email ),
            product:products ( name ),
            slot:slots (
                start_time,
                product:products ( name )
            )
        `)
        .order('created_at', { ascending: false })
        .limit(10);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div>
                <h2 className="text-2xl font-black text-neutral-800 tracking-tight uppercase font-mono">Dashboard Overview</h2>
                <p className="text-xs text-neutral-500 font-mono mt-1 uppercase tracking-widest">Real-time health and ticketing metrics</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm transition-all hover:shadow-md">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] font-mono leading-none">Total Tickets Sold</p>
                        <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded font-mono">{ticketPercentage}% SOLD</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-black text-neutral-800 font-mono">{ticketCount || 0}</p>
                        <p className="text-[10px] text-neutral-400 font-black font-mono uppercase tracking-widest">/ {totalCapacity} Capacity</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm transition-all hover:shadow-md">
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] font-mono mb-4 leading-none">Active Events</p>
                    <p className="text-4xl font-black text-neutral-800 font-mono">{events?.filter((e: EventRow) => e.is_active).length || 0}</p>
                </div>
            </div>

            {/* Analytics Dashboard (Looker + GA4 Link) */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl overflow-hidden">
                <div className="px-6 py-5 border-b border-neutral-100 bg-neutral-900 flex justify-between items-center">
                    <div>
                        <h3 className="text-sm font-black text-white tracking-[0.2em] uppercase font-mono">Analytics & Health</h3>
                    </div>
                    <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="px-4 py-2 flex items-center gap-2 bg-yellow-400 text-yellow-950 text-[10px] font-black rounded font-mono uppercase tracking-widest shadow hover:bg-yellow-500 transition-all active:scale-95">
                        <span className="text-sm">📊</span> View GA4 Dashboard
                    </a>
                </div>
                <div className="p-6 bg-neutral-50/10">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-black mb-4 block font-mono italic">Basic Health (Looker Studio)</label>
                    <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-neutral-100 border border-neutral-200 rounded-xl flex items-center justify-center overflow-hidden relative group">
                        <div className="text-center p-8 absolute z-10 transition-transform group-hover:scale-105 duration-500">
                            <h4 className="font-black text-neutral-800 mb-2 uppercase font-mono">Looker Studio Embed Ready</h4>
                            <p className="text-xs text-neutral-500 mb-4 max-w-sm mx-auto font-mono lowercase tracking-wide italic">
                                Once you create your Basic Health report in Looker Studio, paste the embed iframe code here.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Interactive Guest Manager Panel */}
            <div className="pt-4">
                <GuestManager initialTickets={latestTickets || []} />
            </div>
        </div>
    );
}
