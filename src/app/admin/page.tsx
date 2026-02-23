import React from 'react';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { EventToggle } from './EventToggle';
import { DeleteEventButton } from './events/DeleteEventButton';
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
    // Fetch all events using the full-access admin client
    const { data: events, error } = await supabaseAdmin
        .from('app_events')
        .select('*')
        .order('created_at', { ascending: false });

    // Fetch quick stats (just a simple count for now to represent Ticket Sales)
    const { count: ticketCount } = await supabaseAdmin
        .from('tickets')
        .select('*', { count: 'exact', head: true });

    // Fetch latest purchases
    const { data: latestTickets } = await supabaseAdmin
        .from('tickets')
        .select(`
            id, created_at, status,
            profile:profiles ( full_name, email ),
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
                    <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest font-mono mb-2">Total Tickets Sold</p>
                    <p className="text-4xl font-bold text-neutral-800">{ticketCount || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
                    <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest font-mono mb-2">Active Events</p>
                    <p className="text-4xl font-bold text-neutral-800">{events?.filter((e: EventRow) => e.is_active).length || 0}</p>
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

            {/* Latest Purchases Panel */}
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-neutral-100 bg-neutral-50/50 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-neutral-800 tracking-tight">Latest Purchases</h3>
                        <p className="text-xs text-neutral-500 font-mono mt-1">Recent tickets and guest details</p>
                    </div>
                </div>
                <div className="divide-y divide-neutral-100">
                    {latestTickets?.length === 0 ? (
                        <div className="p-6 text-sm text-neutral-500 text-center">No purchases yet.</div>
                    ) : (
                        latestTickets?.map((ticket: any) => (
                            <div key={ticket.id} className="p-6 hover:bg-neutral-50/50 transition-colors flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-neutral-900">{ticket.profile?.full_name || 'Anonymous Guest'}</p>
                                    <p className="text-sm text-neutral-500 font-mono">{ticket.profile?.email}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-neutral-800 text-sm">{ticket.slot?.product?.name || 'Unknown Ticket'}</p>
                                    <p className="text-xs text-neutral-500 mt-1">
                                        {new Date(ticket.created_at).toLocaleDateString()} at {new Date(ticket.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <div>
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${ticket.status === 'active' ? 'bg-green-100 text-green-700' :
                                            ticket.status === 'used' ? 'bg-neutral-100 text-neutral-600' :
                                                'bg-red-100 text-red-700'
                                        }`}>
                                        {ticket.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
