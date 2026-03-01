"use client";

import Image from "next/image";
import Footer from "@/components/Footer";
import Header from "@/components/Header"; // Header is default export
import { SectionHeader } from "@/components/SectionHeader";
import { useDesign } from "@/design-system/DesignContext";

// Need to check the exports, wait I'll just use simple imports 
import Link from 'next/link';

export default function ComingSoon() {
    const { state } = useDesign();

    return (
        <div className="min-h-screen bg-[#FDFCF9] flex flex-col items-center justify-between text-[#2D2D2D] font-sans">

            {/* Background Texture (optional, using existing classes) */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('/textures/paper.png')] mix-blend-multiply rounded-xl z-0" />

            <main className="flex-1 flex flex-col items-center justify-center p-8 w-full max-w-4xl text-center relative z-10">

                {/* Simple Logo Placeholder */}
                <div className="mb-12">
                    <h1 className="font-chicle text-7xl md:text-9xl text-[#CDE7E2] drop-shadow-sm mb-4">Hello Sunshine</h1>
                    <p className="font-serif text-2xl italic tracking-wide text-[#7C8F8C]">Sauna & Sanctuary</p>
                </div>

                <div className="bg-white p-10 rounded-2xl shadow-xl shadow-[#CDE7E2]/20 border border-[#EBEBEB] w-full max-w-2xl relative overflow-hidden">
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#E1EEDE] rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#F3DFA2] rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10">
                        <SectionHeader
                            centered={true}
                            line1="Coming Soon"
                            withSeparator={true}
                        />

                        <div className="mt-12 flex items-center justify-center space-x-4">
                            {/* Links to social if any, leaving blank for simple contact */}
                            <a href="mailto:hello@hellosunshinesauna.com" className="px-6 py-3 bg-[#2D2D2D] text-white font-semibold rounded-full hover:bg-[#1a1a1a] transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-1">
                                Say Hello
                            </a>
                        </div>
                    </div>
                </div>

            </main>

            <footer className="w-full p-6 text-center text-sm text-gray-500 relative z-10 font-serif">
                &copy; {new Date().getFullYear()} Hello Sunshine Sauna. All rights reserved.
            </footer>
        </div>
    );
}
