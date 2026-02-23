import React from 'react';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const revalidate = 0;

export default async function AmbassadorsPage() {
    // Fetch ambassadors and count tickets linked to each
    const { data: ambassadors, error } = await supabaseAdmin
        .from('ambassadors')
        .select(`
            *,
            tickets ( count )
        `)
        .order('created_at', { ascending: false });

    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Ambassador Program</h1>
                    <p className="text-neutral-500 mt-1">Manage referrals, track ticket sales, and issue rewards.</p>
                </div>
                <div className="flex space-x-4">
                    <Link href="/admin" className="px-4 py-2 text-sm font-bold text-neutral-500 hover:text-neutral-800 transition-colors">
                        &larr; Admin Home
                    </Link>
                    <Link href="/admin/ambassadors/new" className="px-4 py-2 bg-neutral-900 text-white text-sm font-bold rounded-lg shadow hover:bg-neutral-800 transition-colors">
                        + Generate New Code
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-neutral-100 bg-neutral-50/50">
                    <h3 className="text-lg font-bold text-neutral-800 tracking-tight">Active Ambassadors</h3>
                </div>

                {error ? (
                    <div className="p-6 text-red-500 font-mono text-sm">Failed to load ambassadors: {error.message}</div>
                ) : ambassadors?.length === 0 ? (
                    <div className="p-12 text-center text-neutral-500">
                        <p className="mb-4">No ambassadors found.</p>
                        <Link href="/admin/ambassadors/new" className="text-primary font-bold hover:underline">
                            Create your first ambassador
                        </Link>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wider font-bold text-neutral-500 font-mono">
                                <th className="px-6 py-4">Ambassador</th>
                                <th className="px-6 py-4">Referral Code</th>
                                <th className="px-6 py-4">Tickets Sold</th>
                                <th className="px-6 py-4">Milestone</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {ambassadors?.map((ambassador: any) => {
                                // Count is returned as an array of objects by Supabase for joins
                                const ticketsSold = ambassador.tickets?.[0]?.count || 0;

                                // Simple Milestone calculation
                                let milestone = "Starter";
                                let badgeColor = "bg-neutral-100 text-neutral-600";

                                if (ticketsSold >= 100) {
                                    milestone = "Platinum Partner";
                                    badgeColor = "bg-purple-100 text-purple-700 font-bold";
                                } else if (ticketsSold >= 50) {
                                    milestone = "Gold Standard";
                                    badgeColor = "bg-yellow-100 text-yellow-700 font-bold";
                                } else if (ticketsSold >= 25) {
                                    milestone = "Silver Club";
                                    badgeColor = "bg-gray-200 text-gray-700 font-bold";
                                } else if (ticketsSold >= 10) {
                                    milestone = "Bronze Tier";
                                    badgeColor = "bg-amber-100 text-amber-700";
                                }

                                return (
                                    <tr key={ambassador.id} className="hover:bg-neutral-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-neutral-900">{ambassador.name}</p>
                                            <p className="text-sm text-neutral-500 font-mono">{ambassador.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="inline-block bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded font-mono text-sm font-bold tracking-widest">
                                                {ambassador.referral_code}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-2xl font-bold text-neutral-800">{ticketsSold}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs tracking-wider uppercase ${badgeColor}`}>
                                                {milestone}
                                            </span>
                                            {ticketsSold < 10 && (
                                                <p className="text-[10px] text-neutral-400 mt-1">{10 - ticketsSold} away from Bronze</p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/ambassadors/${ambassador.referral_code}`}
                                                target="_blank"
                                                className="text-xs font-bold text-primary hover:text-primary/70 underline"
                                            >
                                                View Dashboard ↗
                                            </Link>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
