import React from 'react';
import { motion } from 'framer-motion';
import { TicketSubTier, EventData } from '@/data/festivals';
import { fonts, textures } from '@/design-system/tokens';

interface TierPickerProps {
    event: EventData;
    selectedTierId?: string;
    onSelect: (tier: TicketSubTier) => void;
    inventory?: Record<string, { remaining: number; soldOut: boolean }>;
}

export function TierPicker({ event, selectedTierId, onSelect, inventory = {} }: TierPickerProps) {
    return (
        <div className="w-full max-w-2xl mx-auto px-4 mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="relative bg-white/40 p-1 md:p-2 rounded-[2rem] shadow-2xl overflow-hidden group">
                {/* Background Textures */}
                <div className="absolute inset-0 opacity-20 mix-blend-multiply pointer-events-none" style={{ backgroundImage: `url('${textures.paper}')` }}></div>

                <div className="relative bg-white/80 rounded-[1.8rem] p-8 md:p-12 border border-charcoal/5">
                    <div className="mb-10 text-center">
                        <span className="text-[10px] uppercase tracking-[0.5em] text-primary font-black mb-2 block">Choose Your Pass</span>
                        <h3 className="text-3xl md:text-4xl font-black text-charcoal uppercase leading-none tracking-tighter" style={{ fontFamily: fonts.accent }}>
                            {event.title}
                        </h3>
                    </div>

                    <div className="space-y-4">
                        {event.tiers.map((tier) => {
                            const stock = inventory[tier.id];
                            const isSoldOut = stock?.soldOut;
                            const isLowStock = stock?.remaining !== undefined && stock.remaining < 5 && !isSoldOut;

                            return (
                                <motion.button
                                    key={tier.id}
                                    whileHover={!isSoldOut ? { scale: 1.01, x: 5 } : {}}
                                    whileTap={!isSoldOut ? { scale: 0.98 } : {}}
                                    onClick={() => !isSoldOut && onSelect(tier)}
                                    disabled={isSoldOut}
                                    className={`w-full text-left p-6 rounded-2xl border-2 transition-all flex items-center justify-between group/tier 
                                    ${isSoldOut
                                            ? 'bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed grayscale'
                                            : selectedTierId === tier.id
                                                ? 'bg-charcoal border-charcoal text-white shadow-xl'
                                                : 'bg-white/50 border-charcoal/5 hover:border-primary/30 text-charcoal shadow-sm'
                                        }`}
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h4 className="font-bold text-lg uppercase tracking-tight">
                                                {tier.name}
                                                {isSoldOut && <span className="ml-3 inline-block px-2 py-0.5 bg-red-100 text-red-600 text-[10px] rounded leading-none border border-red-200">SOLD OUT</span>}
                                                {isLowStock && <span className="ml-3 inline-block px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] rounded leading-none border border-yellow-200">ONLY {stock.remaining} LEFT</span>}
                                            </h4>
                                            {selectedTierId === tier.id && !isSoldOut && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                            )}
                                        </div>
                                        <p className={`text-xs ${selectedTierId === tier.id ? 'text-white/60' : 'text-charcoal/40'} italic`}>
                                            {tier.description}
                                        </p>
                                    </div>
                                    <div className="text-right ml-4">
                                        <span className={`text-2xl font-bold ${isSoldOut ? 'text-gray-400 line-through' : selectedTierId === tier.id ? 'text-primary' : 'text-charcoal'}`} style={{ fontFamily: fonts.display }}>
                                            {tier.price}
                                        </span>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>

                    <div className="mt-8 pt-8 border-t border-charcoal/5 flex justify-center">
                        <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-charcoal/20">
                            Secure payment & instant confirmation
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
