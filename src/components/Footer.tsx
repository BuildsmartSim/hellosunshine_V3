"use client";

import React from 'react';
import Image from 'next/image';
import { textures, icons, pencil } from '@/design-system/tokens';
import { LayeredPencil } from '@/components/LayeredPencil';
import { useHasMounted } from '@/design-system/MediaContext';

export default function Footer() {
    const hasMounted = useHasMounted();

    if (!hasMounted) return null;
    return (
        <footer className="relative text-[#EBE5CE] py-10 px-8 overflow-hidden"
            style={{ backgroundColor: '#1C1E1F' }}>
            {/* Dark Iron Texture — layered CSS gradients + noise */}
            {/* Layer 1: vertical brushed-metal grain */}
            <div className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: `repeating-linear-gradient(
                        90deg,
                        rgba(255,255,255,0.012) 0px,
                        rgba(255,255,255,0.012) 1px,
                        transparent 1px,
                        transparent 4px
                    )`,
                }}></div>
            {/* Layer 2: wide tonal sweep — gives the iron its depth & slight warp */}
            <div className="absolute inset-0 pointer-events-none opacity-70"
                style={{
                    backgroundImage: `linear-gradient(
                        180deg,
                        rgba(255,255,255,0.04) 0%,
                        rgba(0,0,0,0.15) 40%,
                        rgba(255,255,255,0.03) 70%,
                        rgba(0,0,0,0.1) 100%
                    )`,
                }}></div>
            {/* Layer 3: very faint specular sheen — catches the hearth light */}
            <div className="absolute inset-0 pointer-events-none opacity-30"
                style={{
                    backgroundImage: `radial-gradient(ellipse 80% 40% at 30% 50%, rgba(180,160,110,0.08) 0%, transparent 70%)`,
                }}></div>
            {/* Layer 4: SVG noise grain for gritty iron feel */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.18]" xmlns="http://www.w3.org/2000/svg">
                <filter id="iron-noise">
                    <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
                    <feColorMatrix type="saturate" values="0" />
                </filter>
                <rect width="100%" height="100%" filter="url(#iron-noise)" />
            </svg>

            <div
                className="mx-auto relative z-10"
                style={{ maxWidth: 'var(--hss-site-width)' }}
            >
                {/* Top Row: Brand & Nav Header */}
                <div className="flex flex-col md:flex-row justify-between items-center border-b border-[#EBE5CE]/10 pb-8 mb-8">
                    <div className="text-center md:text-left mb-6 md:mb-0 relative py-4">
                        {/* Light Spill Background */}
                        <div className="absolute inset-0 z-0 pointer-events-none opacity-20 blur-3xl scale-125 translate-y-[-10%]"
                            style={{
                                background: 'radial-gradient(circle, rgba(235, 229, 206, 0.3) 0%, transparent 80%)'
                            }}
                        ></div>

                        <h3 className="hearth-glow mb-2 relative z-10" style={{
                            fontFamily: 'var(--font-chicle)',
                            fontSize: 'clamp(3.5rem, 10vw, 5.5rem)',
                            lineHeight: '1.05',
                            letterSpacing: '0.02em'
                        }}>
                            Hello Sunshine
                        </h3>
                        <p className="text-2xl text-[#EBE5CE]/60 -rotate-1 relative z-10" style={{ fontFamily: 'var(--font-caveat)' }}>
                            Hand-built stories in steam.
                        </p>
                    </div>

                    <nav className="flex flex-wrap justify-center gap-8 md:gap-12 font-body text-[13px] font-bold uppercase tracking-[0.4em]">
                        {['Sauna', 'Experience', 'Story', 'Journal'].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="hover:text-[#F8C630] transition-colors duration-300 relative group"
                            >
                                {item}
                                <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-[#F8C630] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                            </a>
                        ))}
                    </nav>
                </div>

                {/* Bottom Row: Details, Newsletter & Socials */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-end">

                    {/* Left: Mission Statement */}
                    <div className="md:col-span-4 lg:col-span-5">
                        <p className="font-body text-lg opacity-80 leading-relaxed max-w-md">
                            Based in the hills, moving with the seasons. We craft spaces of deep restoration
                            and wood-fired heat. Finding the wild in the warmth since 2019.
                        </p>
                    </div>

                    {/* Middle: Social Icons */}
                    <div className="md:col-span-3 lg:col-span-2 flex justify-center md:justify-start gap-5">
                        {[
                            { icon: icons.instagram, label: 'IG' },
                            { icon: icons.facebook, label: 'FB' },
                            { icon: icons.mail, label: 'Mail' }
                        ].map((social, i) => (
                            <a
                                key={i}
                                href="#"
                                className="w-14 h-14 flex-shrink-0 rounded-full border border-[#EBE5CE]/20 flex items-center justify-center hover:bg-[#F8C630] hover:border-[#F8C630] hover:scale-110 hover:-translate-y-1 transition-all duration-300 group shadow-lg bg-[#2C3333]"
                                aria-label={social.label}
                            >
                                <div className="relative w-[22px] h-[22px]">
                                    <Image
                                        src={social.icon}
                                        alt={social.label}
                                        fill
                                        className="object-contain opacity-70 group-hover:opacity-100 group-hover:brightness-0 transition-opacity"
                                    />
                                </div>
                            </a>
                        ))}
                    </div>

                    {/* Right: Newsletter Sign-up */}
                    <div className="md:col-span-5 lg:col-span-5 flex flex-col items-center md:items-end relative">
                        {/* Light Spill Background */}
                        <div className="absolute inset-0 z-0 pointer-events-none opacity-15 blur-3xl scale-150"
                            style={{
                                background: 'radial-gradient(circle, rgba(248, 198, 48, 0.2) 0%, transparent 80%)',
                                transform: 'translate(20%, -20%)'
                            }}
                        ></div>

                        <span
                            className="text-4xl tracking-wide hearth-glow mb-4 relative z-10"
                            style={{ fontFamily: 'var(--font-chicle)' }}
                        >
                            Get the warmth.
                        </span>
                        <div className="flex w-full max-w-xs items-center border-b-2 border-[#EBE5CE]/30 hover:border-[#F8C630] transition-colors pb-2">
                            <input
                                placeholder="E-mail address"
                                className="bg-transparent border-none outline-none flex-1 text-sm font-body italic placeholder:opacity-60"
                            />
                            <button className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#F8C630] hover:translate-x-1 transition-transform">
                                JOIN
                            </button>
                        </div>
                    </div>

                </div>

                {/* Legal & Copyright */}
                <div className="mt-12 pt-6 border-t border-[#EBE5CE]/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-mono tracking-widest opacity-30 uppercase">
                    <p>© 2026 HELLO SUNSHINE SAUNA. ALL WARMTH RESERVED.</p>
                    <div className="flex gap-8 items-center cursor-default">
                        <span>MADE WITH FIRE & ICE</span>
                        <span>ANTIGRAVITY</span>
                        <a href="/admin" className="hover:text-[#F8C630] transition-colors cursor-pointer">ADMIN</a>
                    </div>
                </div>
            </div>

            {/* Subtle Gradient Fade at the top - Enhanced with a soft glow line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F8C630]/20 to-transparent"></div>
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/20 to-transparent pointer-events-none"></div>
        </footer>
    );
}
