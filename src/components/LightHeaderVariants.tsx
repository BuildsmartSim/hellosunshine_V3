"use client";

import { fonts } from '@/design-system/tokens';

interface HeaderProps {
    line1: string;
    line2?: string;
    subtitle?: string;
    description?: string;
    className?: string;
    centered?: boolean;
}

// Helper for the animated dappled overlay (we reuse this across all 3 options)
function DappledOverlay() {
    return (
        <>
            <div
                className="absolute inset-0 pointer-events-none mix-blend-screen opacity-80 z-20"
                style={{
                    backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, transparent 20%), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.9) 0%, transparent 30%), radial-gradient(circle at 40% 80%, rgba(255,255,255,0.7) 0%, transparent 25%)',
                    backgroundSize: '200% 200%',
                    animation: 'dapple 10s ease-in-out infinite alternate',
                }}
            ></div>
            <style jsx>{`
                @keyframes dapple {
                    0% { background-position: 0% 0%; opacity: 0.5; }
                    50% { opacity: 0.8; }
                    100% { background-position: 100% 100%; opacity: 0.6; }
                }
            `}</style>
        </>
    );
}

// Option C1: Yellow Text + Deep Drop Shadow
export function DappledHeaderShadow({ line1, line2 = "", subtitle, description, className = "", centered = false }: HeaderProps) {
    const textStyle = {
        fontFamily: fonts.accent,
        color: 'var(--hss-primary, #F8C630)',
        // A tight, dark shadow acts as a grounding anchor so the yellow doesn't vanish into the cream background.
        textShadow: '0 4px 12px rgba(44,44,44,0.15), 0 2px 4px rgba(44,44,44,0.1)'
    };

    return (
        <div className={`relative overflow-hidden p-8 -m-8 ${className} ${centered ? 'items-center text-center' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <DappledOverlay />

            <div className="relative z-10 flex flex-col drop-shadow-sm">
                <span className="block" style={{ ...textStyle, fontSize: '50px', lineHeight: 1 }}>
                    {line1}
                </span>
                {line2 && (
                    <span className="block" style={{ ...textStyle, fontSize: '95px', lineHeight: 0.95, marginTop: '-5px' }}>
                        {line2}
                    </span>
                )}
            </div>

            {(subtitle || description) && (
                <div className="relative z-10 flex flex-col border-t" style={{ borderColor: 'rgba(44, 44, 44, 0.1)', gap: '24px', paddingTop: '12px' }}>
                    {subtitle && (
                        <div className="space-y-3">
                            <p style={{ fontFamily: fonts.handwriting }} className="text-3xl text-secondary leading-snug">{subtitle}</p>
                            <div className="h-[2px] w-12 bg-secondary"></div>
                        </div>
                    )}
                    {description && (
                        <div className="text-xl font-display italic max-w-xl text-charcoal/70">{description}</div>
                    )}
                </div>
            )}
        </div>
    );
}

// Option C2: Yellow Text + Delicate Charcoal Stroke
export function DappledHeaderStroke({ line1, line2 = "", subtitle, description, className = "", centered = false }: HeaderProps) {
    const textStyle = {
        fontFamily: fonts.accent,
        color: 'var(--hss-primary, #F8C630)',
        WebkitTextStroke: '1px var(--hss-charcoal, #2C2C2C)',
        textShadow: '0 2px 8px rgba(248,198,48,0.3)' // very subtle self-glow
    };

    return (
        <div className={`relative overflow-hidden p-8 -m-8 ${className} ${centered ? 'items-center text-center' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <DappledOverlay />

            <div className="relative z-10 flex flex-col">
                <span className="block" style={{ ...textStyle, fontSize: '50px', lineHeight: 1 }}>
                    {line1}
                </span>
                {line2 && (
                    <span className="block" style={{ ...textStyle, fontSize: '95px', lineHeight: 0.95, marginTop: '-5px' }}>
                        {line2}
                    </span>
                )}
            </div>

            {(subtitle || description) && (
                <div className="relative z-10 flex flex-col border-t" style={{ borderColor: 'rgba(44, 44, 44, 0.1)', gap: '24px', paddingTop: '12px' }}>
                    {subtitle && (
                        <div className="space-y-3">
                            <p style={{ fontFamily: fonts.handwriting }} className="text-3xl text-secondary leading-snug">{subtitle}</p>
                            <div className="h-[2px] w-12 bg-secondary"></div>
                        </div>
                    )}
                    {description && (
                        <div className="text-xl font-display italic max-w-xl text-charcoal/70">{description}</div>
                    )}
                </div>
            )}
        </div>
    );
}

// Option C3: Golden Gradient Text
export function DappledHeaderGradient({ line1, line2 = "", subtitle, description, className = "", centered = false }: HeaderProps) {
    const gradientStyle = {
        fontFamily: fonts.accent,
        background: 'linear-gradient(180deg, #F8C630 0%, #D4A32A 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        filter: 'drop-shadow(0px 4px 6px rgba(44,44,44,0.1))',
    };

    return (
        <div className={`relative overflow-hidden p-8 -m-8 ${className} ${centered ? 'items-center text-center' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <DappledOverlay />

            <div className="relative z-10 flex flex-col">
                <span className="block" style={{ ...gradientStyle, fontSize: '50px', lineHeight: 1 }}>
                    {line1}
                </span>
                {line2 && (
                    <span className="block" style={{ ...gradientStyle, fontSize: '95px', lineHeight: 0.95, marginTop: '-5px' }}>
                        {line2}
                    </span>
                )}
            </div>

            {(subtitle || description) && (
                <div className="relative z-10 flex flex-col border-t" style={{ borderColor: 'rgba(44, 44, 44, 0.1)', gap: '24px', paddingTop: '12px' }}>
                    {subtitle && (
                        <div className="space-y-3">
                            <p style={{ fontFamily: fonts.handwriting }} className="text-3xl text-secondary leading-snug">{subtitle}</p>
                            <div className="h-[2px] w-12 bg-secondary"></div>
                        </div>
                    )}
                    {description && (
                        <div className="text-xl font-display italic max-w-xl text-charcoal/70">{description}</div>
                    )}
                </div>
            )}
        </div>
    );
}
