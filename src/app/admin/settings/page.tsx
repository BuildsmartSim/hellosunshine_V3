import React from 'react';
import Link from 'next/link';

export default function SettingsGuidePage() {
    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="mb-8">
                <Link href="/admin" className="text-sm font-bold text-neutral-500 hover:text-neutral-900 mb-4 inline-block tracking-widest uppercase font-mono">
                    &larr; Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">API Setup Guide</h1>
                <p className="text-neutral-500 mt-2 text-lg">
                    A secure, step-by-step handover for integrating critical third-party services.
                </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl mb-12 shadow-sm">
                <h3 className="text-yellow-900 font-bold mb-2 flex items-center gap-2">
                    <span className="text-xl">⚠️</span> Security Notice
                </h3>
                <p className="text-yellow-800 text-sm leading-relaxed">
                    API keys (like Stripe Secrets) are the master keys to the business. <strong>Never</strong> email them directly, and <strong>never</strong> paste them into a database. We use Vercel Environment Variables to keep them completely isolated and secure.
                </p>
            </div>

            <div className="space-y-12">
                {/* STRIPE SETUP */}
                <section className="bg-white border text-left border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="bg-neutral-50 border-b border-neutral-200 p-6 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-neutral-900">1. Stripe (Payments)</h2>
                            <p className="text-sm text-neutral-500 font-mono mt-1">Required for ticketing checkouts and revenue.</p>
                        </div>
                        <span className="px-3 py-1 bg-neutral-200 text-neutral-700 font-bold text-xs uppercase tracking-widest rounded-full">Required</span>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Step 1 */}
                        <div className="flex gap-6">
                            <div className="w-8 h-8 shrink-0 bg-primary/20 text-primary font-bold rounded-full flex items-center justify-center">1</div>
                            <div>
                                <h4 className="font-bold text-neutral-900 mb-2">Generate the Keys</h4>
                                <p className="text-sm text-neutral-600 mb-3">
                                    Have the manager log into their Stripe account and navigate to the API Keys section (ensure they are viewing <strong>Live</strong> keys, not Test keys).
                                </p>
                                <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 underline">
                                    Open Stripe Dashboard &rarr;
                                </a>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex gap-6">
                            <div className="w-8 h-8 shrink-0 bg-primary/20 text-primary font-bold rounded-full flex items-center justify-center">2</div>
                            <div>
                                <h4 className="font-bold text-neutral-900 mb-2">Transfer Securely</h4>
                                <p className="text-sm text-neutral-600 mb-3">
                                    The manager needs to send you these keys without leaving a trace. Have them open One-Time Secret, paste the key, and email you the self-destructing link.
                                </p>
                                <div className="flex gap-4">
                                    <a href="https://onetimesecret.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-800 underline">
                                        Open One-Time Secret
                                    </a>
                                    <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 underline">
                                        Open Gmail
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex gap-6">
                            <div className="w-8 h-8 shrink-0 bg-primary/20 text-primary font-bold rounded-full flex items-center justify-center">3</div>
                            <div className="w-full">
                                <h4 className="font-bold text-neutral-900 mb-2">Save to Vercel</h4>
                                <p className="text-sm text-neutral-600 mb-4">
                                    Open the Vercel project settings on your laptop. Add the following two Environment Variables exactly as named:
                                </p>

                                <div className="space-y-4">
                                    <div className="bg-neutral-50 p-4 border border-neutral-200 rounded-lg flex justify-between items-center">
                                        <div>
                                            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Variable Name</p>
                                            <code className="text-sm font-mono font-bold text-neutral-900">STRIPE_SECRET_KEY</code>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Value</p>
                                            <p className="text-sm text-neutral-500 italic">sk_live_...</p>
                                        </div>
                                    </div>
                                    <div className="bg-neutral-50 p-4 border border-neutral-200 rounded-lg flex justify-between items-center">
                                        <div>
                                            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Variable Name</p>
                                            <code className="text-sm font-mono font-bold text-neutral-900">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Value</p>
                                            <p className="text-sm text-neutral-500 italic">pk_live_...</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-black hover:text-neutral-700 underline">
                                        Open Vercel Dashboard &rarr;
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* GOOGLE ANALYTICS SETUP */}
                <section className="bg-white border text-left border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="bg-neutral-50 border-b border-neutral-200 p-6 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-neutral-900">2. Google Analytics (GA4)</h2>
                            <p className="text-sm text-neutral-500 font-mono mt-1">Required for ticketing conversion tracking.</p>
                        </div>
                        <span className="px-3 py-1 bg-neutral-200 text-neutral-700 font-bold text-xs uppercase tracking-widest rounded-full">Required</span>
                    </div>

                    <div className="p-8 space-y-6">
                        <p className="text-sm text-neutral-600">
                            Find the Measurement ID in the GA4 Property Settings (Admin &gt; Data Streams).
                        </p>
                        <div className="bg-neutral-50 p-4 border border-neutral-200 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Variable Name</p>
                                <code className="text-sm font-mono font-bold text-neutral-900">NEXT_PUBLIC_GA_MEASUREMENT_ID</code>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Value</p>
                                <p className="text-sm text-neutral-500 italic">G-XXXXXXXXXX</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* RESEND SETUP */}
                <section className="bg-white border text-left border-neutral-200 rounded-2xl overflow-hidden shadow-sm opacity-75">
                    <div className="bg-neutral-50 border-b border-neutral-200 p-6 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-neutral-900">3. Resend (Email Broadcasts)</h2>
                            <p className="text-sm text-neutral-500 font-mono mt-1">Required for automated receipts and marketing blasts.</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 font-bold text-xs uppercase tracking-widest rounded-full">Already Configured?</span>
                    </div>

                    <div className="p-8 space-y-6">
                        <p className="text-sm text-neutral-600">
                            If you haven't already moved your Resend API key to production, it needs to be added to Vercel as well.
                        </p>
                        <div className="bg-neutral-50 p-4 border border-neutral-200 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Variable Name</p>
                                <code className="text-sm font-mono font-bold text-neutral-900">RESEND_API_KEY</code>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Value</p>
                                <p className="text-sm text-neutral-500 italic">re_...</p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="text-center pt-8 pb-12">
                    <p className="text-sm text-neutral-500 font-mono">
                        Once all keys are pasted into Vercel, hit <strong>Redeploy</strong> to apply the new environment variables to the live site.
                    </p>
                </div>
            </div>
        </div>
    );
}
