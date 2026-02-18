"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { StandardSection } from '@/components/StandardSection';
import { StepSelection } from '@/components/Ticketing/StepSelection';
import { StepDetails } from '@/components/Ticketing/StepDetails';
import { StepConfirmation } from '@/components/Ticketing/StepConfirmation';
import { TierPicker } from '@/components/Ticketing/TierPicker';
import { FestivalGuide } from '@/components/Ticketing/FestivalGuide';
import { DeskBackground } from '@/components/Ticketing/DeskBackground';
import { FestivalPass } from '@/components/Ticketing/FestivalPass'; // Ensure this is imported if needed for type reference or similar
import { checkInventoryAction } from '@/app/actions/inventory';
import { EventData as TicketTier, TicketSubTier } from '@/data/festivals';

type Step = 'selection' | 'guide' | 'tiers' | 'details' | 'confirmation';

export default function TicketingPage() {
    // Actually step 3 of this file uses TierPicker.

    const [currentStep, setCurrentStep] = useState<Step>('selection');
    const [selectedEvent, setSelectedEvent] = useState<TicketTier | null>(null);
    const [selectedSubTier, setSelectedSubTier] = useState<TicketSubTier | null>(null);
    const [inventory, setInventory] = useState<Record<string, { remaining: number; soldOut: boolean }>>({});
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        age: '',
        gender: '',
        waiverAccepted: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch Inventory on Mount
    React.useEffect(() => {
        // Gather all tier IDs from all festivals
        // We can import FESTIVAL_DATA here or assume we just want to fetch when an event is selected?
        // Let's fetch ALL for now so it's ready.
        // Importing FESTIVAL_DATA inside useEffect or component file?
        // It's client-side, so we can import it.
        const fetchInventory = async () => {
            // We need FESTIVAL_DATA to know IDs. 
            // Ideally we import it at top level. 
            // I'll add the import in a separate replace block or assume it's available?
            // It's not imported at top level currently.
            // I will use a simple "fetch all known IDs" strategy if I can, OR just fetch when event selected.
            // Fetching when event selected is better for payload size if list is huge,
            // but here it's small.
            // Let's just fetch when `selectedEvent` changes?
            // Yes, that's cleaner.
        };
        // Actually, if we want to show "Sold Out" on the main selection screen (event level?), we need it earlier.
        // But for now, we just need it for TierPicker.
    }, []);

    // Effect to fetch inventory when event is selected
    React.useEffect(() => {
        if (selectedEvent) {
            const updatedIds = selectedEvent.tiers.map(t => t.id);
            checkInventoryAction(updatedIds).then((data: Record<string, { remaining: number; soldOut: boolean }>) => {
                setInventory(prev => ({ ...prev, ...data }));
            });
        }
    }, [selectedEvent]);

    const handleEventSelect = (event: TicketTier) => {
        setSelectedEvent(event);
        setCurrentStep('guide');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleTierSelect = (tier: TicketSubTier) => {
        setSelectedSubTier(tier);
        setCurrentStep('details');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFormChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleConfirm = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // 1. Trigger Stripe Checkout
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId: selectedSubTier?.id, // In a real app, this would be a Stripe Price ID
                    email: formData.email,
                    name: formData.name,
                    metadata: {
                        event_id: selectedEvent?.id,
                        age: formData.age,
                        gender: formData.gender,
                        phone: formData.phone,
                        waiver_accepted: formData.waiverAccepted.toString(),
                        waiver_accepted_at: new Date().toISOString()
                    }
                }),
            });

            if (!response.ok) {
                const text = await response.text();
                try {
                    const data = JSON.parse(text);
                    throw new Error(data.error || 'Something went wrong');
                } catch {
                    throw new Error(`Server returned an error (${response.status})`);
                }
            }

            const data = await response.json();
            // Redirect to Stripe
            window.location.href = data.url;
        } catch (err: any) {
            console.error('Checkout failed:', err);
            setError(err.message || 'Payment system unreachable');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col relative">
            <DeskBackground />
            <Header />

            <main className="flex-1 pt-32 pb-20 relative z-10">
                <StandardSection id="tickets" variant="naturalPaper" className="!bg-transparent !border-transparent relative z-10">
                    <div className="relative z-10 min-h-[600px]">
                        <AnimatePresence mode="wait">
                            {currentStep === 'selection' && (
                                <motion.div
                                    key="selection"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.5, ease: "anticipate" }}
                                >
                                    <StepSelection
                                        selectedTier={selectedEvent}
                                        onSelect={handleEventSelect}
                                    />
                                </motion.div>
                            )}

                            {currentStep === 'guide' && selectedEvent && (
                                <motion.div
                                    key="guide"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ duration: 0.5, ease: "anticipate" }}
                                >
                                    <FestivalGuide
                                        event={selectedEvent}
                                        onContinue={() => setCurrentStep('tiers')}
                                        onBack={() => setCurrentStep('selection')}
                                    />
                                </motion.div>
                            )}

                            {currentStep === 'tiers' && selectedEvent && (
                                <motion.div
                                    key="tiers"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.5, ease: "anticipate" }}
                                >
                                    <div className="text-center mb-0">
                                        <button
                                            onClick={() => setCurrentStep('guide')}
                                            className="text-charcoal/40 hover:text-charcoal font-bold uppercase tracking-widest text-[10px] mb-8 transition-colors"
                                        >
                                            ← Back to Guide
                                        </button>
                                    </div>
                                    <TierPicker
                                        event={selectedEvent}
                                        selectedTierId={selectedSubTier?.id}
                                        onSelect={handleTierSelect}
                                        inventory={inventory}
                                    />
                                </motion.div>
                            )}

                            {currentStep === 'details' && selectedEvent && (
                                <motion.div
                                    key="details"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.5, ease: "anticipate" }}
                                >
                                    {error && (
                                        <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 font-mono text-sm">
                                            {error}
                                        </div>
                                    )}
                                    <StepDetails
                                        formData={formData}
                                        onChange={handleFormChange}
                                        onBack={() => setCurrentStep('tiers')}
                                        onNext={handleConfirm}
                                        selectedTier={selectedEvent}
                                    />
                                </motion.div>
                            )}

                            {currentStep === 'confirmation' && selectedEvent && selectedSubTier && (
                                <motion.div
                                    key="confirmation"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6, ease: "backOut" }}
                                >
                                    <StepConfirmation
                                        selectedTier={{
                                            ...selectedEvent,
                                            title: `${selectedEvent.title} - ${selectedSubTier.name}`,
                                            featuredPrice: selectedSubTier.price
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        } as any}
                                        formData={formData}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Progress Indicator */}
                    <div className="mt-20 flex flex-col items-center gap-6 relative z-10">
                        <div className="flex justify-center gap-4">
                            {[1, 2, 3, 4, 5].map((s) => {
                                const stepNames: Step[] = ['selection', 'guide', 'tiers', 'details', 'confirmation'];
                                const stepKey = stepNames[s - 1];
                                const isActive = currentStep === stepKey;
                                const currentIndex = stepNames.indexOf(currentStep);
                                const isDone = stepNames.indexOf(stepKey) < currentIndex;

                                return (
                                    <div
                                        key={s}
                                        className={`w-3 h-3 rounded-full transition-all duration-500 border-2 ${isActive
                                            ? 'bg-primary border-primary scale-125 shadow-[0_0_15px_rgba(255,184,76,0.5)]'
                                            : isDone
                                                ? 'bg-charcoal border-charcoal'
                                                : 'bg-transparent border-charcoal/20'
                                            }`}
                                    />
                                );
                            })}
                        </div>
                        <p className="text-[10px] uppercase tracking-[0.4em] font-black text-charcoal/30">
                            {currentStep === 'selection' && "Step 1: Choose Event"}
                            {currentStep === 'guide' && "Step 2: Festival Guide"}
                            {currentStep === 'tiers' && "Step 3: Choose Pass Type"}
                            {currentStep === 'details' && "Step 4: Your Details"}
                            {currentStep === 'confirmation' && "Step 5: Confirmed"}
                        </p>
                    </div>
                </StandardSection>
            </main>

            <Footer />
        </div>
    );
}
