import React from 'react';

import { Sidebar } from './Sidebar';

import { requireAdminOrPin } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    // Basic auth check for all admin routes.
    // We allow both admins and clerks (who might not have a PIN initially but are authenticated).
    // Finer-grained PIN checks happen at the action level.
    const { createClient } = await import('@/utils/supabase/server');
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/admin/login');
    }

    return (
        <div className="min-h-screen bg-neutral-100 flex flex-col lg:flex-row text-neutral-900 font-sans">
            <Sidebar />
            <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-h-screen">
                <div className="max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
