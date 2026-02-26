"use client";

import React from 'react';
import Image from 'next/image';
import { Polaroid } from '@/components/Polaroid';
import { DappledHeaderStroke } from '@/components/LightHeaderVariants';
import { fonts } from '@/design-system/tokens';
import { useHasMounted } from '@/design-system/MediaContext';

const PHOTO_SRC = "/northern-retreat-sauna-exterior.jpg";
const POLAROID_SRC = "/optimized/polaroids/webp/vintage-silver-caravan-daytime-field.webp";
const siteWidth = { maxWidth: 'var(--hss-site-width, 1280px)' };
const bg = 'linear-gradient(135deg, #f5efe4 0%, #ede6d3 100%)';

function VariantLabel({ num, title, desc }: { num: string; title: string; desc: string }) {
    return (
        <div className="flex items-start gap-4 mb-10">
            <div className="w-10 h-10 shrink-0 rounded-full bg-charcoal flex items-center justify-center text-sm font-bold font-mono" style={{ color: '#f5efe4' }}>{num}</div>
            <div>
                <p className="font-bold font-body text-charcoal text-sm uppercase tracking-widest">{title}</p>
                <p className="font-body text-sm mt-0.5 opacity-50">{desc}</p>
            </div>
        </div>
    );
}

function PanoPhoto() {
    return (
        <div className="relative w-full overflow-hidden rounded-md"
            style={{ aspectRatio: '21/9', boxShadow: '0 20px 50px -8px rgba(50,43,40,0.4)', padding: '10px', background: '#fff', transform: 'rotate(0.8deg)', transformOrigin: 'center' }}>
            <div className="w-full h-full relative overflow-hidden rounded-sm">
                <Image src={PHOTO_SRC} alt="Hello Sunshine sauna" fill className="object-cover object-center" />
            </div>
        </div>
    );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   VARIANT 1 — Headline top-left, polaroid top-right
   Headline and polaroid sit side-by-side above the photo.
   The photo anchors the bottom of the hero.
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Variant1() {
    return (
        <section className="min-h-screen flex flex-col justify-center py-24 px-8" style={{ background: bg }}>
            <div className="mx-auto w-full" style={siteWidth}>
                <VariantLabel num="1" title="Headline left, polaroid right — photo below"
                    desc="Headline and polaroid sit side-by-side in a row, photo below." />

                {/* Top row: headline left, polaroid right */}
                <div className="flex items-end justify-between mb-10 gap-8">
                    <div className="flex-1">
                        <div className="flex items-center gap-5 mb-4">
                            <div className="h-px flex-1 bg-charcoal/12" />
                            <p className="text-sm opacity-45 shrink-0" style={{ fontFamily: fonts.handwriting }}>
                                Hand-built cedar.&nbsp;·&nbsp;Authentic steam.
                            </p>
                            <div className="h-px flex-1 bg-charcoal/12" />
                        </div>
                        <DappledHeaderStroke line1="Hello Sunshine" line1Size="clamp(48px, 8vw, 118px)" centered={false} />
                    </div>
                    <div className="shrink-0" style={{ transform: 'rotate(6deg)' }}>
                        <Polaroid src={POLAROID_SRC} label="Home on wheels." rotation="rotate-0" size="w-64" forcePlaceholder={false} />
                    </div>
                </div>

                {/* Photo below */}
                <PanoPhoto />

                <p className="mt-5 text-right text-xs font-body uppercase tracking-[0.4em] opacity-30">A quiet escape into nature.</p>
            </div>
        </section>
    );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   VARIANT 2 — Headline stacked above photo, polaroid breaks
   out of the top-right corner of the photo frame.
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Variant2() {
    return (
        <section className="min-h-screen flex flex-col justify-center py-24 px-8" style={{ background: bg }}>
            <div className="mx-auto w-full" style={siteWidth}>
                <VariantLabel num="2" title="Headline above photo, polaroid breaks top-right corner"
                    desc="Headline sits above. Polaroid anchors to the top-right corner of the photo, breaking upward." />

                {/* Headline above */}
                <div className="mb-8">
                    <div className="flex items-center gap-5 mb-4">
                        <div className="h-px flex-1 bg-charcoal/12" />
                        <p className="text-sm opacity-45 shrink-0" style={{ fontFamily: fonts.handwriting }}>
                            Hand-built cedar.&nbsp;·&nbsp;Authentic steam.
                        </p>
                        <div className="h-px flex-1 bg-charcoal/12" />
                    </div>
                    <DappledHeaderStroke line1="Hello Sunshine" line1Size="clamp(58px, 10vw, 142px)" centered={false} />
                </div>

                {/* Photo with polaroid breaking out top-right */}
                <div className="relative">
                    {/* Polaroid breaking out of top-right corner of photo */}
                    <div className="absolute top-[-22%] right-[-3%] z-20" style={{ transform: 'rotate(6deg)' }}>
                        <Polaroid src={POLAROID_SRC} label="Home on wheels." rotation="rotate-0" size="w-80" forcePlaceholder={false} />
                    </div>
                    <PanoPhoto />
                </div>

                <p className="mt-5 text-right text-xs font-body uppercase tracking-[0.4em] opacity-30">A quiet escape into nature.</p>
            </div>
        </section>
    );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   VARIANT 3 — Headline above, editorial strip as bridge, photo below
   More breathing room at the top. Rule + subtitle sits neatly
   between the headline and the photo frame.
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Variant3() {
    return (
        <section className="min-h-screen flex flex-col justify-center py-24 px-8" style={{ background: bg }}>
            <div className="mx-auto w-full" style={siteWidth}>
                <VariantLabel num="3" title="Refined — headline top, editorial strip as bridge"
                    desc="More space at top. Rule + subtitle sits neatly between headline and photo." />

                {/* Extra breathing room above the headline */}
                <div className="pt-8">
                    {/* Full-width headline */}
                    <DappledHeaderStroke line1="Hello Sunshine" line1Size="clamp(58px, 10vw, 142px)" centered={false} />
                </div>

                {/* Editorial strip — bridge between headline and photo */}
                <div className="flex items-center gap-6 my-6">
                    <div className="h-px flex-1 bg-charcoal/15" />
                    <p className="text-sm opacity-45 shrink-0" style={{ fontFamily: fonts.handwriting }}>
                        Hand-built cedar.&nbsp;·&nbsp;Authentic steam.
                    </p>
                    <div className="h-px flex-1 bg-charcoal/15" />
                </div>

                {/* Photo with polaroid at top-right, breaking upward */}
                <div className="relative">
                    <div className="absolute top-[-30%] right-[-2%] z-20" style={{ transform: 'rotate(6deg)' }}>
                        <Polaroid src={POLAROID_SRC} label="Home on wheels." rotation="rotate-0" size="w-80" forcePlaceholder={false} />
                    </div>
                    <PanoPhoto />
                </div>

                <p className="mt-5 text-right text-xs font-body uppercase tracking-[0.4em] opacity-30">A quiet escape into nature.</p>
            </div>
        </section>
    );
}

export default function HeroConceptsPage() {
    const hasMounted = useHasMounted();
    if (!hasMounted) return null;

    return (
        <main className="font-body">
            <div className="sticky top-0 z-50 py-4 px-8 border-b" style={{ background: '#1C1E1F', borderColor: 'rgba(255,255,255,0.08)' }}>
                <div className="mx-auto flex items-center justify-between" style={siteWidth}>
                    <p className="text-sm font-bold" style={{ color: '#f9cb40' }}>Headline + polaroid at the top — photo below</p>
                    <a href="/" className="text-xs font-mono uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity" style={{ color: '#f5efe4' }}>← Back</a>
                </div>
            </div>

            <Variant1 />
            <div className="h-1 bg-charcoal/20" />
            <Variant2 />
            <div className="h-1 bg-charcoal/20" />
            <Variant3 />
        </main>
    );
}
