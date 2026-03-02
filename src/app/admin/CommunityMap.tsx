'use client';

import React, { useMemo } from 'react';
import { geoMercator } from 'd3-geo';

type GeoPoint = {
    lat: number;
    long: number;
    city?: string;
};

const UK_PATH = "M90.862,298.099L69.331,345.298L38.966,331.218L14.121,332.16L22.402,295.241L14.121,257.84L47.8,254.941ZM197.602,0L154.663,82.25L195.594,71.972L239.613,72.365L229.139,132.92L193.022,198.024L234.562,202.6L237.749,210.123L273.532,293.219L301.031,304.342L325.757,382.025L337.206,408.473L385.879,421.14L380.996,463.268L360.531,482.383L376.572,515.805L340.434,549.256L286.688,548.668L218.292,566.086L199.56,553.626L172.998,583.195L135.834,576.06L107.612,600L86.257,587.505L145.176,520.903L181.137,507.018L180.821,506.964L118.083,496.209L106.717,470.362L148.697,450.069L126.695,414.464L134.328,370.569L194.034,376.671L194.104,376.678L200.012,337.285L173.108,294.887L172.493,293.911L123.716,281.677L114.14,262.756L128.74,231.232L115.528,211.618L93.897,245.196L91.543,176.313L71.256,139.162L85.845,62.272L117.053,0.385L149.133,6.488Z";

export function CommunityMap({ data }: { data: GeoPoint[] }) {
    const SVG_WIDTH = 400;
    const SVG_HEIGHT = 600;

    const points = useMemo(() => {
        // Use the same projection logic that generated the SVG path
        const projection = geoMercator()
            .scale(2301.80136908347)
            .translate([318.32526258131986, 2923.8929998905764]);

        return data.map(pt => {
            const [x, y] = projection([pt.long, pt.lat]) || [Number.NaN, Number.NaN];
            return { x, y, city: pt.city };
        }).filter(pt => !isNaN(pt.x) && !isNaN(pt.y) && pt.x >= -50 && pt.x <= SVG_WIDTH + 50 && pt.y >= -50 && pt.y <= SVG_HEIGHT + 50);
    }, [data]);

    return (
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-xl overflow-hidden mb-8 relative">
            <div className="p-8 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
                <div>
                    <h3 className="text-xl font-bold text-neutral-900">Community Heatmap</h3>
                    <p className="text-sm text-neutral-500 font-mono mt-1 uppercase tracking-widest">{data.length} Historical Guest Locations</p>
                </div>
                <div className="px-4 py-2 bg-neutral-900 text-white text-[10px] font-black uppercase tracking-widest font-mono rounded-full">
                    UK / Europe Focus
                </div>
            </div>

            <div className="relative w-full aspect-[4/3] sm:aspect-[2/1] bg-[#F3EFE6] overflow-hidden flex items-center justify-center">
                {/* Subtle Grid Background */}
                <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: 'linear-gradient(#E0D5C1 1px, transparent 1px), linear-gradient(90deg, #E0D5C1 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}></div>

                <div className="relative w-full max-w-[400px] h-full">
                    <svg viewBox="-40 -40 480 680" className="w-full h-full drop-shadow-xl">
                        {/* UK Silhouette - Rounded and softened */}
                        <path d={UK_PATH} fill="#26201D" stroke="#26201D" strokeWidth="16" strokeLinejoin="round" strokeLinecap="round" />

                        {/* Glow effect for high density */}
                        <defs>
                            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="4" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>

                        {points.map((pt, i) => (
                            <circle
                                key={i}
                                cx={pt.x}
                                cy={pt.y}
                                r="4"
                                fill="#F8C630" // Primary Yellow
                                opacity="0.8"
                                filter="url(#glow)"
                                className="mix-blend-screen transition-all duration-300 hover:r-[8] hover:opacity-100 cursor-pointer"
                            >
                                {pt.city && <title>{pt.city}</title>}
                            </circle>
                        ))}
                    </svg>
                </div>

                {/* Overlays */}
                <div className="absolute bottom-4 right-4 flex gap-2 items-center">
                    <span className="w-3 h-3 rounded-full bg-[#F8C630] shadow-[0_0_10px_rgba(248,198,48,0.8)]"></span>
                    <span className="text-[10px] text-[#26201D] font-black uppercase tracking-widest font-mono">Guest Cluster</span>
                </div>
            </div>
        </div>
    );
}
