'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, Users, CalendarDays, Activity } from 'lucide-react';
import { DashboardKPIs } from '@/app/actions/dashboard';
import Link from 'next/link';

interface DashboardKPIsClientProps {
    data: DashboardKPIs;
    eventsUrl: string;
}

export function DashboardKPIsClient({ data, eventsUrl }: DashboardKPIsClientProps) {
    const { totalTicketsSold, totalCapacity, activeEvents, liveAttendance, activeAmbassadors } = data;

    // Safety check for NaN or Infinity
    const safeCapacity = totalCapacity > 0 ? totalCapacity : 1;
    const soldPercentage = Math.round((totalTicketsSold / safeCapacity) * 100);

    const cards = [
        {
            title: 'Tickets Sold',
            value: totalTicketsSold.toLocaleString(),
            subtitle: `${soldPercentage}% of Capacity`,
            icon: Ticket,
            color: 'text-primary',
            bg: 'bg-primary/10',
            border: 'border-primary/20',
            link: '/admin/settings' // Optional link
        },
        {
            title: 'Live Attendance',
            value: liveAttendance.toLocaleString(),
            subtitle: 'Checked-in guests',
            icon: Activity,
            color: 'text-green-600',
            bg: 'bg-green-500/10',
            border: 'border-green-500/20',
            link: '/admin/scanner'
        },
        {
            title: 'Active Events',
            value: activeEvents.toLocaleString(),
            subtitle: 'Currently running',
            icon: CalendarDays,
            color: 'text-blue-600',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20',
            link: eventsUrl
        },
        {
            title: 'Top Ambassadors',
            value: activeAmbassadors.toLocaleString(),
            subtitle: 'Driving sales',
            icon: Users,
            color: 'text-purple-600',
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/20',
            link: '/admin/ambassadors'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {cards.map((card, i) => {
                const isPrimary = i === 0;
                const Icon = card.icon;

                return (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                        className={`relative group overflow-hidden bg-white p-6 rounded-3xl border ${isPrimary ? 'border-charcoal/10 shadow-xl shadow-primary/5' : 'border-neutral-200/50 shadow-sm'} hover:shadow-lg transition-all duration-500`}
                    >
                        {/* Decorative background element for the primary card */}
                        {isPrimary && (
                            <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500" />
                        )}

                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className={`p-3 rounded-2xl ${card.bg} ${card.border} border`}>
                                <Icon className={`w-5 h-5 ${card.color}`} strokeWidth={2.5} />
                            </div>

                            {card.link && (
                                <Link href={card.link} className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-neutral-100 rounded-full">
                                    <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </Link>
                            )}
                        </div>

                        <div className="space-y-1 relative z-10">
                            <h3 className="text-4xl md:text-5xl font-chicle text-charcoal tracking-wide">
                                {card.value}
                            </h3>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold font-mono uppercase tracking-[0.2em] text-charcoal/80">
                                    {card.title}
                                </span>
                                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 mt-1">
                                    {card.subtitle}
                                </span>
                            </div>
                        </div>

                        {/* Interactive hover border effect */}
                        <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-primary/20 transition-colors pointer-events-none" />
                    </motion.div>
                );
            })}
        </div>
    );
}
