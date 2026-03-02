"use client";

import Image from "next/image";
import { useDesign } from "@/design-system/DesignContext";
import { textures } from "@/design-system/tokens";

const LOGO_SRC = "/HSSLOGO black YELLOW.png";

export default function ComingSoon() {
    const { state } = useDesign();

    return (
        <div className="min-h-screen bg-[#FDFCF9] flex flex-col items-center justify-between text-[#2D2D2D] font-sans relative overflow-hidden">

            {/* Background Texture Overlay */}
            <div
                className="absolute inset-0 pointer-events-none opacity-40 z-0"
                style={{
                    backgroundImage: `url('${textures.paper}')`,
                    backgroundSize: '400px',
                    backgroundRepeat: 'repeat'
                }}
            />

            {/* Massive Warm Yellow Accents */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/3 z-0" />
            <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[#E1EEDE] rounded-full blur-[150px] opacity-30 translate-y-1/3 -translate-x-1/3 z-0" />
            <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-primary rounded-full blur-[100px] opacity-10 -translate-x-1/2 -translate-y-1/2 z-0" />

            {/* Content Container */}
            <main className="flex-1 flex flex-col items-center justify-center p-8 w-full max-w-4xl text-center relative z-10">

                {/* Logo Section */}
                <div className="mb-16 relative w-64 h-64 md:w-80 md:h-80 drop-shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <Image
                        src={LOGO_SRC}
                        alt="Hello Sunshine Sauna"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>

                {/* Coming Soon Box */}
                <div className="bg-white/80 backdrop-blur-md p-10 md:p-14 rounded-3xl shadow-xl shadow-charcoal/5 border border-charcoal/10 w-full max-w-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">

                    {/* Internal Decorative element */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary rounded-full blur-2xl opacity-40" />

                    <div className="relative z-10 flex flex-col items-center">
                        <h2 className="font-body text-xs md:text-sm font-bold uppercase tracking-[0.4em] text-charcoal mb-4">
                            Coming Soon
                        </h2>

                        <div className="w-12 h-px bg-primary mb-6" />

                        <p className="font-serif text-xl md:text-2xl italic tracking-wide text-charcoal/70 mb-10 max-w-md">
                            Finding the wild in the warmth.
                        </p>

                        <a
                            href="mailto:hello@hellosunshinesauna.com"
                            className="group relative inline-flex items-center justify-center px-10 py-5 font-body text-[13px] font-bold uppercase tracking-[0.2em] text-charcoal transition-all overflow-hidden drop-shadow-sm active:scale-95"
                        >
                            <div className="absolute inset-0 bg-primary translate-y-0 transition-transform duration-500 ease-out z-0" />
                            <div className="absolute inset-0 bg-[#FFD700] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0" />
                            <span className="relative z-10 flex items-center gap-3">
                                Say Hello
                            </span>
                        </a>
                    </div>
                </div>

            </main>

            <footer className="w-full p-8 text-center text-xs tracking-widest uppercase font-mono text-charcoal/40 relative z-10">
                &copy; {new Date().getFullYear()} Hello Sunshine Sauna. All rights reserved.
            </footer>
        </div>
    );
}
