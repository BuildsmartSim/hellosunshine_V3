import React from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-neutral-100 flex flex-col text-neutral-900 font-sans">
            <header className="bg-white border-b border-neutral-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-bold tracking-[0.2em] uppercase font-mono text-neutral-800">
                        Hello Sunshine Admin
                    </h1>
                </div>
                <div className="flex items-center gap-6">
                    <a href="/admin/ambassadors" className="text-xs font-mono font-bold tracking-widest text-primary hover:text-primary/80 transition-colors uppercase">
                        Ambassadors
                    </a>
                    <a href="/admin/social" className="text-xs font-mono font-bold tracking-widest text-neutral-500 hover:text-neutral-900 transition-colors uppercase">
                        Social
                    </a>
                    <a href="/admin/broadcasts" className="text-xs font-mono font-bold tracking-widest text-neutral-500 hover:text-neutral-900 transition-colors uppercase">
                        Broadcasts
                    </a>
                    <a href="/admin/settings" className="text-xs font-mono font-bold tracking-widest text-neutral-500 hover:text-neutral-900 transition-colors uppercase">
                        Setup APIs
                    </a>
                    <a href="/" className="text-xs font-mono font-bold tracking-widest text-neutral-500 hover:text-neutral-900 transition-colors uppercase">
                        Return to Site &rarr;
                    </a>
                </div>
            </header>
            <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
                {children}
            </main>
        </div>
    );
}
