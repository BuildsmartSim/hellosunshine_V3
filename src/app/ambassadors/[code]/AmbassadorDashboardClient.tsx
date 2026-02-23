'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/Button';
import { fonts, textures } from '@/design-system/tokens';

interface AmbassadorDashboardClientProps {
    ambassador: {
        name: string;
        referral_code: string;
        tickets_sold: number;
    };
    baseUrl: string;
}

export function AmbassadorDashboardClient({ ambassador, baseUrl }: AmbassadorDashboardClientProps) {
    const [copied, setCopied] = useState(false);
    const referralLink = `${baseUrl}/tickets?ref=${ambassador.referral_code}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(referralLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text', err);
        }
    };

    const ticketsSold = ambassador.tickets_sold || 0;

    // Reward calculation logic (matching Admin view)
    let currentMilestone = "Starter";
    let nextMilestone = "Bronze Tier (10 sales)";
    let nextTarget = 10;

    if (ticketsSold >= 100) {
        currentMilestone = "Platinum Partner";
        nextMilestone = "Max Tier Reached!";
        nextTarget = 100;
    } else if (ticketsSold >= 50) {
        currentMilestone = "Gold Standard";
        nextMilestone = "Platinum Partner (100 sales)";
        nextTarget = 100;
    } else if (ticketsSold >= 25) {
        currentMilestone = "Silver Club";
        nextMilestone = "Gold Standard (50 sales)";
        nextTarget = 50;
    } else if (ticketsSold >= 10) {
        currentMilestone = "Bronze Tier";
        nextMilestone = "Silver Club (25 sales)";
        nextTarget = 25;
    }

    const progressPercentage = Math.min(100, Math.max(0, (ticketsSold / nextTarget) * 100));

    return (
        <div className="w-full max-w-lg mx-auto" style={{ fontFamily: fonts.body }}>
            {/* Header Card */}
            <div className="bg-white rounded-[2rem] shadow-xl border border-charcoal/5 p-8 mb-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `url('${textures.paper}')` }}></div>

                <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-primary mb-2">Ambassador Portal</p>
                <h1 className="text-3xl font-black text-charcoal uppercase tracking-tighter mb-6" style={{ fontFamily: fonts.accent }}>
                    Welcome, {ambassador.name.split(' ')[0]}
                </h1>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-charcoal/5 p-4 rounded-2xl">
                        <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-1">Tickets Sold</p>
                        <p className="text-3xl font-bold text-charcoal">{ticketsSold}</p>
                    </div>
                    <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl">
                        <p className="text-[10px] font-bold text-primary/70 uppercase tracking-widest mb-1">Current Tier</p>
                        <p className="text-lg font-bold text-primary leading-tight mt-1">{currentMilestone}</p>
                    </div>
                </div>

                {ticketsSold < 100 && (
                    <div className="mt-8 text-left">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs font-bold text-charcoal/60">Next: <span className="text-charcoal">{nextMilestone}</span></span>
                            <span className="text-xs font-mono font-bold text-charcoal/40">{ticketsSold} / {nextTarget}</span>
                        </div>
                        <div className="w-full h-3 bg-charcoal/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary ease-out duration-1000 transition-all rounded-full"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                        <p className="text-[10px] text-charcoal/40 italic mt-2 text-center">
                            Only {nextTarget - ticketsSold} more sales to unlock your next reward!
                        </p>
                    </div>
                )}
            </div>

            {/* QR Code Card */}
            <div className="bg-white rounded-[2rem] shadow-xl border border-charcoal/5 p-8 text-center relative overflow-hidden">
                <h2 className="text-xl font-bold text-charcoal mb-2">Your Festival Link</h2>
                <p className="text-sm text-charcoal/60 mb-8">Have customers scan this code to buy tickets instantly. You'll automatically get credit for the sale.</p>

                <div className="bg-white p-4 inline-block rounded-2xl shadow-sm border border-neutral-100 mb-8">
                    <QRCodeSVG
                        value={referralLink}
                        size={200}
                        bgColor={"#ffffff"}
                        fgColor={"#000000"}
                        level={"H"}
                        includeMargin={false}
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <div className="bg-neutral-100 p-3 rounded-xl border border-neutral-200 flex items-center justify-between">
                        <span className="font-mono text-xs text-neutral-600 truncate mr-4">{referralLink}</span>
                        <button
                            onClick={handleCopy}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${copied ? 'bg-green-100 text-green-700' : 'bg-charcoal text-white hover:bg-charcoal/80'}`}
                        >
                            {copied ? 'Copied!' : 'Copy Link'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
