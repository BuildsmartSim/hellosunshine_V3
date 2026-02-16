"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { textures, fonts } from '@/design-system/tokens';
import { Button } from '@/components/Button';
import { LayeredPencil } from '@/components/LayeredPencil';

/* ─────────────────────────────────────────────────────
   PRESETS & DATA
   ───────────────────────────────────────────────────── */
const FESTIVAL_DATA = [
    {
        title: "Campfire Sessions",
        location: "Wicklow Mountains",
        description: "Intimate acoustic gatherings. Woodsmoke, storytelling, and raw music under the stars.",
        logoSrc: "/Festival Logo_svg/rumble camp.svg",
    },
    {
        title: "River Retreat",
        location: "Glendalough",
        description: "A wellness-focused weekend. Steam, cold plunges, and guided meditation by the water.",
        logoSrc: "/Festival Logo_svg/Small world.svg",
    },
    {
        title: "Mountain Summit",
        location: "Killiney Hills",
        description: "High-energy celebration. Grand feasts, hiking expeditions, and rooftop concerts.",
        logoSrc: "/Festival Logo_svg/Avalon Dance Oddessy2.svg",
    },
];

/* ─────────────────────────────────────────────────────
   FestivalPass COMPONENT (v6.1 Deep Depth Champion)
   ───────────────────────────────────────────────────── */
