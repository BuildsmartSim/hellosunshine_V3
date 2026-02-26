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
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-neutral-800">Dashboard Overview</h2>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest font-mono">Total Tickets Sold</p>
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">{ticketPercentage}% Sold</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-bold text-neutral-800">{ticketCount || 0}</p>
                        <p className="text-sm text-neutral-400 font-mono">/ {totalCapacity} Capacity</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
                    <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest font-mono mb-2">Active Events</p>
                    <p className="text-4xl font-bold text-neutral-800">{events?.filter((e: EventRow) => e.is_active).length || 0}</p>
                </div>
            </div>

            {/* Analytics Dashboard (Looker + GA4 Link) */}
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-neutral-100 bg-neutral-50/50 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-neutral-800 tracking-tight">Analytics & Health</h3>
                        <p className="text-xs text-neutral-500 font-mono mt-1">Website vitals and deep ticketing insights</p>
                    </div>
                    <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="px-4 py-2 flex items-center gap-2 bg-yellow-400 text-yellow-950 text-sm font-bold rounded-lg shadow hover:bg-yellow-500 transition-colors">
                        <span>📊</span> View Deep Funnel (GA4)
                    </a>
                </div>
                <div className="p-6 bg-neutral-50/30">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold mb-4 block">Basic Health (Looker Studio)</label>
                    <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-neutral-100 border border-neutral-200 rounded-lg flex items-center justify-center overflow-hidden relative">
                        {/* We will embed the real Looker Studio iframe here once created. For now, a placeholder guiding the user. */}
                        <div className="text-center p-8 absolute z-10">
                            <h4 className="font-bold text-neutral-800 mb-2">Looker Studio Embed Ready</h4>
                            <p className="text-sm text-neutral-500 mb-4 max-w-sm mx-auto">
                                Once you create your Basic Health report in Looker Studio, paste the embed iframe code here.
                            </p>
                            <code className="bg-neutral-200 text-xs p-2 rounded text-neutral-600 block">&lt;iframe src=&quot;https://lookerstudio.google.com/embed/...&quot;&gt;&lt;/iframe&gt;</code>
                        </div>
                    </div>
                </div>
            </div>

            {/* Event Manager Table */}
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-neutral-100 bg-neutral-50/50 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-neutral-800 tracking-tight">Event Manager</h3>
                        <p className="text-xs text-neutral-500 font-mono mt-1">Manage events, locations, and ticket tiers</p>
                    </div>
                    <Link href="/admin/events/new" className="px-4 py-2 bg-neutral-900 text-white text-sm font-bold rounded-lg shadow hover:bg-neutral-800 transition-colors">
                        + Create New Event
                    </Link>
                </div>

                {error ? (
                    <div className="p-6 text-red-500 font-mono text-sm">Failed to load events: {error.message}</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wider font-bold text-neutral-500 font-mono">
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Location & Dates</th>
                                <th className="px-6 py-4">Show on Homepage</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {events?.map((event: EventRow) => (
                                <tr key={event.id} className="hover:bg-neutral-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <EventToggle
                                            eventId={event.id}
                                            initialState={event.is_active}
                                            type="active"
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-bold text-neutral-900">{event.title}</td>
                                    <td className="px-6 py-4 text-neutral-600 text-sm">{event.location} &middot; {event.dates}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-start">
                                            <EventToggle
                                                eventId={event.id}
                                                initialState={event.is_featured}
                                                type="featured"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <Link href={`/admin/events/${event.id}`} className="text-sm font-bold text-neutral-600 hover:text-neutral-900 underline">
                                                Manage
                                            </Link>
                                            <DeleteEventButton eventId={event.id} eventTitle={event.title} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Interactive Guest Manager Panel */}
            <GuestManager initialTickets={latestTickets || []} />
        </div>
    );
}
