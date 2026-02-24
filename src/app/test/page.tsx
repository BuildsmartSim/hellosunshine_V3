"use client";

import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GlowingHeader } from "@/components/GlowingHeader";
import { DappledHeaderShadow, DappledHeaderStroke, DappledHeaderGradient } from "@/components/LightHeaderVariants";
import { SectionHeaderPlayfair, SectionHeaderSans, SectionHeaderStroke } from "@/components/SectionHeaderVariants";
import { useDesign } from "@/design-system/DesignContext";

export default function TestPage() {
    const { state } = useDesign();

    return (
        <div className="min-h-screen bg-[#1F1A17] text-[#F3EFE6] selection:bg-primary/30">
            {/* Header / Nav */}
            <Header />

            <main className="px-6 md:px-24 py-32 space-y-48 font-body">

                {/* HERO STYLE TEST */}
                <section className="mx-auto flex flex-col items-center justify-center min-h-[60vh] relative" style={{ maxWidth: 'var(--hss-site-width)' }}>
                    {/* Optional radial background glow to sell the "sun shining through" effect */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 hover:bg-primary/30 blur-[100px] rounded-full pointer-events-none transition-all duration-1000"></div>

                    <GlowingHeader
                        line1="Hello"
                        line2="Sunshine"
                        subtitle="A radiant new look"
                        description="This header feels like the sun is breaking through the dawn."
                        className="relative z-10"
                        centered={true}
                    />
                </section>

                {/* LEFT ALIGNED TEST */}
                <section className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-24 items-center" style={{ maxWidth: 'var(--hss-site-width)' }}>
                    <div className="relative">
                        {/* Soft background glow */}
                        <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-primary/10 blur-[80px] rounded-full pointer-events-none"></div>

                        <GlowingHeader
                            line1="The"
                            line2="Sanctuary"
                            subtitle="Feel the warmth."
                            description="This layout tests the glowing header in a left-aligned, standard section format."
                            className="relative z-10"
                            centered={false}
                        />
                    </div>

                    {/* Placeholder for content/image */}
                    <div className="aspect-[4/3] bg-primary/5 border border-primary/20 rounded-3xl flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary/10 backdrop-blur-md"></div>
                        <p className="font-handwriting text-primary/50 text-2xl rotate-[-2deg]">Imagine a sun-drenched photo here.</p>
                    </div>
                </section>

                {/* HERO MOCKUPS (OPTION C3) */}
                <section className="mx-auto flex flex-col items-center justify-center relative bg-[#F3EFE6] -mx-6 md:-mx-24 px-6 md:px-24 py-32 rounded-[120px] text-charcoal border-b" style={{ maxWidth: 'calc(var(--hss-site-width) + 192px)' }}>
                    <div className="w-full text-center mb-24">
                        <span className="bg-charcoal text-white px-4 py-1 rounded-full text-sm font-bold tracking-widest uppercase shadow-md">Hero Mockups: Yellow Stroke (Option C2)</span>
                        <p className="mt-8 text-charcoal/60 font-display italic max-w-xl mx-auto">Testing different typographic layouts within the established 9/3 column hero architecture.</p>
                    </div>

                    <div className="w-full space-y-48">

                        {/* MOCKUP 1: LEFT ALIGNED (STRUCTURED) */}
                        <div className="w-full max-w-7xl mx-auto">
                            <h3 className="text-xl font-bold mb-8 text-charcoal/50 uppercase tracking-widest">Layout 1: Left Structured</h3>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-0 items-center bg-white p-8 md:p-16 rounded-3xl shadow-xl">
                                {/* Left Side (Image) */}
                                <div className="col-span-1 md:col-span-8 relative mb-16 md:mb-0">
                                    <div style={{ transform: 'rotate(2deg)' }} className="w-full aspect-[16/9] bg-[#EAE5D9] rounded-xl flex items-center justify-center border border-charcoal/10 overflow-hidden shadow-md">
                                        <div className="absolute inset-0 bg-[url('/northern-retreat-sauna-exterior.jpg')] bg-cover bg-center opacity-30 mix-blend-multiply"></div>
                                        <span className="text-charcoal/40 font-handwriting text-3xl rotate-[-2deg] relative z-10">Hero Image</span>
                                    </div>
                                    {/* Polaroid Mock */}
                                    <div className="absolute bottom-[-15%] left-4 z-20" style={{ transform: 'rotate(-5deg)' }}>
                                        <div className="w-48 aspect-[3/4] bg-white rounded-md shadow-lg border-8 border-white border-b-[40px] flex flex-col items-center justify-end pb-2">
                                            <div className="absolute top-0 left-0 right-0 bottom-10 bg-[url('/optimized/polaroids/webp/vintage-silver-caravan-daytime-field.webp')] bg-cover bg-center"></div>
                                            <span className="font-handwriting text-charcoal text-sm">Polaroid</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side (Text) */}
                                <div className="col-span-1 md:col-span-4 h-full flex flex-col items-start md:pl-8 pt-12 md:pt-0">
                                    <DappledHeaderStroke
                                        line1="Hello"
                                        line2="Sunshine"
                                        subtitle="Hand-built cedar."
                                        description="Authentic steam. A quiet escape into nature."
                                        centered={false}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* MOCKUP 2: CENTER STACKED */}
                        <div className="w-full max-w-7xl mx-auto">
                            <h3 className="text-xl font-bold mb-8 text-charcoal/50 uppercase tracking-widest text-center">Layout 2: Center Stacked</h3>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-0 items-center bg-white p-8 md:p-16 rounded-3xl shadow-xl">
                                {/* Left Side (Image) */}
                                <div className="col-span-1 md:col-span-8 relative mb-16 md:mb-0">
                                    <div style={{ transform: 'rotate(2deg)' }} className="w-full aspect-[16/9] bg-[#EAE5D9] rounded-xl flex items-center justify-center border border-charcoal/10 overflow-hidden shadow-md">
                                        <div className="absolute inset-0 bg-[url('/northern-retreat-sauna-exterior.jpg')] bg-cover bg-center opacity-30 mix-blend-multiply"></div>
                                        <span className="text-charcoal/40 font-handwriting text-3xl rotate-[-2deg] relative z-10">Hero Image</span>
                                    </div>
                                    {/* Polaroid Mock */}
                                    <div className="absolute bottom-[-15%] left-4 z-20" style={{ transform: 'rotate(-5deg)' }}>
                                        <div className="w-48 aspect-[3/4] bg-white rounded-md shadow-lg border-8 border-white border-b-[40px] flex flex-col items-center justify-end pb-2">
                                            <div className="absolute top-0 left-0 right-0 bottom-10 bg-[url('/optimized/polaroids/webp/vintage-silver-caravan-daytime-field.webp')] bg-cover bg-center"></div>
                                            <span className="font-handwriting text-charcoal text-sm">Polaroid</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side (Text) */}
                                <div className="col-span-1 md:col-span-4 h-full flex flex-col justify-center items-center text-center -ml-12 md:pl-0 pt-12 md:pt-0">
                                    <DappledHeaderStroke
                                        line1="Hello"
                                        line2="Sunshine"
                                        subtitle="Hand-built cedar."
                                        description="Authentic steam."
                                        centered={true}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* MOCKUP 3: RIGHT ANCHORED */}
                        <div className="w-full max-w-7xl mx-auto">
                            <h3 className="text-xl font-bold mb-8 text-charcoal/50 uppercase tracking-widest text-right">Layout 3: Right Anchored</h3>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-0 items-center bg-white p-8 md:p-16 rounded-3xl shadow-xl">
                                {/* Left Side (Image) */}
                                <div className="col-span-1 md:col-span-8 relative mb-16 md:mb-0">
                                    <div style={{ transform: 'rotate(2deg)' }} className="w-full aspect-[16/9] bg-[#EAE5D9] rounded-xl flex items-center justify-center border border-charcoal/10 overflow-hidden shadow-md">
                                        <div className="absolute inset-0 bg-[url('/northern-retreat-sauna-exterior.jpg')] bg-cover bg-center opacity-30 mix-blend-multiply"></div>
                                        <span className="text-charcoal/40 font-handwriting text-3xl rotate-[-2deg] relative z-10">Hero Image</span>
                                    </div>
                                    {/* Polaroid Mock */}
                                    <div className="absolute bottom-[-15%] left-4 z-20" style={{ transform: 'rotate(-5deg)' }}>
                                        <div className="w-48 aspect-[3/4] bg-white rounded-md shadow-lg border-8 border-white border-b-[40px] flex flex-col items-center justify-end pb-2">
                                            <div className="absolute top-0 left-0 right-0 bottom-10 bg-[url('/optimized/polaroids/webp/vintage-silver-caravan-daytime-field.webp')] bg-cover bg-center"></div>
                                            <span className="font-handwriting text-charcoal text-sm">Polaroid</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side (Text) */}
                                <div className="col-span-1 md:col-span-4 h-full flex flex-col justify-center items-end text-right md:-mr-8 md:pl-8 pt-12 md:pt-0">
                                    <DappledHeaderStroke
                                        line1="Hello"
                                        line2="Sunshine"
                                        subtitle="Hand-built cedar."
                                        description="Authentic steam."
                                        centered={false}
                                        className="items-end text-right"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* SECTION HEADER ALTERNATIVES */}
                <section className="mx-auto flex flex-col items-center justify-center min-h-screen relative bg-[#FDFCF9] -mx-6 md:-mx-24 px-6 md:px-24 py-32 rounded-[120px] text-charcoal border-b" style={{ maxWidth: 'calc(var(--hss-site-width) + 192px)' }}>
                    <div className="w-full text-center mb-24">
                        <span className="bg-charcoal text-white px-4 py-1 rounded-full text-sm font-bold tracking-widest uppercase shadow-md">Section Header Alternatives</span>
                        <p className="mt-8 text-charcoal/60 font-display italic max-w-xl mx-auto">Exploring options to replace Chicle and complement the new Yellow Stroke Hero style.</p>
                    </div>

                    <div className="w-full max-w-4xl space-y-48">
                        {/* OPTION D1 */}
                        <div>
                            <div className="flex justify-center mb-16">
                                <span className="bg-charcoal text-white px-4 py-1 rounded-full text-sm font-bold tracking-widest uppercase shadow-md">Option 1: Playfair Display + Charcoal Pencil</span>
                            </div>
                            <SectionHeaderPlayfair
                                line1="The"
                                line2="Sanctuary"
                                subtitle="Feel the warmth."
                                description="Uses Playfair Display in charcoal. Elegant and editorial, retaining the trademark pencil hatch texture."
                                centered={true}
                            />
                        </div>

                        {/* OPTION D2 */}
                        <div>
                            <div className="flex justify-center mb-16">
                                <span className="bg-charcoal text-white px-4 py-1 rounded-full text-sm font-bold tracking-widest uppercase shadow-md">Option 2: DM Sans Bold</span>
                            </div>
                            <SectionHeaderSans
                                line1="The"
                                line2="Sanctuary"
                                subtitle="Feel the warmth."
                                description="Uses DM Sans Bold. Extremely clean, modern, and provides high contrast against the ornate hero effects."
                                centered={true}
                            />
                        </div>

                        {/* OPTION D3 */}
                        <div>
                            <div className="flex justify-center mb-16">
                                <span className="bg-charcoal text-white px-4 py-1 rounded-full text-sm font-bold tracking-widest uppercase shadow-md">Option 3: Playfair + Yellow Stroke</span>
                            </div>
                            <SectionHeaderStroke
                                line1="The"
                                line2="Sanctuary"
                                subtitle="Feel the warmth."
                                description="Uses Playfair Display with the exact 'Yellow Stroke' styling to mirror the Hero section directly."
                                centered={true}
                            />
                        </div>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}
