'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PINOverrideModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (pin: string) => void;
    title?: string;
    description?: string;
}

export function PINOverrideModal({ isOpen, onClose, onSuccess, title = "Manager Authorization Required", description = "Please enter the Manager PIN to proceed." }: PINOverrideModalProps) {
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);

    // Provide a simple local shake animation on error
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (pin.length < 4) {
            setError(true);
            setTimeout(() => setError(false), 500);
            return;
        }
        onSuccess(pin);
        setPin(''); // Reset on success to avoid keeping in memory
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-200"
                    >
                        <div className="p-6 border-b border-neutral-100 bg-neutral-900 text-center">
                            <h3 className="text-sm font-black text-white tracking-[0.2em] uppercase font-mono">{title}</h3>
                        </div>

                        <div className="p-8">
                            <p className="text-xs text-neutral-500 font-mono mb-6 uppercase tracking-widest leading-relaxed text-center">
                                {description}
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <motion.input
                                        type="password"
                                        autoFocus
                                        maxLength={6}
                                        value={pin}
                                        onChange={(e) => {
                                            setPin(e.target.value.replace(/\D/g, ''));
                                            setError(false);
                                        }}
                                        animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                                        transition={{ duration: 0.4 }}
                                        className={`w-full text-center text-3xl tracking-[1em] py-4 bg-neutral-50 border-2 rounded-xl focus:outline-none font-mono transition-colors ${error ? 'border-red-500 text-red-500 bg-red-50 focus:border-red-500' : 'border-neutral-200 focus:border-neutral-900'
                                            }`}
                                        placeholder="••••"
                                    />
                                    {error && (
                                        <p className="text-[10px] text-red-500 font-mono uppercase tracking-widest text-center mt-2 font-bold hover:animate-pulse">
                                            PIN must be at least 4 digits
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="py-4 border-2 border-neutral-200 text-neutral-600 font-black rounded-xl hover:bg-neutral-50 hover:border-neutral-300 active:scale-95 transition-all text-[10px] uppercase tracking-[0.2em] font-mono"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={pin.length < 4}
                                        className="py-4 bg-neutral-900 text-white font-black rounded-xl hover:bg-neutral-800 active:scale-95 transition-all text-[10px] uppercase tracking-[0.2em] font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Authorize
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
