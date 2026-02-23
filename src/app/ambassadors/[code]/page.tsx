import React from 'react';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { AmbassadorDashboardClient } from './AmbassadorDashboardClient';
import { headers } from 'next/headers';

export const revalidate = 0; // Don't cache so sales update instantly

export default async function AmbassadorDashboardPage({ params }: { params: Promise<{ code: string }> }) {
    const { code } = await params;

    // Determine base URL for sharing
    const headersList = await headers();
    const host = headersList.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    // Fetch the ambassador by their referral code
    const { data: ambassador, error } = await supabaseAdmin
        .from('ambassadors')
        .select(`
            *,
            tickets ( count )
        `)
        .ilike('referral_code', code) // Case-insensitive exact match
        .single();

    if (error || !ambassador) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFCF9] p-4 text-center">
                <div>
                    <h1 className="text-2xl font-bold text-charcoal mb-2">Ambassador Not Found</h1>
                    <p className="text-charcoal/60">This referral code doesn't exist.</p>
                </div>
            </div>
        );
    }

    const processedAmbassdor = {
        name: ambassador.name,
        referral_code: ambassador.referral_code,
        tickets_sold: ambassador.tickets?.[0]?.count || 0
    };

    return (
        <div className="min-h-screen bg-[#F9F7F2] py-12 px-4 selection:bg-primary/30">
            <AmbassadorDashboardClient ambassador={processedAmbassdor} baseUrl={baseUrl} />
        </div>
    );
}
