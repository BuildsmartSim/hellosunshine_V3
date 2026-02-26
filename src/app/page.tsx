"use client";

import Image from "next/image";
import SanctuarySection from "@/components/SanctuarySection";
import HeroSection from "@/components/HeroSection";
import TicketingSection from "@/components/TicketingSection";
import Guestbook from "@/components/Guestbook";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Polaroid } from "@/components/Polaroid";
import { SectionHeader } from "@/components/SectionHeader";
import { StandardSection } from "@/components/StandardSection";
import { useDesign } from "@/design-system/DesignContext";
import { ContactSection } from "@/components/ContactSection";


export default function Home() {
  const { state } = useDesign();

  return (
    <div className="min-h-screen bg-[#FDFCF9]">
      <Header />

      <main>
        {/* HERO SECTION */}
        <HeroSection />


        {/* SANCTUARY SECTION */}
        <SanctuarySection />

        {/* GUESTBOOK SECTION */}
        <StandardSection id="guestbook" variant="naturalPaper">
          {/* Content row: polaroids left, book right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

            {/* Left: Polaroid stack — 3 cols */}
            <div className="hidden lg:flex lg:col-span-3 flex-col gap-8 items-center">
              <Polaroid
                src="/optimized/polaroids/webp/sauna-garden-relaxing-crowd.webp"
                label="Morning Mist"
                rotation="rotate-[-5deg]"
                size="w-52"
                className="hover:z-50 transition-all"
              />
              <Polaroid
                src="/optimized/polaroids/webp/night-fire-pit-heart-decor-chairs.webp"
                label="Nightfall"
                rotation="rotate-[4deg]"
                size="w-52"
                className="hover:z-50 transition-all translate-x-3"
              />
              <Polaroid
                src="/optimized/polaroids/webp/sauna-interior-wood-stove-glow.webp"
                label="The Hearth"
                rotation="rotate-[-3deg]"
                size="w-52"
                className="hover:z-50 transition-all -translate-x-2"
              />
            </div>

            {/* Right: Header (centered) + rule + book — 9 cols */}
            <div className="lg:col-span-9 flex flex-col items-center text-center">
              <h2 style={{
                fontFamily: `'ChicleForce', var(--font-chicle), cursive`,
                fontSize: 'clamp(48px, 5vw, 78px)',
                lineHeight: '0.95',
                letterSpacing: '-0.01em',
                color: 'var(--hss-charcoal, #2C2C2C)',
              }}>
                The Guestbook
              </h2>
              <p className="mt-3 text-charcoal/45 text-xl" style={{ fontFamily: 'var(--font-handwriting)' }}>
                Voices from the steam. Moments captured in the wild.
              </p>
              <div className="h-px w-full bg-charcoal/10 mt-6 mb-6" />
              <div className="w-full">
                <Guestbook />
              </div>
            </div>

          </div>
        </StandardSection>

        {/* TICKETING SECTION */}
        <TicketingSection />

        {/* CONTACT SECTION */}
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}

