"use client";

import React, { useState } from 'react';
import { shadows, fonts, icons } from '@/design-system/tokens';
import Image from 'next/image';
import { Polaroid } from '@/components/Polaroid';
import { StandardSection } from '@/components/StandardSection';
import { motion, AnimatePresence } from 'framer-motion';
import { useMedia, useHasMounted } from '@/design-system/MediaContext';

/* ─────────────────────────────────────────────────────
   SANCTUARY SECTION — Redesigned
   
   - Uniform single-line "The Sanctuary" header
   - Horizontal icon tab bar above body text (large, pill-styled)
   - Body copy changes per service tab
   - Right: cascade of 3 photos + 1 polaroid (unchanged)
   ───────────────────────────────────────────────────── */

const SERVICES = [
    { icon: icons.sauna, label: "Sauna" },
    { icon: icons.hotTub, label: "Hot Tub" },
    { icon: icons.plungePool, label: "Plunge Pool" },
    { icon: icons.firePit, label: "Fire Pit" },
    { icon: icons.shower, label: "Shower" },
    { icon: icons.towels, label: "Towels" },
] as const;

type ServiceType = typeof SERVICES[number]['label'];

/* ── Per-service copy ────────────────────────────── */
const SERVICE_COPY: Record<ServiceType | 'Default', { subtitle: string; body: string }> = {
    'Default': {
        subtitle: 'A garden of elemental rituals.',
        body: 'Safely ensconced within the privacy fencing, sauna guests are liberated to pursue their sauna rituals as comfortably as they feel — whether naked or in a bathing suit, all are welcome & there is no judgement.\n\nWe are focused that the plunge pool is full of icy cold water, the showers have strong water pressure, the changing tent is clean and dry, the firebowl is roaring, and there is plenty of filtered drinking water for all guests.',
    },
    'Sauna': {
        subtitle: 'Open the door to another world.',
        body: 'The caravan is a 1969 Thomson Glenn, able to seat up to 12 guests, beautifully renovated to visually stand out at any event, and fastidiously insulated to maintain a good heat throughout the day.\n\nHeated by an industry standard Harvia M3 stove, we responsibly source kiln-dried oak and ash from local suppliers. Open the door & you step into a world of wood, fire, stones & steam.',
    },
    'Hot Tub': {
        subtitle: '[ Copy needed — please fill in. ]',
        body: '[ This section needs copy. Describe the hot tub experience in Tim\'s voice — warm, communal, unpretentious. ]',
    },
    'Plunge Pool': {
        subtitle: 'Cold is the counterbalance.',
        body: 'The cold water of the plunge pool is the counterbalance to the heat of the sauna, & equally vital in sauna culture. At 6\' round it can seat up to 8 people comfortably.\n\nThe water is changed at the end of each day, & the pool is sterilised with biodegradable soap.',
    },
    'Fire Pit': {
        subtitle: 'The heart of the garden.',
        body: 'The garden\'s social focal point is the large fire bowl with comfortable seating, to warm up & dry yourself down, while our colourful bean bags bring an intimacy to conversations.\n\nAt night the entire space is thoughtfully lit with candles, fairy lights and little yellow globes, creating an ambiance of rich tranquility.',
    },
    'Shower': {
        subtitle: 'Hidden behind bamboo.',
        body: 'The showers are hidden behind bamboo fencing, maintaining privacy during the act of washing & cleaning oneself. Depending on the size of event, up to six showers can be provided.\n\nGuests wash with the provided biodegradable tea tree or lavender body wash — mindful of the land we borrow.',
    },
    'Towels': {
        subtitle: '[ Copy needed — please fill in. ]',
        body: '[ This section needs copy. Mention the 2-towel rule: one to sit on, one to dry. Towels available to buy on site. Keep it warm and practical. ]',
    },
};

