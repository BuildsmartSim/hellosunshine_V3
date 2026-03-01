"use client";

import React from 'react';
import { SectionHeader } from '@/components/SectionHeader';
import { TicketInput } from './TicketInput';
import { Button } from '@/components/Button';
import { TicketTier } from './FestivalPass';
import { sendGAEvent } from '@next/third-parties/google';
import { VitalityIcon, TowelIcon, AgreementIcon } from '@/components/Icons';

interface StepDetailsProps {
    formData: {
        name: string;
        email: string;
        phone: string;
        age?: string;
        gender?: string;
        waiverHealthy: boolean;
        waiverTowels: boolean;
        termsAccepted: boolean;
        mailingList: boolean;
    };
    onChange: (field: string, value: string | boolean) => void;
    onNext: () => void;
    onBack: () => void;
    selectedTier: TicketTier | null;
}

export function StepDetails({ formData, onChange, onNext, onBack, selectedTier }: StepDetailsProps) {
    const handleNext = () => {
        if (selectedTier) {
            const numericPrice = Number(selectedTier.featuredPrice?.replace(/[^0-9.-]+/g, "") || 0);
            sendGAEvent('event', 'begin_checkout', {
                currency: 'GBP',
                value: numericPrice,
                items: [{
                    item_id: selectedTier.id,
                    item_name: selectedTier.title,
                }]
            });
        }
        onNext();
    };

    return (
        <div className="w-full max-w-2xl mx-auto px-4">
            <div className="flex flex-col items-center mb-16">
                <SectionHeader
                    line1="Your"
                    line2="Details"
                    subtitle={`Securing your ${selectedTier?.title || 'Pass'}.`}
                    className="text-center"
                />
            </div>

            <div className="flex flex-col gap-6">
                <TicketInput
                    label="Full Name"
                    name="name"
                    placeholder="Enter your name..."
                    value={formData.name}
                    onChange={(e) => onChange('name', e.target.value)}
                    autoComplete="name"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TicketInput
                        label="Age"
                        type="number"
                        name="age"
                        placeholder="e.g. 25"
                        value={formData.age}
                        onChange={(e) => onChange('age', e.target.value)}
                        autoComplete="bday-age"
                    />
                    <TicketInput
                        label="Gender"
                        name="sex"
                        placeholder="e.g. Female / Non-binary"
                        value={formData.gender}
                        onChange={(e) => onChange('gender', e.target.value)}
                        autoComplete="sex"
                    />
                </div>

                <TicketInput
                    label="Email Address"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => onChange('email', e.target.value)}
                    autoComplete="email"
                />
                <TicketInput
                    label="Phone Number"
                    type="tel"
                    name="tel"
                    placeholder="+44 000 000 000"
                    value={formData.phone}
                    onChange={(e) => onChange('phone', e.target.value)}
                    autoComplete="tel"
                />

                <div className="mt-8 border-t border-charcoal/10 pt-8">
                    <label className="text-sm uppercase tracking-[0.4em] text-primary font-black px-4 mb-6 block text-center">
                        The Sunshine Promises
                    </label>

                    <div className="flex flex-col gap-4">
                        {/* Checkpoint 1: Health */}
                        <label className="flex items-start gap-4 cursor-pointer group bg-white/40 p-5 rounded-2xl border border-charcoal/5 hover:border-primary/30 transition-all hover:bg-white/60">
                            <div className="relative mt-1">
                                <input
                                    type="checkbox"
                                    checked={formData.waiverHealthy}
                                    onChange={(e) => onChange('waiverHealthy', e.target.checked)}
                                    className="sr-only"
                                />
                                <div className={`w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center ${formData.waiverHealthy ? 'bg-primary border-primary shadow-lg scale-110' : 'bg-white/50 border-charcoal/20 group-hover:border-primary/50'}`}>
                                    {formData.waiverHealthy && <span className="text-white text-sm">✓</span>}
                                </div>
                            </div>
                            <div className="flex-1">
                                <span className="text-lg mb-1 flex items-center gap-2"><VitalityIcon className="w-6 h-6 text-primary" /> <strong className="text-charcoal font-handwriting tracking-wide">I feel great today!</strong></span>
                                <span className="text-xs text-charcoal/60 leading-relaxed font-mono">
                                    I confirm I am physically fit to enjoy a sauna. I don't suffer from heart/circulatory problems, abnormal blood pressure, or conditions advised against sauna use (including pregnancy). I accept responsibility for my own wellbeing.
                                </span>
                            </div>
                        </label>

                        {/* Checkpoint 2: Etiquette */}
                        <label className="flex items-start gap-4 cursor-pointer group bg-white/40 p-5 rounded-2xl border border-charcoal/5 hover:border-primary/30 transition-all hover:bg-white/60">
                            <div className="relative mt-1">
                                <input
                                    type="checkbox"
                                    checked={formData.waiverTowels}
                                    onChange={(e) => onChange('waiverTowels', e.target.checked)}
                                    className="sr-only"
                                />
                                <div className={`w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center ${formData.waiverTowels ? 'bg-primary border-primary shadow-lg scale-110' : 'bg-white/50 border-charcoal/20 group-hover:border-primary/50'}`}>
                                    {formData.waiverTowels && <span className="text-white text-sm">✓</span>}
                                </div>
                            </div>
                            <div className="flex-1">
                                <span className="text-lg mb-1 flex items-center gap-2"><TowelIcon className="w-6 h-6 text-primary" /> <strong className="text-charcoal font-handwriting tracking-wide">I promise to bring 2 towels!</strong></span>
                                <span className="text-xs text-charcoal/60 leading-relaxed font-mono">
                                    I will bring one towel to sit on and one to dry off. I also agree to shower beforehand, remove jewelry, and respect the peaceful sanctuary vibe by keeping noise down.
                                </span>
                            </div>
                        </label>

                        {/* Checkpoint 3: Terms */}
                        <label className="flex items-start gap-4 cursor-pointer group bg-white/40 p-5 rounded-2xl border border-charcoal/5 hover:border-primary/30 transition-all hover:bg-white/60">
                            <div className="relative mt-1">
                                <input
                                    type="checkbox"
                                    checked={formData.termsAccepted}
                                    onChange={(e) => onChange('termsAccepted', e.target.checked)}
                                    className="sr-only"
                                />
                                <div className={`w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center ${formData.termsAccepted ? 'bg-primary border-primary shadow-lg scale-110' : 'bg-white/50 border-charcoal/20 group-hover:border-primary/50'}`}>
                                    {formData.termsAccepted && <span className="text-white text-sm">✓</span>}
                                </div>
                            </div>
                            <div className="flex-1 pt-1">
                                <span className="text-sm font-mono text-charcoal/80 uppercase tracking-widest group-hover:text-charcoal transition-colors flex items-center gap-2">
                                    <AgreementIcon className="w-6 h-6 text-primary shrink-0" /> I agree to the <a href="/terms" target="_blank" className="text-primary hover:underline font-bold">Terms & Conditions</a>
                                </span>
                            </div>
                        </label>
                    </div>

                    <label className="flex items-center gap-4 cursor-pointer group px-4 mt-8 justify-center">
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={formData.mailingList}
                                onChange={(e) => onChange('mailingList', e.target.checked)}
                                className="sr-only"
                            />
                            <div className={`w-8 h-8 rounded-lg border-2 transition-all flex items-center justify-center ${formData.mailingList ? 'bg-primary border-primary shadow-lg scale-110' : 'bg-white/50 border-charcoal/10 group-hover:border-charcoal/30'}`}>
                                {formData.mailingList && <span className="text-white text-xl">✓</span>}
                            </div>
                        </div>
                        <span className="text-sm font-mono text-charcoal/70 uppercase tracking-widest group-hover:text-charcoal transition-colors">
                            Join the mailing list to be informed of future Early Bird releases
                        </span>
                    </label>
                </div>

                <div className="mt-12 flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="text-charcoal/40 hover:text-charcoal font-bold uppercase tracking-widest text-xs transition-colors"
                    >
                        ← Back to Tiers
                    </button>
                    <Button onClick={handleNext} disabled={!formData.name || !formData.email || !formData.waiverHealthy || !formData.waiverTowels || !formData.termsAccepted}>
                        Confirm Booking
                    </Button>
                </div>
            </div>
        </div>
    );
}