function FinalChampionCard({ data, index, className = "", style = {} }:
    { data: typeof FESTIVAL_DATA[0], index: number, className?: string, style?: React.CSSProperties }) {

    return (
        <motion.div
            style={{
                ...style,
                clipPath: 'polygon(0% 2%, 10% 0.5%, 25% 3%, 40% 1%, 55% 4%, 70% 0.5%, 85% 3.5%, 100% 1.5%, 100% 98%, 90% 100%, 75% 97%, 60% 99.5%, 45% 96.5%, 30% 99%, 15% 97%, 0% 100%)',
                backgroundColor: '#E0CC99',
                boxShadow: `0 35px 60px -15px rgba(44, 38, 35, 0.4), 0 15px 80px -10px rgba(44, 38, 35, 0.2)`
            }}
            whileHover={{ scale: 1.01, y: -20, rotate: 0, zIndex: 100 }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
            className={`relative w-full max-w-[340px] aspect-[4/7] overflow-hidden flex flex-col group cursor-pointer ${className}`}
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
            <div className="h-20 bg-charcoal flex items-center justify-center relative shrink-0 z-30">
                <div className="absolute bottom-0 left-0 w-full h-[1px] border-b border-dashed border-white/20"></div>
                <h4 className="text-white/40 text-[9px] uppercase font-mono tracking-[0.6em] select-none">Record File: 2026-ARC-{index}</h4>
            </div>

            <div className="flex-1 p-6 flex flex-col relative z-30">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                        <h3 className="text-3xl font-black text-charcoal uppercase leading-[0.8] tracking-tighter">
                            {data.title.split(' ').map((w, i) => <div key={i} className="block">{w}</div>)}
                        </h3>
                        <p className="text-[10px] font-mono text-primary font-bold mt-4 tracking-[0.4em] uppercase">{data.location}</p>
                    </div>
                </div>

                <div className="flex-1 border-y border-charcoal/10 py-6 flex flex-col justify-center gap-4 relative">
                    <p className="text-sm text-charcoal/70 leading-relaxed italic text-justify z-10">
                        &quot;{data.description}&quot;
                    </p>
                    <div className="h-[2px] w-12 bg-charcoal/10"></div>
                </div>

                <div className="mt-auto pt-6 flex justify-between items-center">
                    <div className="flex flex-col">
                        <span className="text-[8px] uppercase tracking-[0.4em] text-charcoal/30 font-bold">Serial No.</span>
                        <span className="text-xs font-mono font-bold text-charcoal/60 tracking-widest uppercase">HS-ARC-2026</span>
                    </div>
                    <Button variant="deepDry" className="scale-75 origin-right ring-4 ring-white/5 shadow-2xl transition-all hover:scale-[0.8] active:scale-70">
                        Book Pass
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}

/* ─────────────────────────────────────────────────────
   WORKBENCH PAGE: TRIO LAYOUT EXPLORATION
   ───────────────────────────────────────────────────── */
export default function FestivalWorkbench() {
    return (
        <div className="min-h-screen bg-[#FDFCF9] text-charcoal font-body pb-60">
            {/* Header */}
            <header className="py-24 px-10 border-b border-charcoal/5 max-w-7xl mx-auto text-center">
                <LayeredPencil text="Festival" size="40px" />
                <LayeredPencil text="Section Concepts" size="70px" className="-mt-4" />
                <div className="h-[2px] w-12 bg-primary mx-auto mt-8 mb-6"></div>
                <p className="text-charcoal/50 max-w-2xl leading-relaxed mx-auto">
                    Three festivals, three layout concepts. Finding the perfect rhythm for our
                    <strong> Final Champion v6.1</strong> in a homepage section.
                </p>
            </header>

            {/* Concept 1: The Curated Grid */}
            <section className="mt-40 max-w-[1400px] mx-auto px-10">
                <div className="text-center mb-24">
                    <span className="text-xs font-mono font-bold text-primary uppercase tracking-[0.6em]">Concept 01</span>
                    <h2 className="text-4xl font-black mt-4 uppercase tracking-tighter">The Curated Grid</h2>
                    <p className="text-charcoal/40 mt-3 italic">Clinical, symmetrical, and perfectly balanced.</p>
                </div>

                <div className="flex flex-wrap justify-between gap-10">
                    {FESTIVAL_DATA.map((item, i) => (
                        <FinalChampionCard key={i} data={item} index={i + 1} />
                    ))}
                </div>
            </section>

            {/* Concept 2: The Physical Stack (Fan) */}
            <section className="mt-80 max-w-[1400px] mx-auto px-10 overflow-hidden py-20">
                <div className="text-center mb-32">
                    <span className="text-xs font-mono font-bold text-primary uppercase tracking-[0.6em]">Concept 02</span>
                    <h2 className="text-4xl font-black mt-4 uppercase tracking-tighter">The Physical Stack</h2>
                    <p className="text-charcoal/40 mt-3 italic">Tangible, overlapping, and tactile (The Fan).</p>
                </div>

                <div className="flex justify-center h-[740px] relative">
                    <div className="relative flex items-center justify-center w-full max-w-[1000px]">
                        <FinalChampionCard
                            data={FESTIVAL_DATA[0]}
                            index={1}
                            style={{ position: 'absolute', left: '10%', transform: 'rotate(-8deg) translateX(-20px)', zIndex: 1 }}
                        />
                        <FinalChampionCard
                            data={FESTIVAL_DATA[1]}
                            index={2}
                            style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%) translateY(-30px)', zIndex: 2 }}
                        />
                        <FinalChampionCard
                            data={FESTIVAL_DATA[2]}
                            index={3}
                            style={{ position: 'absolute', right: '10%', transform: 'rotate(8deg) translateX(20px)', zIndex: 1 }}
                        />
                    </div>
                </div>
            </section>

            {/* Concept 3: The Archival Mosaic (Staggered) */}
            <section className="mt-80 max-w-[1400px] mx-auto px-10">
                <div className="text-center mb-32">
                    <span className="text-xs font-mono font-bold text-primary uppercase tracking-[0.6em]">Concept 03</span>
                    <h2 className="text-4xl font-black mt-4 uppercase tracking-tighter">The Archival Mosaic</h2>
                    <p className="text-charcoal/40 mt-3 italic">Organic height offsets and slight rotations.</p>
                </div>

                <div className="flex flex-wrap justify-between items-start gap-10">
                    <FinalChampionCard
                        data={FESTIVAL_DATA[0]}
                        index={1}
                        style={{ transform: 'rotate(-2deg) translateY(40px)' }}
                    />
                    <FinalChampionCard
                        data={FESTIVAL_DATA[1]}
                        index={2}
                        style={{ transform: 'rotate(1deg) translateY(-20px)' }}
                    />
                    <FinalChampionCard
                        data={FESTIVAL_DATA[2]}
                        index={3}
                        style={{ transform: 'rotate(-1.5deg) translateY(56px)' }}
                    />
                </div>
            </section>

            <footer className="py-60 text-center opacity-20">
                <Image src="/HSSLOGO black YELLOW.png" alt="Logo" width={60} height={60} className="mx-auto grayscale" />
            </footer>
        </div>
    );
}
