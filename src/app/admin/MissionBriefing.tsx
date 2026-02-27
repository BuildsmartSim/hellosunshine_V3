'use client';

import React, { useState, useEffect } from 'react';
import type { ReadinessTask } from './ReadinessScorecard';

export function MissionBriefing({ tasks }: { tasks: ReadinessTask[] }) {
    const [isOpen, setIsOpen] = useState(false);

    // Auto-open if not acknowledged in this session
    useEffect(() => {
        const acknowledged = sessionStorage.getItem('hss_briefing_seen');
        if (!acknowledged) {
            setIsOpen(true);
        }
    }, []);

    const handleAcknowledge = () => {
        sessionStorage.setItem('hss_briefing_seen', 'true');
        setIsOpen(false);
    };

    if (!isOpen) return (
        <button
            onClick={() => setIsOpen(true)}
            className="fixed top-4 right-4 z-50 bg-neutral-900 text-white p-3 rounded-full shadow-2xl hover:scale-110 active:scale-90 transition-all border border-white/20"
            title="Review Briefing"
        >
            <span className="text-xs font-black font-mono">MITIGATIONS: {tasks.filter(t => t.isCompleted).length}/{tasks.length}</span>
        </button>
    );

    const readyCount = tasks.filter(t => t.isCompleted).length;
    const isReady = readyCount === tasks.length;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-neutral-200 animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
                <div className={`p-8 text-white ${isReady ? 'bg-green-600' : 'bg-red-600'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest font-mono">
                            Pre-Flight Briefing
                        </span>
                        <span className="text-xs font-mono opacity-80 uppercase tracking-widest">
                            Station: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </span>
                    </div>

                    <h2 className="text-3xl font-black uppercase tracking-tighter leading-none mb-2 font-mono">
                        {isReady ? 'MISSION READY' : 'MITIGATION PENDING'}
                    </h2>
                    <p className="text-sm font-bold opacity-90 font-mono leading-relaxed">
                        {isReady
                            ? "All critical sanctuary safety protocols are verified active."
                            : "WARNING: High-priority event mitigations are still pending."}
                    </p>
                </div>

                <div className="p-8 space-y-6">
                    <div className="space-y-3">
                        {tasks.map((task) => (
                            <div key={task.id} className="flex items-center gap-4 py-2 border-b border-neutral-100 last:border-0">
                                <span className={`w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center ${task.isCompleted ? 'bg-green-500 border-green-500 text-white' : 'border-neutral-200 bg-neutral-50'
                                    }`}>
                                    {task.isCompleted && (
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </span>
                                <span className={`text-sm font-bold tracking-tight uppercase font-mono ${task.isCompleted ? 'text-neutral-800' : 'text-neutral-400'}`}>
                                    {task.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 border-t border-neutral-100 italic text-[10px] text-neutral-400 uppercase tracking-widest font-mono leading-relaxed">
                        By proceeding, you acknowledge that you are aware of these sanctuary-specific operational protocols.
                    </div>

                    <button
                        onClick={handleAcknowledge}
                        className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.3em] font-mono shadow-xl active:scale-95 transition-all ${isReady
                                ? 'bg-neutral-900 text-white hover:bg-black'
                                : 'bg-red-50 text-red-600 border-2 border-red-600 hover:bg-red-100'
                            }`}
                    >
                        {isReady ? 'Commence Scanning' : 'Acknowledge & Sync'}
                    </button>
                </div>
            </div>
        </div>
    );
}
