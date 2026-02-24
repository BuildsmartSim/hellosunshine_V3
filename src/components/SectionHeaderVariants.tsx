"use client";

import React from 'react';
import { fonts, pencil } from '@/design-system/tokens';
import { LayeredPencil } from '@/components/LayeredPencil';

interface HeaderProps {
    line1: string;
    line2?: string;
    subtitle?: string; // e.g. "EST. 2024"
    description?: string;
    className?: string;
    centered?: boolean;
}

// OPTION 1: Playfair Display + Charcoal Pencil Hatch
// Elegant, editorial serif with the trademark hand-drawn texture
export function SectionHeaderPlayfair({ line1, line2 = "", subtitle, description, className = "", centered = false }: HeaderProps) {
    return (
        <div
            className={`${className} flex flex-col ${centered ? 'items-center text-center' : ''}`}
            style={{ gap: 'var(--hss-header-subtitle-gap, 16px)' }}
        >
            <div className="relative">
                <LayeredPencil
                    text={line1}
                    size="50px"
                    hatchClass={pencil.hatch.charcoalShaded}
                    strokeColor="var(--hss-charcoal, #2C2C2C)"
                    fillOpacity="1"
                    fontFamily={fonts.display}
                    as="span"
                />
                <LayeredPencil
                    text={line2}
                    size="85px"
                    hatchClass={pencil.hatch.charcoalShaded}
                    strokeColor="var(--hss-charcoal, #2C2C2C)"
                    className="block"
                    style={{ marginTop: '-10px' }} // Playfair needs a bit tighter interlock than Chicle
                    fillOpacity="1"
                    fontFamily={fonts.display}
                    as="h2"
                />
            </div>

            {(subtitle || description) && (
                <div
                    className="flex flex-col border-t border-charcoal/10"
                    style={{ gap: 'calc(var(--hss-header-subtitle-gap, 16px) * 1.5)', paddingTop: 'calc(var(--hss-header-subtitle-gap, 16px) * 0.75)' }}
                >
                    {subtitle && (
                        <div className="space-y-3">
                            <p style={{ fontFamily: fonts.handwriting }} className="text-2xl text-charcoal/50 leading-snug">
                                {subtitle}
                            </p>
                            <div className={`h-[2px] w-12 ${centered ? 'mx-auto' : ''}`} style={{ backgroundColor: 'var(--hss-primary, #F8C630)' }}></div>
                        </div>
                    )}
                    {description && (
                        <div className="text-xl font-display italic text-charcoal/40 max-w-xl">
                            {description}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// OPTION 2: DM Sans Bold
// Extremely clean, modern, and high contrast against the ornate pencil effects
export function SectionHeaderSans({ line1, line2 = "", subtitle, description, className = "", centered = false }: HeaderProps) {
    return (
        <div
            className={`${className} flex flex-col ${centered ? 'items-center text-center' : ''}`}
            style={{ gap: 'var(--hss-header-subtitle-gap, 24px)' }}
        >
            <div className="relative text-charcoal" style={{ fontFamily: fonts.body, fontWeight: 700, lineHeight: 1 }}>
                <span className="block text-[36px] uppercase tracking-[0.2em] opacity-50 mb-4">{line1}</span>
                <span className="block text-[72px] tracking-tight">{line2}</span>
            </div>

            {(subtitle || description) && (
                <div
                    className="flex flex-col border-t border-charcoal/10"
                    style={{ gap: 'calc(var(--hss-header-subtitle-gap, 16px) * 1.5)', paddingTop: 'calc(var(--hss-header-subtitle-gap, 16px) * 1.5)' }}
                >
                    {subtitle && (
                        <div className="space-y-3">
                            <p style={{ fontFamily: fonts.handwriting }} className="text-2xl text-charcoal/50 leading-snug">
                                {subtitle}
                            </p>
                            <div className={`h-[2px] w-12 ${centered ? 'mx-auto' : ''}`} style={{ backgroundColor: 'var(--hss-primary, #F8C630)' }}></div>
                        </div>
                    )}
                    {description && (
                        <div className="text-xl font-display italic text-charcoal/40 max-w-xl">
                            {description}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// OPTION 3: Playfair + Yellow Stroke (Hero Match)
// Matches the exact visual language of the new Hero Option C2 (Yellow text, dark stroke, hand-drawn filter)
export function SectionHeaderStroke({ line1, line2 = "", subtitle, description, className = "", centered = false }: HeaderProps) {
    return (
        <div
            className={`${className} flex flex-col ${centered ? 'items-center text-center' : ''}`}
            style={{ gap: 'var(--hss-header-subtitle-gap, 16px)' }}
        >
            <div
                className="relative pencil-stroke-only"
                style={{
                    fontFamily: fonts.display,
                    color: 'var(--hss-primary, #F8C630)',
                    WebkitTextStroke: '1px var(--hss-charcoal, #2C2C2C)',
                    filter: 'url(#hand-drawn)',
                    lineHeight: 1
                }}
            >
                <span className="block text-[50px] italic pr-4">{line1}</span>
                <span className="block text-[85px] mt-[-10px]">{line2}</span>
            </div>

            {(subtitle || description) && (
                <div
                    className="flex flex-col border-t border-charcoal/10"
                    style={{ gap: 'calc(var(--hss-header-subtitle-gap, 16px) * 1.5)', paddingTop: 'calc(var(--hss-header-subtitle-gap, 16px) * 0.75)' }}
                >
                    {subtitle && (
                        <div className="space-y-3">
                            <p style={{ fontFamily: fonts.handwriting }} className="text-2xl text-charcoal/50 leading-snug">
                                {subtitle}
                            </p>
                            <div className={`h-[2px] w-12 ${centered ? 'mx-auto' : ''}`} style={{ backgroundColor: 'var(--hss-primary, #F8C630)' }}></div>
                        </div>
                    )}
                    {description && (
                        <div className="text-xl font-display italic text-charcoal/40 max-w-xl">
                            {description}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
