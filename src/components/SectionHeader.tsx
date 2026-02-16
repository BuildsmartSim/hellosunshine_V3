"use client";

import React from 'react';
import { LayeredPencil } from './LayeredPencil';
import { pencil, colors, fonts } from '@/design-system/tokens';

interface SectionHeaderProps {
    line1: string;
    line2: string;
    subtitle?: string;
    description?: React.ReactNode;
    className?: string;
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
export function SectionHeader({ line1, line2, subtitle, description, className = "" }: SectionHeaderProps) {
    return (
        <div className={`space-y-4 ${className}`}>
            <div className="relative">
                {/* Line 1: 50px Standard */}
                <LayeredPencil
                    text={line1}
                    size="50px"
                    hatchClass={pencil.hatch.charcoalShaded}
                    strokeColor={colors.charcoal}
                    fillOpacity="1" // Opacity handled via CSS filter in globals.css
                />

                {/* Line 2: 85px with NO overlap to prevent frustration */}
                <LayeredPencil
                    text={line2}
                    size="85px"
                    hatchClass={pencil.hatch.charcoalShaded}
                    strokeColor={colors.charcoal}
                    className="mt-0" // Removed negative margin to prevent overlap
                    fillOpacity="1"
                />
            </div>

            {(subtitle || description) && (
                <div className="flex flex-col gap-6 border-t border-charcoal/10 pt-8 mt-8">
                    {subtitle && (
                        <div className="space-y-6">
                            <p style={{ fontFamily: fonts.handwriting }} className="text-2xl text-charcoal/50 leading-snug">
                                {subtitle}
                            </p>
                            <div className="h-[2px] w-12 bg-primary"></div>
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
