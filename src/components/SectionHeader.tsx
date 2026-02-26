"use client";

import { fonts, pencil } from '@/design-system/tokens';
import { LayeredPencil } from '@/components/LayeredPencil';

interface SectionHeaderProps {
    line1: string;
    line2?: string;
    subtitle?: string; // e.g. "EST. 2024"
    description?: string;
    className?: string;
    centered?: boolean;
}

/**
 * THE DEFINITIVE SECTION HEADER
 * 
 * Standardizes the 50px/85px Chicle stack used across:
 * - Sanctuary
 * - Ticketing
 * - Guestbook
 * 
 * Includes the specific charcoal hatch fill (faded) and 
 * fixed line-interlock spacing to prevent overlap.
 */

export function SectionHeader({ line1, line2 = "", subtitle, description, className = "", centered = false }: SectionHeaderProps) {
    const fullHeading = line2 ? `${line1} ${line2}` : line1;

    return (
        <div className={`${className} ${centered ? 'flex flex-col items-center text-center' : ''}`}>
            <h2
                style={{
                    fontFamily: `'ChicleForce', var(--font-chicle), cursive`,
                    fontSize: 'clamp(48px, 5vw, 78px)',
                    lineHeight: '0.95',
                    letterSpacing: '-0.01em',
                    color: 'var(--hss-charcoal, #2C2C2C)',
                }}
                className="mb-1"
            >
                {fullHeading}
            </h2>

            {(subtitle || description) && (
                <div className="flex flex-col gap-2">
                    {subtitle && (
                        <p
                            style={{ fontFamily: fonts.handwriting }}
                            className="text-2xl text-charcoal/45 leading-relaxed"
                        >
                            {subtitle}
                        </p>
                    )}
                    {description && (
                        <div className="text-xl font-display italic text-charcoal/40 max-w-xl mt-4">
                            {description}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
