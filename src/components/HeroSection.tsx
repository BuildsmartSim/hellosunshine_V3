"use client";

import React from 'react';
import Image from 'next/image';
import { Polaroid } from '@/components/Polaroid';
import { LayeredPencil } from '@/components/LayeredPencil';




/* ─────────────────────────────────────────────────────
   CHAMPION HERO (ID 47002)
   
   The established visual architecture for Hello Sunshine.
   - 9 Columns (Photo) / 3 Columns (Text)
   - Organic Feathered Line Anchor
   - "Hello Sunshine" Layered Pencil Header
   ───────────────────────────────────────────────────── */


/* Specifications */
// championPhotoShadow removed

// Actually, I'll delete the unused lines in separate chunks or just one big chunk?
// I'll define interfaces and use them.

interface OrganicLineProps {
    type?: string;
    className?: string;
    height?: string;
}

function OrganicLine({ type = "graphite", className = "", height = "h-[500px]" }: OrganicLineProps) {
    if (type === "graphite") {
        return (
            <div className={`relative w-2 ${height} ${className}`}>
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-charcoal/40" style={{ filter: 'url(#hand-drawn)' }}></div>
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[3px] bg-charcoal/10 pencil-soft filter blur-[1px]"></div>
                <div className="absolute top-0 left-[20%] w-[0.5px] h-32 bg-charcoal/20 rotate-[1deg]" style={{ filter: 'url(#hand-drawn)' }}></div>
                <div className="absolute bottom-24 right-[20%] w-[0.5px] h-48 bg-charcoal/20 rotate-[-1deg]" style={{ filter: 'url(#hand-drawn)' }}></div>
            </div>
        );
    }
    return null;
}

interface LandscapePhotoProps {
    src: string;
    alt: string;
    className?: string;
    tilt?: string;
    shadowStyle?: string;
    borderSize?: string;
    borderRadius?: string;
}

import { motion } from 'framer-motion';
import { useMedia } from '@/design-system/MediaContext';

function LandscapePhoto({ src, alt, className = "", tilt = "rotate-0", shadowStyle = "", borderSize = "12px", borderRadius = "4px" }: LandscapePhotoProps) {
    const { openMedia, activeMedia, isTransitioning } = useMedia();
    const id = `hero-photo-${src}`;

    const isActive = activeMedia?.id === id;
    const isShowingGhost = isActive || (isTransitioning && !activeMedia);

    return (
        <div className={`relative ${tilt} ${className}`}>
            {/* ── THE GHOST (BASE LAYER) ──────────────────── */}
            {(isActive || isShowingGhost) && (
                <div
                    className="absolute inset-0 z-0 opacity-10 grayscale scale-[0.99] border border-charcoal/5 pointer-events-none"
                    style={{ borderRadius, padding: borderSize }}
                >
                    <div className="w-full h-full bg-charcoal/5" style={{ borderRadius: '2px' }} />
                </div>
            )}

            {/* ── THE REAL PIECE (SHARED ELEMENT) ────────── */}
            <motion.div
                layoutId={id}
                onClick={() => openMedia({
                    src,
                    label: alt,
                    id,
                    aspect: 'aspect-[16/9]',
                    padding: borderSize,
                    borderRadius: borderRadius
                })}
                className={`relative z-10 aspect-[16/9] bg-white cursor-zoom-in ${isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                style={{
                    boxShadow: shadowStyle,
                    padding: borderSize,
                    borderRadius: borderRadius,
                    // Manual visibility toggle to help Framer Motion hide the background when viewer is active
                    visibility: isActive ? 'hidden' : 'visible'
                }}>
                <div className="w-full h-full bg-charcoal/10 relative overflow-hidden flex items-center justify-center" style={{ borderRadius: `calc(${borderRadius} / 2)` }}>
                    <Image src={src} alt={alt} fill className="object-cover" />
                </div>
            </motion.div>
        </div>
    );
}

import { StandardSection } from '@/components/StandardSection';
import { useHasMounted } from '@/design-system/MediaContext';

export default function HeroSection() {
    const hasMounted = useHasMounted();

    if (!hasMounted) return null;

    return (
        <StandardSection id="hero" variant="naturalPaper" className="pt-32 md:pt-56 relative z-20" containerPadding="px-8" overflowVisible={true}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-0 items-center">

                {/* Photo Area (col-span-1 md:col-span-8) - Expanded to fill middle gap */}
                <div className="col-span-1 md:col-span-8 relative mb-16 md:mb-0">
                    <div style={{ transform: 'rotate(2deg)', transformOrigin: 'center center' }}>
                        <LandscapePhoto
                            src="/northern-retreat-sauna-exterior.jpg"
                            alt="A relaxing lawn session by the silver caravan"
                            className="w-full z-10 relative"
                            tilt="rotate-0"
                            shadowStyle={`0 calc(15px * var(--shadow-intensity, 1)) 30px -5px rgba(50, 43, 40, 0.45)`}
                        />
                    </div>
                    {/* Polaroid Wrapper with forced inline rotation */}
                    <div className="absolute bottom-[-25%] left-0 z-20" style={{ transform: 'rotate(-10deg)' }}>
                        <Polaroid
                            src="/optimized/polaroids/webp/vintage-silver-caravan-daytime-field.webp"
                            label="Home on wheels."
                            rotation="rotate-0"
                            size="w-56"
                            forcePlaceholder={false}
                            className="scale-110"
                        />
                    </div>
                </div>

                {/* Typography Area - Anchored to Right Boundary */}
                <div className="col-span-1 md:col-span-4 h-full flex items-start md:justify-end gap-6 md:pt-16 md:pl-0">
                    {/* Vertical line hidden on mobile */}
                    <div className="hidden md:block">
                        <OrganicLine type="graphite" className="opacity-50" />
                    </div>

                    <div className="space-y-12 py-4">
                        <div className="relative left-[-10px] md:left-0 flex flex-col">
                            <LayeredPencil
                                hatchClass="hatch-aesthetic-yellow-bold"
                                strokeColor="#1F1A17"
                                strokeWidth="1.2px"
                                fillOpacity="0.95"
                                strokeOpacity="1"
                                blendClass="pencil-blend-multiply"
                                size="85px"
                                text="Hello"
                                className="ml-4"
                                as="h1"
                            />
                            <LayeredPencil
                                hatchClass="hatch-aesthetic-yellow-bold"
                                strokeColor="#1F1A17"
                                strokeWidth="1.5px"
                                fillOpacity="1"
                                strokeOpacity="1"
                                blendClass="pencil-blend-multiply"
                                size="125px"
                                text="Sunshine"
                                as="h1"
                                style={{ marginTop: 'var(--hss-header-interlock, 0px)' }}
                            />
                        </div>

                        <div
                            className="flex flex-col max-w-[250px]"
                            style={{ gap: 'var(--hss-header-subtitle-gap, 32px)' }}
                        >
                            <p style={{ fontFamily: 'var(--font-caveat)' }} className="text-3xl text-charcoal/50 leading-snug">
                                Hand-built cedar.<br />Authentic steam.
                            </p>
                            <div className="h-[2px] w-12" style={{ backgroundColor: 'var(--hss-primary, #F8C630)', opacity: 0.2 }}></div>
                        </div>
                    </div>
                </div>

            </div>
        </StandardSection>
    );
}
