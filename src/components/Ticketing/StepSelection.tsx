"use client";

import React, { useEffect } from 'react';
import { sendGAEvent } from '@next/third-parties/google';


import { FestivalPass, TicketTier } from './FestivalPass';
import { SectionHeader } from '@/components/SectionHeader';

interface StepSelectionProps {
    events: TicketTier[];
    onSelect: (tier: TicketTier) => void;
    selectedTier: TicketTier | null;
}

export function StepSelection({ events, onSelect, selectedTier }: StepSelectionProps) {
    useEffect(() => {
        if (events && events.length > 0) {
            sendGAEvent('event', 'view_item', {
                currency: 'GBP',
                value: 0,
                items: events.map(pass => ({
                    item_id: pass.id,
                    item_name: pass.title,
                }))
            });
        }
    }, [events]);

    return (
        <div className="w-full mx-auto px-4">
            <div className="flex flex-col items-center mb-16">
                <SectionHeader
                    line1="Choose"
                    line2="Tier"
                    subtitle="Select your path into the warmth."
                    className="text-center"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 items-center justify-items-center">
                {events.length === 0 && <p className="col-span-full text-charcoal/50 font-mono tracking-widest text-sm py-12">LOADING SANCTUARIES...</p>}
                {events.map((pass, idx) => (
                    <FestivalPass
                        key={pass.id}
                        data={pass}
                        index={idx + 1}
                        isSelected={selectedTier?.id === pass.id}
                        onSelect={onSelect}
                    />
                ))}
            </div>
        </div>
    );
}
