/**
 * SunshineTemplate — Shared social media visual template.
 *
 * IMPORTANT: All layout uses inline styles with PIXEL values.
 * Satori requires this — Tailwind/CSS classes don't work server-side.
 * The browser live-preview renders the same component, so both stay in sync.
 */

export type TemplateStyle = 'festival' | 'announcement';

export interface SunshineTemplateProps {
    style: TemplateStyle;
    headline: string;
    body: string;
    /** Optional bg photo — data URL (from file input) or external URL */
    bgImageUrl?: string;
    /** Scale factor for live-preview (1 = full 1080px, 0.44 for ~480px preview) */
    scale?: number;
    /** Base URL of the site, needed by Satori to resolve /public assets */
    siteUrl?: string;
}

const CANVAS_SIZE = 1080;

// ─── Palettes ────────────────────────────────────────────────────────────────

const PALETTES = {
    festival: {
        bg: 'linear-gradient(145deg, #f5a623 0%, #f0782a 40%, #c0392b 100%)',
        badgeBg: '#fff',
        badgeText: '#c0392b',
        headlineColor: '#fff',
        bodyColor: 'rgba(255,255,255,0.88)',
        logoColor: '#fff',
        borderColor: 'rgba(255,255,255,0.35)',
        overlayGradient: 'linear-gradient(to bottom, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.65) 100%)',
    },
    announcement: {
        bg: 'linear-gradient(160deg, #1a1209 0%, #2c1f0e 60%, #3d2b14 100%)',
        badgeBg: '#e8c47a',
        badgeText: '#1a1209',
        headlineColor: '#f5e6c8',
        bodyColor: 'rgba(245,230,200,0.82)',
        logoColor: '#e8c47a',
        borderColor: 'rgba(232,196,122,0.40)',
        overlayGradient: 'linear-gradient(to bottom, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.72) 100%)',
    },
} as const;

export function SunshineTemplate({
    style,
    headline,
    body,
    bgImageUrl,
    scale = 1,
    siteUrl = '',
}: SunshineTemplateProps) {
    const pal = PALETTES[style];
    const size = CANVAS_SIZE * scale;
    const px = (n: number) => Math.round(n * scale);

    // Logo src: absolute URL for Satori (server), relative for browser
    const logoSrc = siteUrl
        ? `${siteUrl}/HSSLOGO black YELLOW.png`
        : '/HSSLOGO black YELLOW.png';

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: size,
                height: size,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* ── Background ─────────────────────────────────────────────── */}
            {bgImageUrl ? (
                // Photo background
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url(${bgImageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            ) : (
                // Gradient background
                <div style={{ position: 'absolute', inset: 0, background: pal.bg }} />
            )}

            {/* Darkening overlay (always shown on top of photo; subtle on gradient) */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: bgImageUrl ? pal.overlayGradient : 'rgba(0,0,0,0.08)',
                }}
            />

            {/* ── Border frame ───────────────────────────────────────────── */}
            <div
                style={{
                    position: 'absolute',
                    inset: px(28),
                    border: `${px(2)}px solid ${pal.borderColor}`,
                    borderRadius: px(4),
                }}
            />

            {/* ── Content ────────────────────────────────────────────────── */}
            <div
                style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%',
                    padding: px(72),
                }}
            >
                {/* TOP: Real HSS logo */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={logoSrc}
                        alt="Hello Sunshine"
                        width={px(120)}
                        height={px(120)}
                        style={{ objectFit: 'contain', filter: style === 'festival' ? 'brightness(0) invert(1)' : 'none' }}
                    />
                </div>

                {/* MIDDLE: Headline + body */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: px(20) }}>
                    {/* Accent rule */}
                    <div
                        style={{
                            width: px(56),
                            height: px(3),
                            background: pal.badgeBg,
                            borderRadius: px(2),
                            opacity: 0.85,
                        }}
                    />

                    {/* Headline — Chicle font */}
                    <div
                        style={{
                            fontSize: px(96),
                            fontFamily: '"Chicle", Georgia, serif',
                            fontWeight: 400,
                            color: pal.headlineColor,
                            lineHeight: 1.05,
                            maxWidth: '90%',
                        }}
                    >
                        {headline || 'Your Headline'}
                    </div>

                    {/* Body text */}
                    {body ? (
                        <div
                            style={{
                                fontSize: px(30),
                                fontFamily: 'Arial, sans-serif',
                                color: pal.bodyColor,
                                lineHeight: 1.55,
                                maxWidth: '80%',
                            }}
                        >
                            {body}
                        </div>
                    ) : null}
                </div>

                {/* BOTTOM: URL + Book Now badge */}
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <div
                        style={{
                            fontSize: px(14),
                            fontFamily: 'Arial, sans-serif',
                            color: pal.bodyColor,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                        }}
                    >
                        hellosunshinesauna.com
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: pal.badgeBg,
                            borderRadius: px(40),
                            padding: `${px(12)}px ${px(28)}px`,
                        }}
                    >
                        <span
                            style={{
                                fontSize: px(16),
                                fontFamily: 'Arial, sans-serif',
                                fontWeight: 700,
                                color: pal.badgeText,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                            }}
                        >
                            Book Now
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
