import React from 'react';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { EventToggle } from '../EventToggle';
import { DeleteEventButton } from './DeleteEventButton';
import Link from 'next/link';

export const revalidate = 0;

interface EventRow {
    id: string;
    title: string;
    location: string;
    dates: string;
    is_featured: boolean;
    is_active: boolean;
}

export default async function EventsPage() {
    const { data: events, error } = await supabaseAdmin
        .from('app_events')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black text-neutral-800 tracking-tight uppercase font-mono">Event Manager</h2>
                    <p className="text-xs text-neutral-500 font-mono mt-1 uppercase tracking-widest">Manage events, locations, and ticket tiers</p>
                </div>
                <Link href="/admin/events/new" className="px-6 py-3 bg-neutral-900 text-white text-sm font-bold rounded-lg shadow-lg hover:bg-neutral-800 transition-all active:scale-95 flex items-center gap-2">
                    <span className="text-lg">+</span>
                    <span className="font-mono uppercase tracking-widest">Create New Event</span>
                </Link>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl overflow-hidden">
                {error ? (
                    <div className="p-12 text-center text-red-500 font-mono text-sm bg-red-50/50">
                        <svg className="w-12 h-12 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        Failed to load events: {error.message}
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-neutral-200 bg-neutral-50 text-[10px] uppercase tracking-[0.2em] font-black text-neutral-400 font-mono">
                                <th className="px-6 py-5">Status</th>
                                <th className="px-6 py-5">Title</th>
                                <th className="px-6 py-5">Location & Dates</th>
                                <th className="px-6 py-5">Show on Homepage</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {events?.map((event: EventRow) => (
                                <tr key={event.id} className="hover:bg-neutral-50/30 transition-colors group">
                                    <td className="px-6 py-5">
                                        <EventToggle
                                            eventId={event.id}
                                            initialState={event.is_active}
                                            type="active"
                                        />
                                    </td>
                                    <td className="px-6 py-5 font-black text-neutral-900 uppercase font-mono tracking-tight">{event.title}</td>
                                    <td className="px-6 py-5 text-neutral-500 text-xs font-mono lowercase tracking-wider">{event.location} &middot; {event.dates}</td>
                                    <td className="px-6 py-5">
                                        <div className="flex justify-start">
                                            <EventToggle
                                                eventId={event.id}
                                                initialState={event.is_featured}
                                                type="featured"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link href={`/admin/events/${event.id}`} className="text-[10px] font-black bg-neutral-100 px-3 py-1.5 rounded hover:bg-neutral-200 text-neutral-600 transition-all uppercase tracking-widest font-mono">
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
        </div>
    );
}
