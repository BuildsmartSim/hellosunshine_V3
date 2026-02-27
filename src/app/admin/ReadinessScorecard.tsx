'use client';

import React, { useState, useEffect } from 'react';
import { toggleReadinessTaskAction } from '@/app/actions/admin';
import { createClient } from '@/utils/supabase/client';

export type ReadinessTask = {
    id: string;
    label: string;
    isCompleted: boolean;
};

export function ReadinessScorecard({ initialTasks }: { initialTasks: ReadinessTask[] }) {
    const [tasks, setTasks] = useState(initialTasks);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);
    const supabase = createClient();

    // Subscribe to Real-time updates on profiles table
    useEffect(() => {
        const channel = supabase
            .channel('readiness-sync')
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'profiles',
                filter: `email=ilike.*@readiness.test`
            }, (payload: any) => {
                const updated = payload.new;
                setTasks(prev => prev.map(t =>
                    t.id === updated.email ? { ...t, isCompleted: updated.phone === 'YES' } : t
                ));
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    const handleToggle = async (id: string, current: boolean) => {
        setIsUpdating(id);
        const success = await toggleReadinessTaskAction(id, !current);
        if (success) {
            // Optimistic update handled by Real-time, but we can set it here too
            setTasks(prev => prev.map(t => t.id === id ? { ...t, isCompleted: !current } : t));
        }
        setIsUpdating(null);
    };

    const completedCount = tasks.filter(t => t.isCompleted).length;
    const progress = Math.round((completedCount / tasks.length) * 100);

    return (
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-xl overflow-hidden mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="p-8 bg-neutral-900 text-white relative overflow-hidden">
                {/* Accent background element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-3xl opacity-30"></div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h3 className="text-sm font-black text-neutral-400 uppercase tracking-[0.3em] font-mono mb-2">Team Sync / Mission Readiness</h3>
                        <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-black font-mono">{progress}%</span>
                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Team Goal: 100% Ready</span>
                        </div>
                    </div>

                    <div className="w-full md:w-64">
                        <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-1000 ease-out"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <p className="text-[10px] text-neutral-500 font-mono mt-2 uppercase tracking-widest text-right">
                            {completedCount} of {tasks.length} Mitigations Active
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-neutral-50/50">
                {tasks.map((task) => (
                    <button
                        key={task.id}
                        onClick={() => handleToggle(task.id, task.isCompleted)}
                        disabled={isUpdating === task.id}
                        className={`group flex items-start gap-4 p-4 rounded-2xl border transition-all text-left relative overflow-hidden ${task.isCompleted
                                ? 'bg-white border-green-200 shadow-sm'
                                : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-md'
                            } active:scale-95 disabled:opacity-50`}
                    >
                        {/* Checkbox Icon */}
                        <div className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border-2 transition-all ${task.isCompleted
                                ? 'bg-green-600 border-green-600 text-white shadow-[0_0_10px_rgba(22,163,74,0.3)]'
                                : 'border-neutral-200 group-hover:border-neutral-400'
                            }`}>
                            {task.isCompleted && (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>

                        <div>
                            <p className={`text-[11px] font-black uppercase tracking-wider font-mono mb-1 ${task.isCompleted ? 'text-green-700' : 'text-neutral-400'
                                }`}>
                                {task.isCompleted ? 'Active' : 'Pending Check'}
                            </p>
                            <p className={`text-sm font-bold leading-tight ${task.isCompleted ? 'text-neutral-900 group-hover:text-green-900' : 'text-neutral-700'
                                }`}>
                                {task.label}
                            </p>
                        </div>

                        {isUpdating === task.id && (
                            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                <span className="animate-spin text-neutral-400">⚡</span>
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
