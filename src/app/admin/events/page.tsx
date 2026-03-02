import React from 'react';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { EventToggle } from '../EventToggle';
import { DeleteEventButton } from './DeleteEventButton';
import Link from 'next/link';
import { getAllEventSalesVelocitiesAction } from '@/app/actions/dashboard';
import { SalesVelocityChart } from '@/components/Admin/SalesChart';

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

    // Fetch the 14-day sales velocity mapped by event ID
    const velocityRes = await getAllEventSalesVelocitiesAction();
    const velocities = velocityRes.success && velocityRes.data ? velocityRes.data : {};

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black text-charcoal tracking-tight uppercase font-mono">Event Manager</h2>
                    <p className="text-xs text-neutral-500 font-mono mt-1 uppercase tracking-widest">Manage events, locations, and ticket tiers</p>
                </div>
                <Link href="/admin/events/new" className="px-6 py-3 bg-charcoal text-white text-sm font-bold rounded-lg shadow-lg hover:bg-neutral-800 transition-all active:scale-95 flex items-center gap-2">
                    <span className="text-lg">+</span>
                    <span className="font-mono uppercase tracking-widest">Create New Event</span>
                </Link>
            </div>

            {error ? (
                <div className="p-12 text-center text-red-500 font-mono text-sm bg-red-50/50 rounded-2xl border border-red-100">
                    <svg className="w-12 h-12 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    Failed to load events: {error.message}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {events?.map((event: EventRow) => {
                        const eventVelocityData = velocities[event.id] || [];
                        const totalVelocitySales = eventVelocityData.reduce((acc, v) => acc + v.sales, 0);

                        return (
                            <div key={event.id} className="bg-white rounded-3xl border border-neutral-200/50 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col group relative">
                                {/* Header section */}
                                <div className="p-6 border-b border-neutral-100 relative">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-black text-charcoal uppercase font-mono tracking-tight line-clamp-1 pr-12">{event.title}</h3>
                                        <div className="absolute top-6 right-6 flex gap-2">
                                            <EventToggle eventId={event.id} initialState={event.is_active} type="active" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-neutral-500 font-mono lowercase tracking-widest">{event.location} &middot; {event.dates}</p>
                                </div>

                                {/* Chart Section */}
                                <div className="p-6 flex-1 flex flex-col justify-center bg-neutral-50/30">
                                    <div className="flex justify-between items-end mb-2">
                                        <div>
                                            <h4 className="text-xs font-black text-neutral-400 uppercase tracking-[0.2em] font-mono">14-Day Velocity</h4>
                                            <p className="text-2xl font-black text-charcoal font-mono leading-none mt-1">{totalVelocitySales}</p>
                                        </div>
                                        {event.is_featured && (
                                            <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-1 rounded font-mono uppercase tracking-widest shadow-sm">
                                                Featured
                                            </span>
                                        )}
                                    </div>

                                    {/* Isolated Chart instance */}
                                    <div className="-mx-6">
                                        <SalesVelocityChart data={eventVelocityData} height={140} />
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest">Show in Hero:</span>
                                        <EventToggle eventId={event.id} initialState={event.is_featured} type="featured" />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Link href={`/admin/events/${event.id}`} className="px-4 py-2 bg-charcoal text-white text-[10px] font-black uppercase tracking-widest font-mono rounded hover:bg-neutral-800 transition-colors">
                                            Edit
                                        </Link>
                                        <DeleteEventButton eventId={event.id} eventTitle={event.title} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
