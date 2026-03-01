import React from 'react';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { EventToggle } from './EventToggle';
import { DeleteEventButton } from './events/DeleteEventButton';
import { ReadinessScorecard } from './ReadinessScorecard';
import { getReadinessTasksAction, getCommunityHeatmapAction } from '@/app/actions/admin';
import { GuestManager } from './GuestManager';
import { StripeReconciler } from './StripeReconciler';
import { CommunityMap } from './CommunityMap';
import Link from 'next/link';

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
    const initialTasks = await getReadinessTasksAction();
    const mapData = await getCommunityHeatmapAction();

    // Fetch all events using the full-access admin client
    const { data: events, error } = await supabaseAdmin
        .from('app_events')
        .select('*')
        .order('created_at', { ascending: false });

    // Fetch sales stats
    const { count: ticketCount } = await supabaseAdmin
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .neq('status', 'refunded'); // Clean sales data

    // Fetch live attendance (checked in tickets)
    const { count: attendanceCount } = await supabaseAdmin
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .not('check_in_at', 'is', null);

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

            <ReadinessScorecard initialTasks={initialTasks} />
            <CommunityMap data={mapData} />

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

                <div className="bg-white p-6 rounded-2xl border border-primary/20 bg-primary/5 shadow-sm transition-all hover:shadow-md">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] font-mono mb-4 leading-none">Live Attendance</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-black text-neutral-800 font-mono">{attendanceCount || 0}</p>
                        <p className="text-[10px] text-neutral-400 font-black font-mono uppercase tracking-widest">In the Sanctuary</p>
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
                <div className="bg-neutral-50/10 h-[800px] w-full">
                    <iframe
                        width="100%"
                        height="100%"
                        src="https://lookerstudio.google.com/embed/reporting/02c90df3-8bf2-4c3d-941f-c4ed9f103f9b/page/kIV1C"
                        frameBorder="0"
                        style={{ border: 0 }}
                        allowFullScreen
                        sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox">
                    </iframe>
                </div>
            </div>

            {/* Interactive Guest Manager Panel */}
            <div className="pt-4">
                <div className="mb-4 flex justify-between items-center">
                    <h3 className="text-sm font-black text-neutral-400 uppercase tracking-[0.2em] font-mono">Recent Activity</h3>
                    <Link href="/admin/refunds" className="text-[10px] font-black text-primary underline uppercase font-mono tracking-widest hover:text-primary/70">
                        View Unified Refunds & Purchases
                    </Link>
                </div>
                <GuestManager initialTickets={latestTickets || []} />
            </div>

            {/* Emergency Tools Section */}
            <div className="pt-8 border-t border-neutral-100">
                <StripeReconciler />
            </div>
        </div>
    );
}
