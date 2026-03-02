'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Ticket, Star, ArrowUpRight, Users } from 'lucide-react';
import Link from 'next/link';

interface RecentActivityProps {
    recentPurchases: any[];
    leaderboard: { name: string; sales: number }[];
}

export function RecentActivity({ recentPurchases, leaderboard }: RecentActivityProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            {/* Recent Ticket Feed */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-neutral-200/50 shadow-sm overflow-hidden flex flex-col h-[500px]">
                <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
                    <div>
                        <h3 className="text-sm font-black text-charcoal tracking-[0.2em] uppercase font-mono flex items-center gap-2">
                            <Ticket className="w-4 h-4 text-primary" />
                            Live Ticketing Feed
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Live</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                    {recentPurchases?.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-neutral-400 font-mono text-xs tracking-widest uppercase">
                            No recent purchases
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {recentPurchases?.map((ticket, i) => (
                                <motion.div
                                    key={ticket.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-neutral-50 transition-colors group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold font-mono uppercase">
                                            {ticket.profile?.full_name?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-charcoal font-mono">
                                                {ticket.profile?.full_name || 'Guest'}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded text-[9px] font-mono uppercase tracking-widest">
                                                    {ticket.product?.name || 'Ticket'}
                                                </span>
                                                {ticket.ambassador && (
                                                    <span className="px-2 py-0.5 bg-purple-50 text-purple-600 border border-purple-100 rounded text-[9px] font-mono uppercase tracking-widest flex items-center gap-1">
                                                        <Star className="w-2 h-2" />
                                                        {ticket.ambassador.name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-mono text-neutral-400">
                                            {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
                                        </p>
                                        <Link
                                            href={`/admin/scanner?q=${ticket.id}`}
                                            className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest text-primary hover:text-primary/70 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            View <ArrowUpRight className="w-3 h-3" />
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Ambassador Leaderboard */}
            <div className="bg-charcoal text-white rounded-3xl border border-neutral-800 shadow-xl overflow-hidden flex flex-col h-[500px]">
                <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
                    <h3 className="text-sm font-black text-white tracking-[0.2em] uppercase font-mono flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        Top Ambassadors
                    </h3>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {leaderboard?.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-neutral-500 font-mono text-xs tracking-widest uppercase text-center">
                            No ambassador<br />sales yet
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {leaderboard?.map((ambassador, i) => (
                                <div key={ambassador.name} className="flex items-center gap-4 relative">
                                    {/* Rank Badge */}
                                    <div className={`
                                        w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm z-10
                                        ${i === 0 ? 'bg-yellow-400 text-yellow-950 shadow-[0_0_15px_rgba(250,204,21,0.3)]' :
                                            i === 1 ? 'bg-neutral-300 text-neutral-800' :
                                                i === 2 ? 'bg-[#b08d57] text-white' :
                                                    'bg-neutral-800 text-neutral-400'}
                                    `}>
                                        #{i + 1}
                                    </div>

                                    <div className="flex-1">
                                        <p className="font-bold text-sm tracking-wide">{ambassador.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            {/* Progress Bar Background */}
                                            <div className="flex-1 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                                                {/* Progress Bar Fill */}
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(ambassador.sales / leaderboard[0].sales) * 100}%` }}
                                                    transition={{ duration: 1, delay: i * 0.1 }}
                                                    className={`h-full rounded-full ${i === 0 ? 'bg-yellow-400' : 'bg-white/20'}`}
                                                />
                                            </div>
                                            <span className="text-xs font-mono text-neutral-400 tabular-nums">
                                                {ambassador.sales}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="p-4 border-t border-neutral-800 bg-neutral-900/50">
                    <Link
                        href="/admin/ambassadors"
                        className="w-full py-2 flex items-center justify-center text-[10px] font-mono text-neutral-400 uppercase tracking-widest hover:text-white transition-colors"
                    >
                        View All Ambassadors
                    </Link>
                </div>
            </div>
        </div>
    );
}
