'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/Button';

/* ─────────────────────────────────────────────
   BUTTON SHOWCASE — /buttons
   All button patterns found across the repo
   ───────────────────────────────────────────── */

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <div className="mb-8 border-b border-charcoal/10 pb-4">
            <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-charcoal/40">{children}</h2>
        </div>
    );
}

function Row({ label, note, children }: { label: string; note?: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-3 mb-10">
            <div className="flex items-baseline gap-3">
                <span className="text-sm font-bold font-mono text-charcoal uppercase tracking-widest">{label}</span>
                {note && <span className="text-xs text-charcoal/35 font-mono">{note}</span>}
            </div>
            <div className="flex flex-wrap items-center gap-6">
                {children}
            </div>
        </div>
    );
}

export default function ButtonsPage() {
    return (
        <div className="min-h-screen bg-[#FDFCF9] px-12 py-20">
            <div className="max-w-4xl mx-auto">

                {/* Page header */}
                <div className="mb-16">
                    <p className="text-xs font-mono uppercase tracking-[0.4em] text-charcoal/30 mb-3">Design System</p>
                    <h1 className="text-5xl font-display font-bold text-charcoal">Button Styles</h1>
                    <p className="mt-4 font-body text-charcoal/50">All button patterns across the Hello Sunshine codebase.</p>
                </div>

                {/* ── 1. Button component variants ── */}
                <section className="mb-16">
                    <SectionTitle>Button Component — &lt;Button variant="..." /&gt;</SectionTitle>

                    <Row label="deepDry" note="default — Button.tsx:18  Header & footer primary actions">
                        <Button variant="deepDry">Book a Session</Button>
                        <Button variant="deepDry" disabled>Disabled State</Button>
                    </Row>

                    <Row label="ghostDry" note="Button.tsx:30  Secondary / low-emphasis actions">
                        <Button variant="ghostDry">Learn More</Button>
                        <Button variant="ghostDry" disabled>Disabled State</Button>
                    </Row>

                    <Row label="primary" note="Button.tsx:42  Fallback solid yellow">
                        <Button variant="primary">Get Started</Button>
                        <Button variant="primary" disabled>Disabled</Button>
                    </Row>
                </section>

                {/* ── 2. Header CTA ── */}
                <section className="mb-16">
                    <SectionTitle>Header CTA — Book Now pill  (Header.tsx:87)</SectionTitle>
                    <Row label="header-cta" note="Yellow pill, uppercase, arrow icon, hover scale">
                        <button className="px-6 py-3 md:px-8 md:py-4 bg-[#f8c630] text-charcoal font-bold uppercase tracking-widest text-xs md:text-sm rounded-full hover:bg-opacity-90 hover:scale-[1.02] hover:-translate-y-0.5 transition-all shadow-sm flex items-center gap-2">
                            <span>Book Now</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </Row>
                </section>

                {/* ── 3. Form Submit ── */}
                <section className="mb-16">
                    <SectionTitle>Form Submit — Contact section (ContactSection.tsx)</SectionTitle>
                    <Row label="form-submit" note="Full-width yellow pill, font-body, py-4, hover lift">
                        <button
                            className="px-10 justify-center rounded-full py-4 font-body font-bold tracking-[0.2em] uppercase text-sm border-0 text-charcoal transition-all shadow-sm hover:-translate-y-0.5 hover:shadow-md"
                            style={{ backgroundColor: '#F8C630' }}
                        >
                            Send Message
                        </button>
                    </Row>
                </section>

                {/* ── 4. Footer Social Icon ── */}
                <section className="mb-16">
                    <SectionTitle>Footer Social Icon Button  (Footer.tsx:115)</SectionTitle>
                    <Row label="social-icon" note="Dark circle, border, hover goes yellow + scale + lift">
                        <div className="flex gap-4" style={{ backgroundColor: '#1C1E1F', padding: '24px', borderRadius: '8px' }}>
                            {/* Normal */}
                            <button className="w-14 h-14 flex-shrink-0 rounded-full border border-[#EBE5CE]/20 flex items-center justify-center hover:bg-[#F8C630] hover:border-[#F8C630] hover:scale-110 hover:-translate-y-1 transition-all duration-300 group shadow-lg bg-[#2C3333]">
                                <svg className="w-5 h-5 text-[#EBE5CE]/60 group-hover:text-charcoal transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </button>
                            {/* Hover-simulated */}
                            <button className="w-14 h-14 flex-shrink-0 rounded-full flex items-center justify-center scale-110 -translate-y-1 shadow-lg" style={{ backgroundColor: '#F8C630', border: '1px solid #F8C630' }}>
                                <svg className="w-5 h-5 text-charcoal" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </button>
                            <span className="text-[#EBE5CE]/30 text-xs font-mono self-center">← active / hover →</span>
                        </div>
                    </Row>
                </section>

                {/* ── 5. Sanctuary Service Tabs ── */}
                <section className="mb-16">
                    <SectionTitle>Sanctuary Service Tabs  (SanctuarySection.tsx)</SectionTitle>
                    <Row label="service-tab" note="Pill icon+label, yellow when active, charcoal/5 when idle">
                        <div className="flex gap-3">
                            {/* Active */}
                            <button className="flex flex-col items-center gap-1.5 py-3 px-5 rounded-full border bg-[#F8C630] border-[#F8C630] shadow-md scale-105 transition-all">
                                <span className="text-[9px] font-body uppercase tracking-widest font-semibold text-charcoal">Sauna</span>
                            </button>
                            {/* Idle */}
                            <button className="flex flex-col items-center gap-1.5 py-3 px-5 rounded-full border bg-charcoal/[0.03] border-charcoal/10 transition-all hover:bg-[#F8C630]/10 hover:border-[#F8C630]/30">
                                <span className="text-[9px] font-body uppercase tracking-widest font-semibold text-charcoal/40">Plunge</span>
                            </button>
                            <button className="flex flex-col items-center gap-1.5 py-3 px-5 rounded-full border bg-charcoal/[0.03] border-charcoal/10 transition-all hover:bg-[#F8C630]/10 hover:border-[#F8C630]/30">
                                <span className="text-[9px] font-body uppercase tracking-widest font-semibold text-charcoal/40">Fire Pit</span>
                            </button>
                        </div>
                    </Row>
                </section>

                {/* ── 6. Nav underline links (acts like button) ── */}
                <section className="mb-16">
                    <SectionTitle>Nav Link / Underline  (Header.tsx:76)</SectionTitle>
                    <Row label="nav-link" note="Transparent, hover underline draws in from left via pseudo-element">
                        <nav className="flex gap-10 font-body text-[14px] font-bold uppercase tracking-[0.4em]">
                            {['Sanctuary', 'Guestbook', 'Contact'].map(item => (
                                <a key={item} href="#" className="text-charcoal/60 hover:text-charcoal transition-all relative group">
                                    {item}
                                    <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-[#F8C630] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                                </a>
                            ))}
                        </nav>
                    </Row>
                </section>

                {/* ── 7. Footer nav links ── */}
                <section className="mb-16">
                    <SectionTitle>Footer Nav Link  (Footer.tsx:80)</SectionTitle>
                    <div style={{ backgroundColor: '#1C1E1F', padding: '24px', borderRadius: '8px' }}>
                        <Row label="footer-nav-link" note="Cream text, hover → yellow, underline slide-in">
                            <nav className="flex gap-10 font-body text-[13px] font-bold uppercase tracking-[0.4em]">
                                {['Sauna', 'Experience', 'Story', 'Journal'].map(item => (
                                    <a key={item} href="#" className="text-[#EBE5CE] hover:text-[#F8C630] transition-colors duration-300 relative group">
                                        {item}
                                        <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-[#F8C630] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                                    </a>
                                ))}
                            </nav>
                        </Row>
                    </div>
                </section>

            </div>
        </div>
    );
}
