"use client";

import React from 'react';
import Image from 'next/image';
import { Polaroid } from '@/components/Polaroid';
import { DappledHeaderStroke } from '@/components/LightHeaderVariants';
import { fonts } from '@/design-system/tokens';
import { motion } from 'framer-motion';
import { useMedia, useHasMounted } from '@/design-system/MediaContext';
import { StandardSection } from '@/components/StandardSection';

/* ─────────────────────────────────────────────────────
   CHAMPION HERO v4 — Headline top, editorial bridge, photo below

   Hello Sunshine
   ━━━  Hand-built cedar. · Authentic steam.  ━━━
   [panoramic photo + sauna interior polaroid top-right]
   ───────────────────────────────────────────────────── */

const PHOTO_SRC = "/northern-retreat-sauna-exterior.jpg";
const POLAROID_SRC = "/optimized/polaroids/webp/sauna-interior-wood-stove-glow.webp";

function HeroPhoto() {
    const { openMedia, activeMedia, isTransitioning } = useMedia();
    const id = "hero-main-photo";
    const isActive = activeMedia?.id === id;
    const isShowingGhost = isActive || (isTransitioning && !activeMedia);

    return (
        <div className="relative">
            {/* Polaroid — w-80, +6°, breaking out of top-right corner */}
            <div className="absolute top-[-30%] right-[-2%] z-20" style={{ transform: 'rotate(6deg)' }}>
                <Polaroid
                    src={POLAROID_SRC}
                    label="Inside the warmth."
                    rotation="rotate-0"
                    size="w-80"
                    forcePlaceholder={false}
                />
            </div>

            {/* Panoramic 21:9 photo */}
            <motion.div
                layoutId={id}
                onClick={() => openMedia({ src: PHOTO_SRC, label: 'Hello Sunshine sauna exterior', id, aspect: 'aspect-[21/9]', padding: '10px', borderRadius: '6px' })}
                className={`relative w-full overflow-hidden rounded-md cursor-zoom-in ${isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                style={{
                    aspectRatio: '21/9',
                    boxShadow: '0 calc(20px * var(--shadow-intensity, 1)) 50px -8px rgba(50,43,40,0.4)',
                    padding: '10px',
                    background: '#fff',
                    transform: 'rotate(0.8deg)',
                    transformOrigin: 'center',
                    visibility: isActive ? 'hidden' : 'visible'
                }}>
                <div className="w-full h-full relative overflow-hidden rounded-sm">
                    <Image src={PHOTO_SRC} alt="Hello Sunshine sauna exterior" fill className="object-cover object-center" />
                </div>
            </motion.div>

            {isShowingGhost && (
                <div className="absolute inset-0 opacity-10 grayscale pointer-events-none rounded-md" />
            )}
        </div>
    );
}

export default function HeroSection() {
    const hasMounted = useHasMounted();
    if (!hasMounted) return null;

    return (
        <StandardSection id="hero" variant="naturalPaper" className="pt-40 md:pt-60 relative z-20" containerPadding="px-8" overflowVisible={true}>

            {/* Headline — extra breathing room above */}
            <div className="pt-10 md:pt-14">
                <DappledHeaderStroke
                    line1="Hello Sunshine"
                    line1Size="clamp(58px, 10vw, 142px)"
                    centered={false}
                />
            </div>

            {/* Editorial strip — bridge between headline and photo */}
            <div className="flex items-center gap-6 my-5 md:my-6">
                <div className="h-px flex-1 bg-charcoal/15" />
                <p className="text-xl md:text-2xl opacity-50 shrink-0" style={{ fontFamily: fonts.handwriting }}>
                    Hand-built cedar.&nbsp;·&nbsp;Authentic steam.
                </p>
                <div className="h-px flex-1 bg-charcoal/15" />
            </div>

            {/* Panoramic photo + sauna interior polaroid */}
            <HeroPhoto />

            {/* Kicker */}
            <p className="mt-5 text-right text-xs font-body uppercase tracking-[0.4em] opacity-30">
                A quiet escape into nature.
            </p>

        </StandardSection>
    );
}
