'use client';

import { SunshineTemplate, type TemplateStyle } from './SunshineTemplate';

interface LivePreviewProps {
    style: TemplateStyle;
    headline: string;
    body: string;
    bgImageUrl?: string;
}

const CANVAS_SIZE = 1080;
const PREVIEW_SIZE = 480; // px the preview renders at in the browser
const SCALE = PREVIEW_SIZE / CANVAS_SIZE;

export function LivePreview({ style, headline, body, bgImageUrl }: LivePreviewProps) {
    return (
        <div className="flex flex-col items-center gap-3">
            <p className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">
                Live Preview · 1080 × 1080
            </p>
            {/* Outer clipping container */}
            <div
                style={{ width: PREVIEW_SIZE, height: PREVIEW_SIZE }}
                className="overflow-hidden rounded-xl shadow-2xl ring-1 ring-neutral-200"
            >
                {/* Scale wrapper — shrinks the 1080px template to fit */}
                <div
                    style={{
                        transformOrigin: 'top left',
                        transform: `scale(${SCALE})`,
                        width: CANVAS_SIZE,
                        height: CANVAS_SIZE,
                    }}
                >
                    <SunshineTemplate
                        style={style}
                        headline={headline}
                        body={body}
                        bgImageUrl={bgImageUrl}
                        scale={1}
                    />
                </div>
            </div>
            <p className="text-xs text-neutral-400 font-mono">
                Square (1:1) &nbsp;·&nbsp; Instagram &amp; Facebook optimised
            </p>
        </div>
    );
}