/* ── Per-service gallery ─────────────────────────── */
const SERVICE_GALLERY: Record<ServiceType | 'Default', {
    img1: string; img2: string; img3: string;
    polaroid: string; polaroidLabel: string;
}> = {
    'Default': {
        img1: "/optimized/polaroids/webp/caravan-open-door-night-steps.webp",
        img2: "/optimized/polaroids/webp/silver-chimney-rainbow-sky.webp",
        img3: "/optimized/polaroids/webp/sauna-garden-relaxing-crowd.webp",
        polaroid: "/optimized/polaroids/webp/hello-sign-warm-lighting-detail.webp",
        polaroidLabel: "Come on in...",
    },
    'Sauna': {
        img1: "/optimized/polaroids/webp/wood-fired-sauna-interior-benches.webp",
        img2: "/optimized/polaroids/webp/sauna-interior-wood-stove-glow.webp",
        img3: "/optimized/polaroids/webp/chopped-firewood-logs-texture.webp",
        polaroid: "/optimized/photographs/webp/sauna-signage-vintage-caravan-outdoor.webp",
        polaroidLabel: "The sign says it all.",
    },
    'Hot Tub': {
        img1: "/optimized/photographs/webp/happy-group-hot-tub-thumbs-up.webp",
        img2: "/optimized/polaroids/webp/medicine-festival-hot-tub-smiles.webp",
        img3: "/optimized/polaroids/webp/sauna-garden-relaxing-crowd.webp",
        polaroid: "/optimized/polaroids/webp/vintage-silver-caravan-daytime-field.webp",
        polaroidLabel: "Sunset soak",
    },
    'Plunge Pool': {
        img1: "/optimized/photographs/webp/sun-grass-nude.webp",
        img2: "/optimized/polaroids/webp/5-1.webp",
        img3: "/optimized/polaroids/webp/sun-grass-caravan.webp",
        polaroid: "/optimized/polaroids/webp/0b1a91d1-9593-4683-a883-cb6518e4ac33.webp",
        polaroidLabel: "Refresh",
    },
    'Fire Pit': {
        img1: "/optimized/polaroids/webp/night-fire-pit-heart-decor-chairs.webp",
        img2: "/optimized/photographs/webp/caravan-camp-fire-pit-gathering.webp",
        img3: "/optimized/polaroids/webp/caravan-fire-chairs-heart.webp",
        polaroid: "/optimized/photographs/webp/caravan-camp-fire-pit-gathering.webp",
        polaroidLabel: "Singalongs & Starlight",
    },
    'Shower': {
        img1: "/optimized/polaroids/webp/showers_outdoor_square.webp",
        img2: "/optimized/polaroids/webp/collection-of-golden-abstract-sun-logo-free-vector.webp",
        img3: "/optimized/polaroids/webp/caravan-metallic-detail-curve.webp",
        polaroid: "/optimized/polaroids/webp/hello-sign-warm-lighting-detail.webp",
        polaroidLabel: "Art of the Sauna",
    },
    'Towels': {
        img1: "/optimized/polaroids/webp/caravan-interior-night-square.webp",
        img2: "/optimized/polaroids/webp/showers_outdoor_square.webp",
        img3: "/optimized/polaroids/webp/sun-grass-caravan.webp",
        polaroid: "/optimized/polaroids/webp/caravan-garden-people.webp",
        polaroidLabel: "Garlands & Good vibes",
    },
};

