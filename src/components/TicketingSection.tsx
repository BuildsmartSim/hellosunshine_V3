"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { SectionHeader } from '@/components/SectionHeader';
import { StandardSection } from '@/components/StandardSection';
import { FestivalPass } from '@/components/Ticketing/FestivalPass';
import { EventData } from '@/data/festivals';
import { getEventsAction } from '@/app/actions/events';
import { useHasMounted } from '@/design-system/MediaContext';

export default function TicketingSection() {
    const hasMounted = useHasMounted();
    const [events, setEvents] = useState<EventData[]>([]);

    useEffect(() => {
        getEventsAction().then(data => {
            // Only show featured events on the homepage
            const featured = data.filter(e => e.isFeatured);
            setEvents(featured);
        });
    }, []);

    if (!hasMounted) return null;

    return (
        <StandardSection id="ticketing" variant="naturalPaper" showOverlap={true}>
            <div className="grid grid-cols-1 md:grid-cols-12 mb-8 md:mb-12">
                <div className="col-span-12">
                    <SectionHeader
                        line1="Festival"
                        line2="Season"
                        subtitle="Choose your journey into warmth."
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 items-center justify-items-center">
                {events.length === 0 && <p className="col-span-full text-charcoal/50 font-mono tracking-widest text-sm py-12">LOADING SANCTUARIES...</p>}
                {events.map((pass, idx) => (
                    <Link key={pass.id} href="/tickets" className="w-full flex justify-center">
                        <FestivalPass data={pass} index={idx + 1} mode="teaser" />
                    </Link>
                ))}
            </div>

            <div className="mt-24 flex flex-col items-center gap-8">
                <div className="h-[2px] w-16 bg-charcoal/5"></div>
                <p className="font-handwriting text-charcoal/30 text-2xl">Limited availability for all tiers</p>
            </div>
        </StandardSection>
    );
}
