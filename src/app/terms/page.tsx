"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { StandardSection } from '@/components/StandardSection';
import { SectionHeader } from '@/components/SectionHeader';
import { motion } from 'framer-motion';
import { VitalityIcon, TowelIcon, ShieldIcon } from '@/components/Icons';

export default function TermsPage() {
    return (
        <div className="min-h-screen flex flex-col relative bg-stone-50">
            <Header />

            <main className="flex-1 pt-32 pb-20 relative z-10 px-4 md:px-8">
                <div className="max-w-4xl mx-auto">
                    <StandardSection id="terms" variant="naturalPaper" className="rounded-[32px] md:rounded-[48px] shadow-2xl border border-charcoal/10 relative z-10 p-8 md:p-16">

                        <div className="flex flex-col items-center mb-16 text-center">
                            <h1 className="text-5xl md:text-7xl font-black text-charcoal uppercase leading-none" style={{ fontFamily: 'var(--font-accent)' }}>
                                The Fine Print
                            </h1>
                            <p className="mt-6 text-2xl text-charcoal/60 font-handwriting">
                                (We promise to keep it light & breezy! ☀️)
                            </p>
                        </div>

                        <div className="space-y-12 font-mono text-sm md:text-base leading-relaxed text-charcoal/80">

                            {/* Section 1 */}
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white/50 border border-charcoal/5 rounded-3xl p-8 hover:bg-white/70 transition-colors"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <VitalityIcon className="w-8 h-8 text-primary" />
                                    <h2 className="text-xl uppercase tracking-widest font-black text-primary">Health Disclaimer</h2>
                                </div>
                                <p className="mb-4">
                                    Before jumping into the heat, we need to make sure you're physically fit and healthy enough to enjoy a sauna!
                                </p>
                                <div className="p-4 bg-red-50/50 border border-red-100 rounded-xl text-red-900/80 text-xs md:text-sm">
                                    <strong className="block mb-2 font-bold uppercase tracking-wider">Please Note:</strong>
                                    Persons advised not to use a sauna include: pregnant women, anyone suffering from heart or circulatory problems, diabetes, high/low blood pressure, skin diseases, open sores or wounds. Also, persons currently taking anticoagulants, antihistamines, vasoconstrictors, vasodilators, stimulants, hypnotics, narcotics, or tranquillisers.
                                </div>
                                <p className="mt-6">
                                    By booking your ticket and checking the "I feel great today" box, you acknowledge that you have read and understand this health disclaimer, and confirm you do not fall under any of the categories listed above. I understand that failure to meet these criteria may pose risks to my health, and I accept full responsibility for any consequences resulting from the use of the sauna.
                                </p>
                            </motion.section>

                            {/* Section 2 */}
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white/50 border border-charcoal/5 rounded-3xl p-8 hover:bg-white/70 transition-colors"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <TowelIcon className="w-8 h-8 text-primary" />
                                    <h2 className="text-xl uppercase tracking-widest font-black text-primary">Sanctuary Etiquette</h2>
                                </div>
                                <ul className="list-none space-y-4">
                                    <li className="flex items-start gap-3">
                                        <span className="text-primary mt-1">✦</span>
                                        <span><strong>Hygiene First:</strong> Please shower beforehand to maintain hygiene and enhance the sauna experience for everyone.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-primary mt-1">✦</span>
                                        <span><strong>Two Towel Rule:</strong> Guests must provide two towels—one to sit on and one to dry off.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-primary mt-1">✦</span>
                                        <span><strong>Keep it Zen:</strong> Respect others' privacy, personal space, and maintain appropriate volume levels. Enter and exit the sauna quickly, quietly, and safely.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-primary mt-1">✦</span>
                                        <span><strong>Leave the Bling at Home:</strong> Remove all jewelry and contact lenses before entering the sauna.</span>
                                    </li>
                                </ul>
                            </motion.section>

                            {/* Section 3 */}
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white/50 border border-charcoal/5 rounded-3xl p-8 hover:bg-white/70 transition-colors"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <ShieldIcon className="w-8 h-8 text-primary" />
                                    <h2 className="text-xl uppercase tracking-widest font-black text-primary">Safety & Entry</h2>
                                </div>
                                <ul className="list-none space-y-4">
                                    <li className="flex items-start gap-3">
                                        <span className="text-primary mt-1">✦</span>
                                        <span><strong>Water & Stones:</strong> Refrain from pouring water onto the sauna stones to create steam. Our Sauna staff will manage steam levels perfectly for you!</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-primary mt-1">✦</span>
                                        <span><strong>Sober Sweats Only:</strong> Individuals under the influence of alcohol or drugs will be refused entry. Alcohol or drug use within the sauna garden is strictly prohibited.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-primary mt-1">✦</span>
                                        <span><strong>Listen to Your Body:</strong> Monitor your time in the sauna to prevent overheating. Stay hydrated and use provided electrolyte tablets if needed.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-primary mt-1">✦</span>
                                        <span><strong>Refunds:</strong> Full refunds are given up until the day of the festival. During the festival, proof of the reason why a refund is necessary is legally required.</span>
                                    </li>
                                </ul>
                            </motion.section>

                        </div>

                        <div className="mt-16 text-center">
                            <p className="font-handwriting text-2xl text-charcoal/60">
                                See? That wasn't too bad! Now let's go sweat.
                            </p>
                            <div className="mt-8">
                                <a href="/tickets" className="inline-block bg-primary text-white font-black uppercase tracking-widest py-4 px-8 rounded-full hover:scale-105 hover:shadow-xl hover:shadow-primary/30 transition-all">
                                    Back to Tickets
                                </a>
                            </div>
                        </div>

                    </StandardSection>
                </div>
            </main>

            <Footer />
        </div>
    );
}