/* ── Photo component ─────────────────────────────── */
function Photo({ src, tilt = "0deg", className = "", alt = "Photo", id, aspect = 'aspect-square', onMouseEnter, onMouseLeave }: {
    src: string; tilt?: string; className?: string; alt?: string; id: string;
    aspect?: string; onMouseEnter?: () => void; onMouseLeave?: () => void;
}) {
    const { openMedia, activeMedia, isTransitioning } = useMedia();
    const isActive = activeMedia?.id === id;
    const isShowingGhost = isActive || (isTransitioning && !activeMedia);

    return (
        <div className={`relative overflow-hidden ${className}`} style={{ transform: `rotate(${tilt})` }}
            onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            {(isActive || isShowingGhost) && (
                <div className="absolute inset-0 z-0 opacity-10 grayscale scale-[0.99] pointer-events-none"
                    style={{ background: '#fff', padding: '12px', borderRadius: '4px' }}>
                    <div className="w-full h-full bg-charcoal/5" style={{ borderRadius: '2px' }} />
                </div>
            )}
            <motion.div layoutId={id}
                onClick={() => openMedia({ src, label: alt, id, aspect, padding: '12px', borderRadius: '4px' })}
                className={`relative z-10 w-full h-full cursor-zoom-in ${isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                style={{ padding: "12px", background: "#fff", borderRadius: "4px", boxShadow: shadows.photo, visibility: isActive ? 'hidden' : 'visible' }}>
                <div className="w-full h-full bg-charcoal/5 relative overflow-hidden border border-charcoal/5" style={{ borderRadius: "2px" }}>
                    <Image src={src} alt={alt} fill className="object-cover transition-opacity duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
            </motion.div>
        </div>
    );
}

/* ── Icon tab row ────────────────────────────────── */
function ServiceTabs({ services, activeService, onSelect }: {
    services: typeof SERVICES;
    activeService: ServiceType | null;
    onSelect: (s: ServiceType) => void;
}) {
    return (
        <div className="grid grid-cols-6 gap-2">
            {services.map((s) => {
                const isActive = activeService === s.label;
                return (
                    <button
                        key={s.label}
                        onClick={() => onSelect(s.label)}
                        title={s.label}
                        className={`flex flex-col items-center gap-1.5 py-3 rounded-full border transition-all duration-300 focus:outline-none group min-w-0
                            ${isActive
                                ? 'bg-primary border-primary shadow-md scale-105'
                                : 'bg-charcoal/[0.03] border-charcoal/10 hover:bg-primary/10 hover:border-primary/30 hover:scale-105'
                            }`}
                    >
                        <Image
                            src={s.icon}
                            alt={s.label}
                            width={36}
                            height={36}
                            className={`w-9 h-9 object-contain transition-all duration-300 ${isActive ? 'brightness-0 invert' : 'opacity-50 group-hover:opacity-80'}`}
                        />
                        <span className={`text-[9px] font-body uppercase tracking-widest font-semibold truncate w-full text-center px-1 transition-colors duration-300
                            ${isActive ? 'text-charcoal' : 'text-charcoal/40 group-hover:text-charcoal/70'}`}>
                            {s.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

/* ── Left column ─────────────────────────────────── */
function LeftColumn({ activeService, onSelect }: { activeService: ServiceType | null; onSelect: (s: ServiceType) => void }) {
    const copy = activeService ? SERVICE_COPY[activeService] : SERVICE_COPY['Default'];
    const isPlaceholder = copy.subtitle.startsWith('[');

    return (
        <div className="space-y-7 pt-4">
            {/* Uniform single-line header */}
            <h2 style={{
                fontFamily: `'ChicleForce', var(--font-chicle), cursive`,
                fontSize: 'clamp(48px, 5vw, 78px)',
                lineHeight: '0.95',
                letterSpacing: '-0.01em',
                color: 'var(--hss-charcoal, #2C2C2C)',
            }}>
                The Sanctuary
            </h2>

            {/* Service tab row — above body text */}
            <ServiceTabs services={SERVICES} activeService={activeService} onSelect={onSelect} />

            {/* Body copy — changes per service */}
            <div className="border-t border-charcoal/10 pt-6 space-y-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeService ?? 'default'}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-4"
                    >
                        <p style={{ fontFamily: fonts.handwriting }}
                            className={`text-2xl leading-snug ${isPlaceholder ? 'text-charcoal/25 italic' : 'text-charcoal/55'}`}>
                            {copy.subtitle}
                        </p>
                        <div className="h-[2px] w-10 bg-primary" />
                        {copy.body.split('\n\n').map((para, i) => (
                            <p key={i} className={`text-sm leading-relaxed tracking-wide font-body text-justify
                                ${isPlaceholder ? 'text-charcoal/25 italic' : 'text-charcoal/80'}`}>
                                {para}
                            </p>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

/* ── Main component ──────────────────────────────── */
export default function SanctuarySection() {
    const hasMounted = useHasMounted();
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [activeService, setActiveService] = useState<ServiceType | null>(null);

    if (!hasMounted) return null;

    const currentImages = activeService ? SERVICE_GALLERY[activeService] : SERVICE_GALLERY['Default'];

    const getTransform = (id: string, baseTilt: string, direction: 'top-left' | 'mid-right' | 'bottom-left' | 'polaroid') => {
        const isHovered = hoveredId === id;
        const isAnyHovered = hoveredId !== null;
        let scale = "scale(1)", translate = "translate(0, 0)", rotate = `rotate(${baseTilt})`;

        if (isHovered) { scale = "scale(1.05)"; rotate = "rotate(0deg)"; }
        else if (isAnyHovered) {
            if (hoveredId === '1') {
                if (direction === 'mid-right') translate = "translate(40px, 40px)";
                if (direction === 'bottom-left') translate = "translate(0px, 60px)";
                if (direction === 'polaroid') translate = "translate(40px, 40px)";
            }
            if (hoveredId === '2') {
                if (direction === 'top-left') translate = "translate(-40px, -20px)";
                if (direction === 'bottom-left') translate = "translate(-20px, 40px)";
                if (direction === 'polaroid') translate = "translate(0px, 60px)";
            }
            if (hoveredId === '3') {
                if (direction === 'top-left') translate = "translate(-20px, -60px)";
                if (direction === 'mid-right') translate = "translate(40px, -20px)";
                if (direction === 'polaroid') translate = "translate(60px, 20px)";
            }
            if (hoveredId === '4') {
                if (direction === 'top-left') translate = "translate(-40px, -40px)";
                if (direction === 'mid-right') translate = "translate(20px, -60px)";
                if (direction === 'bottom-left') translate = "translate(-60px, 0px)";
            }
            scale = "scale(0.95)";
        }

        return {
            transform: `${translate} ${rotate} ${scale}`,
            zIndex: isHovered ? 50 : (isAnyHovered ? 0 : (direction === 'top-left' ? 10 : direction === 'mid-right' ? 20 : direction === 'bottom-left' ? 30 : 40)),
            opacity: isAnyHovered && !isHovered ? 0.6 : 1,
        };
    };

    return (
        <StandardSection id="sanctuary" variant="naturalPaper" className="relative z-10" overflowVisible={true}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">

                {/* Left column — 5 cols */}
                <div className="col-span-1 md:col-span-5">
                    <LeftColumn activeService={activeService} onSelect={setActiveService} />
                </div>

                {/* Right column — photo cascade — unchanged */}
                <div className="col-span-1 md:col-span-7 relative min-h-[820px]" onMouseLeave={() => setHoveredId(null)}>

                    <div className="absolute top-0 left-0 w-[60%] transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)]"
                        style={getTransform('1', '-2deg', 'top-left')} onMouseEnter={() => setHoveredId('1')}>
                        <Photo id="sanctuary-1" src={currentImages.img1} className="aspect-[4/3] w-full" aspect="aspect-[4/3]"
                            alt={activeService ? `${activeService} — image 1` : 'The Welcome Glow'} />
                    </div>

                    <div className="absolute top-24 right-0 w-[65%] transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)]"
                        style={getTransform('2', '1deg', 'mid-right')} onMouseEnter={() => setHoveredId('2')}>
                        <Photo id="sanctuary-2" src={currentImages.img2} className="aspect-video w-full" aspect="aspect-video"
                            alt={activeService ? `${activeService} — image 2` : 'Come on in...'} />
                    </div>

                    <div className="absolute top-[280px] left-12 w-[55%] transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)]"
                        style={getTransform('3', '-1deg', 'bottom-left')} onMouseEnter={() => setHoveredId('3')}>
                        <Photo id="sanctuary-3" src={currentImages.img3} className="aspect-square w-full" aspect="aspect-square"
                            alt={activeService ? `${activeService} — image 3` : 'Rainbow over the sauna'} />
                    </div>

                    <div className="absolute bottom-[-20px] right-12 transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)]"
                        style={getTransform('4', '3deg', 'polaroid')} onMouseEnter={() => setHoveredId('4')}>
                        <Polaroid src={currentImages.polaroid} label={currentImages.polaroidLabel}
                            rotation="rotate-0" size="w-48" forcePlaceholder={false} />
                    </div>

                </div>
            </div>
        </StandardSection>
    );
}
