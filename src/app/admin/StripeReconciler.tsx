'use client';

import React, { useState } from 'react';
import { reconcileStripeAction } from '@/app/actions/tickets';

export function StripeReconciler() {
    const [sessionId, setSessionId] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleReconcile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sessionId.startsWith('cs_')) {
            setMessage({ text: 'Invalid session ID format. Must start with cs_', type: 'error' });
            return;
        }

        setIsProcessing(true);
        setMessage({ text: '', type: '' });

        try {
            const res = await reconcileStripeAction(sessionId);
            if (res.success) {
                setMessage({ text: res.message || 'Reconciliation successful!', type: 'success' });
                setSessionId('');
            } else {
                setMessage({ text: res.error || 'Reconciliation failed', type: 'error' });
            }
        } catch (err: any) {
            setMessage({ text: 'Process failed: ' + err.message, type: 'error' });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl overflow-hidden mt-8">
            <div className="p-6 border-b border-neutral-100 bg-red-900">
                <h3 className="text-sm font-black text-white tracking-[0.2em] uppercase font-mono">Manual Stripe Reconciliation</h3>
                <p className="text-[10px] text-red-200 font-mono uppercase tracking-widest mt-1">EMERGENCY USE ONLY: Force Ticket Issuance</p>
            </div>

            <div className="p-8">
                <p className="text-xs text-neutral-500 font-mono mb-6 uppercase tracking-widest leading-relaxed italic">
                    If a customer has paid but no ticket was issued (webhook failure), paste the Stripe Checkout Session ID here.
                </p>

                <form onSubmit={handleReconcile} className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono mb-2">Session ID (starts with cs_...)</label>
                        <input
                            type="text"
                            value={sessionId}
                            onChange={(e) => setSessionId(e.target.value.trim())}
                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-red-600 outline-none font-mono text-sm transition-all"
                            placeholder="cs_live_..."
                        />
                    </div>

                    {message.text && (
                        <div className={`p-4 rounded-xl font-mono text-xs font-bold uppercase tracking-widest ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isProcessing || !sessionId}
                        className="w-full py-4 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 active:scale-95 transition-all text-xs uppercase tracking-[0.2em] font-mono disabled:opacity-50"
                    >
                        {isProcessing ? 'Verifying with Stripe...' : 'RECONCILE & ISSUE TICKET'}
                    </button>
                </form>
            </div>
        </div>
    );
}
