import React from 'react';

import { Sidebar } from './Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-neutral-100 flex text-neutral-900 font-sans">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto max-h-screen">
                <div className="max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
