'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export function ReferralTracker() {
    const searchParams = useSearchParams();

    useEffect(() => {
        const ref = searchParams.get('ref');
        if (ref) {
            // Save referral code in cookie for 30 days
            document.cookie = `sunshine_referral=${ref}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
        }
    }, [searchParams]);

    return null;
}
