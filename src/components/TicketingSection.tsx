"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { textures, fonts } from '@/design-system/tokens';
import { Button } from '@/components/Button';

/* ─────────────────────────────────────────────────────
   PRESETS & DATA
   ───────────────────────────────────────────────────── */
const FESTIVAL_DATA = [
    {
        title: "Day Pass",
        location: "Festival Grounds",
        description: "Sunlight and stillness. Valid for one full day of restoration in our sanctuary.",
        logoSrc: "/Festival Logo_svg/rumble camp.svg",
        price: "$45",
    },
    {
        title: "Weekender",
        location: "Full Access",
        description: "Fri-Sun Access. Our most popular choice for the full immersion experience.",
        logoSrc: "/Festival Logo_svg/Small world.svg",
        price: "$120",
    },
    {
        title: "Season",
        location: "Priority Access",
        description: "Unlimited summer access. Priority booking and exclusive member events.",
        logoSrc: "/Festival Logo_svg/Avalon Dance Oddessy2.svg",
        price: "$450",
    },
];

import { SectionHeader } from '@/components/SectionHeader';

/* ─────────────────────────────────────────────────────
   FestivalPass COMPONENT (v6.1 Final Champion)
   ═══════════════════════════════════════════════════════ */
function FestivalPass({ data, index, className = "", style = {} }:
    { data: typeof FESTIVAL_DATA[0], index: number, className?: string, style?: React.CSSProperties }) {

    return (
        <motion.div
            style={{
                ...style,
                filter: 'drop-shadow(0 15px 15px rgba(0, 0, 0, 0.15)) drop-shadow(0 25px 45px rgba(0, 0, 0, 0.2))'
            }}
            whileHover={{ scale: 1.02, y: -10, rotate: 0, zIndex: 100 }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
            className={`relative w-full max-w-[340px] aspect-[4/7] group cursor-pointer ${className}`}
        >
            <div
                className="w-full h-full flex flex-col overflow-hidden relative"
                style={{
                    backgroundColor: '#E0CC99',
                    clipPath: 'polygon(0% 2%, 10% 0.5%, 25% 3%, 40% 1%, 55% 4%, 70% 0.5%, 85% 3.5%, 100% 1.5%, 100% 98%, 90% 100%, 75% 97%, 60% 99.5%, 45% 96.5%, 30% 99%, 15% 97%, 0% 100%)'
                }}
            >
                {/* 1. LAYER: Paper Texture */}
                <div className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none" style={{ backgroundImage: `url('${textures.paper}')` }}></div>

                {/* 2. LAYER: Lighting gradient */}
                <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-charcoal/15 to-transparent pointer-events-none z-10"></div>
                <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url('${textures.pencilGrain}')`, backgroundSize: '300px' }}></div>

                {/* 3. LAYER: Heavy Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                    <div className="relative w-[150%] h-[150%] opacity-[0.08] mix-blend-multiply transition-transform duration-1000 group-hover:scale-110">
                        <Image src={data.logoSrc} alt="" fill className="object-contain filter grayscale" />
                    </div>
                </div>

                {/* 4. LAYER: CONTENT */}
                <div className="h-16 bg-charcoal flex items-center justify-center relative shrink-0 z-30">
                    <div className="absolute bottom-0 left-0 w-full h-[1px] border-b border-dashed border-white/20"></div>
                    <h4 className="text-white/40 text-[9px] uppercase font-mono tracking-[0.6em] select-none">Record File: 2026-ARC-{index}</h4>
                </div>

                <div className="flex-1 p-6 flex flex-col relative z-30">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex-1">
                            <h3 className="text-3xl font-black text-charcoal uppercase leading-[0.8] tracking-tighter" style={{ fontFamily: fonts.accent }}>
                                {data.title.split(' ').map((w, i) => <div key={i} className="block">{w}</div>)}
                            </h3>
                            <p className="text-[10px] font-mono text-primary font-bold mt-4 tracking-[0.4em] uppercase">{data.location}</p>
                        </div>
                    </div>

                    <div className="flex-1 border-y border-charcoal/10 py-6 flex flex-col justify-center gap-4 relative">
                        <p className="text-sm text-charcoal/70 leading-relaxed italic text-justify z-10" style={{ fontFamily: fonts.body }}>
                            &quot;{data.description}&quot;
                        </p>
                        <div className="h-[2px] w-12 bg-charcoal/10"></div>
                    </div>

                    <div className="mt-auto pt-6 flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-[8px] uppercase tracking-[0.4em] text-charcoal/30 font-bold">Price Tier</span>
                            <span className="text-2xl font-bold text-charcoal" style={{ fontFamily: fonts.display }}>{data.price}</span>
                        </div>
                        <Button variant="deepDry" className="scale-75 origin-right ring-4 ring-white/5 shadow-2xl transition-all hover:scale-[0.8] active:scale-70">
                            Select Pass
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function TicketingSection() {
    return (
        <section className="-mt-16 lg:-mt-24 pb-24 lg:pb-32 overflow-hidden bg-[#F3EFE6] relative">
            {/* Paper Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply"
                style={{
                    backgroundImage: `url('${textures.paper}')`,
                    backgroundSize: '400px',
                }}></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* 1. Header Block (Standardized with SectionHeader) */}
                <div className="grid grid-cols-1 md:grid-cols-12 mb-8 md:mb-12">
                    <div className="hidden md:block md:col-span-1 border-r border-charcoal/10 h-32 opacity-40 mr-12" style={{ filter: 'url(#hand-drawn)' }}></div>
                    <div className="col-span-1 md:col-span-11">
                        <SectionHeader
                            line1="Festival"
                            line2="Season"
                            subtitle="Choose your journey into warmth."
                        />
                    </div>
                </div>

                {/* 2. Structured Horizontal Layout (3-in-a-row) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 items-start">
                    {FESTIVAL_DATA.map((item, i) => (
                        <div key={i} className="flex justify-center">
                            <FestivalPass data={item} index={i + 1} />
                        </div>
                    ))}
                </div>

                {/* Footer Link */}
                <div className="mt-24 flex flex-col items-center gap-8">
                    <div className="h-[2px] w-16 bg-charcoal/5"></div>
                    <p className="font-handwriting text-charcoal/30 text-2xl">Limited availability for all tiers</p>
                </div>

            </div>
        </section>
    );
}
