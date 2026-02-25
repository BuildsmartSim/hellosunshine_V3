import React from 'react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function StatusBadge({ isConnected, label }: { isConnected: boolean; label?: string }) {
    if (isConnected) {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-widest whitespace-nowrap">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                {label || 'Connected'}
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-700 uppercase tracking-widest whitespace-nowrap">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            {label || 'Missing Key'}
        </span>
    );
}

function CopyBox({ text }: { text: string }) {
    return (
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-3 flex justify-between items-center group mt-2 shadow-inner">
            <code className="text-green-400 font-mono text-sm font-bold tracking-tight select-all">{text}</code>
        </div>
    );
}

export default function SettingsPage() {
    const hasStripeSecret = !!process.env.STRIPE_SECRET_KEY;
    const hasStripeWebhook = !!process.env.STRIPE_WEBHOOK_SECRET;
    const hasResend = !!process.env.RESEND_API_KEY;
    const hasGA4 = !!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20 mt-4">
            <div>
                <Link href="/admin" className="text-[10px] font-bold text-neutral-500 hover:text-neutral-900 mb-6 inline-block tracking-[0.2em] uppercase font-mono transition-colors">
                    &larr; Back to Dashboard
                </Link>
                <h2 className="text-4xl font-black text-neutral-900 tracking-tight mb-3">API Integration Checklist</h2>
                <p className="text-neutral-500 font-mono text-sm leading-relaxed max-w-2xl">
                    Vercel requires secret keys to securely connect to outside services like Stripe (payments) and Resend (emails).
                    Follow these step-by-step workflows to ensure all services are fully connected. <strong>Do not skip any steps.</strong>
                </p>
                <div className="mt-8 flex gap-4">
                    <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-black text-white rounded-xl text-sm font-bold shadow-md hover:bg-neutral-800 transition-all hover:-translate-y-0.5 inline-flex items-center gap-2">
                        Open Vercel Dashboard <span className="text-lg">&rarr;</span>
                    </a>
                </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-2xl shadow-sm">
                <h3 className="text-yellow-900 font-bold mb-2 flex items-center gap-2">
                    <span className="text-xl">⚠️</span> Security Notice
                </h3>
                <p className="text-yellow-800 text-sm leading-relaxed">
                    API keys are the master keys to the business. <strong>Never</strong> email them directly, and <strong>never</strong> paste them into a database. We use Vercel Environment Variables to keep them completely isolated and military-grade secure.
                </p>
            </div>

            <div className="space-y-8">
                {/* Stripe Core Section */}
                <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
                    <div className="px-8 py-6 border-b border-neutral-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-neutral-50/50">
                        <div>
                            <h3 className="text-xl font-bold flex items-center gap-3 text-neutral-800">
                                <span className="text-2xl">💳</span> 1. Stripe Payments
                            </h3>
                            <p className="text-sm text-neutral-500 mt-1 font-mono">Accept live credit card payments on ticket purchases.</p>
                        </div>
                        <StatusBadge isConnected={hasStripeSecret} />
                    </div>
                    {!hasStripeSecret ? (
                        <div className="p-8 bg-white space-y-6">
                            <h4 className="font-bold text-neutral-800 uppercase tracking-widest text-[10px] font-mono">Setup Instructions:</h4>
                            <ol className="list-decimal list-inside space-y-5 text-sm text-neutral-700 font-mono leading-relaxed">
                                <li>Log into your <a href="https://dashboard.stripe.com/apikeys" target="_blank" className="text-indigo-600 hover:text-indigo-800 underline font-bold transition-colors">Stripe Dashboard</a>.</li>
                                <li>Ensure "Test Mode" is toggled <strong>OFF</strong> in the top right.</li>
                                <li>Locate your <strong>Secret key</strong> (it begins with `sk_live_...`).</li>
                                <li>Open your Vercel Dashboard, go to your Project &rarr; Settings &rarr; Environment Variables.</li>
                                <li>Add a new variable named: <CopyBox text="STRIPE_SECRET_KEY" /></li>
                                <li>Paste your Stripe Secret Key as the value and save.</li>
                            </ol>
                        </div>
                    ) : (
                        <div className="p-6 bg-green-50/30 border-t border-green-100/50 text-sm font-mono text-green-800">
                            ✓ The Stripe Secret Key is securely stored in Vercel.
                        </div>
                    )}
                </div>

                {/* Stripe Webhook Section */}
                <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
                    <div className="px-8 py-6 border-b border-neutral-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-neutral-50/50">
                        <div>
                            <h3 className="text-xl font-bold flex items-center gap-3 text-neutral-800">
                                <span className="text-2xl">🔌</span> 2. Stripe Webhooks
                            </h3>
                            <p className="text-sm text-neutral-500 mt-1 font-mono">Tells the website when a payment succeeds to generate the QR code.</p>
                        </div>
                        <StatusBadge isConnected={hasStripeWebhook} label={hasStripeWebhook ? 'Connected' : 'Missing Webhook'} />
                    </div>
                    {!hasStripeWebhook ? (
                        <div className="bg-white">
                            <div className="p-4 bg-red-50 border-b border-red-100 text-sm font-bold text-red-800 px-8 flex items-center gap-3">
                                <span>🚨</span> ACTION REQUIRED: Tickets will be stuck "pending" and QR codes will fail until this is done.
                            </div>
                            <div className="p-8 space-y-6">
                                <h4 className="font-bold text-neutral-800 uppercase tracking-widest text-[10px] font-mono">Setup Instructions (Exactly as written):</h4>
                                <ol className="list-decimal list-outside ml-4 space-y-6 text-sm text-neutral-700 font-mono leading-relaxed">
                                    <li>Log into your <a href="https://dashboard.stripe.com/webhooks" target="_blank" className="text-indigo-600 hover:text-indigo-800 underline font-bold transition-colors">Stripe Webhooks Panel</a>.</li>
                                    <li>Click <strong>Add an endpoint</strong> in the top right.</li>
                                    <li>For the "Endpoint URL" box, precisely copy and paste this link:<CopyBox text="https://hellosunshinesauna.com/api/webhook/stripe" /></li>
                                    <li>Under "Select events to listen to", search for and select <strong>exactly</strong> this event:<CopyBox text="checkout.session.completed" /></li>
                                    <li>Click <strong>Add endpoint</strong> at the bottom of the page.</li>
                                    <li>On the next page, click <strong>Reveal</strong> under the "Signing secret" section. Copy this password (it starts with `whsec_...`).</li>
                                    <li>Go to your Vercel Settings &rarr; Environment Variables and add:<CopyBox text="STRIPE_WEBHOOK_SECRET" /></li>
                                    <li>Paste the `whsec` key you copied as the value and save.</li>
                                    <li className="font-bold text-neutral-900 p-4 bg-yellow-50 border border-yellow-200 rounded-xl mt-4">FINAL CRITICAL STEP: Once the key is saved in Vercel, you MUST go to your Vercel Deployments tab and click "Redeploy" on your latest main branch, otherwise the site won't know the key is there!</li>
                                </ol>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 bg-green-50/30 border-t border-green-100/50 text-sm font-mono text-green-800">
                            ✓ The Stripe Webhook Secret is securely stored in Vercel.
                        </div>
                    )}
                </div>

                {/* Resend Automated Emails Section */}
                <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
                    <div className="px-8 py-6 border-b border-neutral-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-neutral-50/50">
                        <div>
                            <h3 className="text-xl font-bold flex items-center gap-3 text-neutral-800">
                                <span className="text-2xl">✉️</span> 3. Resend Emails
                            </h3>
                            <p className="text-sm text-neutral-500 mt-1 font-mono">Automatically send PDF tickets and receipts to guests.</p>
                        </div>
                        <StatusBadge isConnected={hasResend} />
                    </div>
                    {!hasResend ? (
                        <div className="p-8 bg-white space-y-6">
                            <h4 className="font-bold text-neutral-800 uppercase tracking-widest text-[10px] font-mono">Setup Instructions:</h4>
                            <ol className="list-decimal list-inside space-y-5 text-sm text-neutral-700 font-mono leading-relaxed">
                                <li>Log into <a href="https://resend.com/api-keys" target="_blank" className="text-indigo-600 hover:text-indigo-800 underline font-bold transition-colors">Resend Dashboard</a>.</li>
                                <li>Generate a new API Key with "Full Access".</li>
                                <li>Open your Vercel Environment Variables.</li>
                                <li>Add a new variable named:<CopyBox text="RESEND_API_KEY" /></li>
                                <li>Paste the generated key (it starts with `re_...`) and save.</li>
                            </ol>
                        </div>
                    ) : (
                        <div className="p-6 bg-green-50/30 border-t border-green-100/50 text-sm font-mono text-green-800">
                            ✓ The Resend Mail API Key is securely stored in Vercel.
                        </div>
                    )}
                </div>

                {/* Google Analytics Section */}
                <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
                    <div className="px-8 py-6 border-b border-neutral-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-neutral-50/50">
                        <div>
                            <h3 className="text-xl font-bold flex items-center gap-3 text-neutral-800">
                                <span className="text-2xl">📈</span> 4. Google Analytics (GA4)
                            </h3>
                            <p className="text-sm text-neutral-500 mt-1 font-mono">Track conversions, purchases, and traffic flows automatically.</p>
                        </div>
                        <StatusBadge isConnected={hasGA4} />
                    </div>
                    {!hasGA4 ? (
                        <div className="p-8 bg-white space-y-6">
                            <h4 className="font-bold text-neutral-800 uppercase tracking-widest text-[10px] font-mono">Setup Instructions:</h4>
                            <ol className="list-decimal list-inside space-y-5 text-sm text-neutral-700 font-mono leading-relaxed">
                                <li>Log into Google Analytics and find your Web Data Stream details.</li>
                                <li>Copy your Measurement ID (it begins with `G-XX...`).</li>
                                <li>Open your Vercel Environment Variables.</li>
                                <li>Add a new variable named:<CopyBox text="NEXT_PUBLIC_GA_MEASUREMENT_ID" /></li>
                                <li>Paste the Measurement ID and save.</li>
                            </ol>
                        </div>
                    ) : (
                        <div className="p-6 bg-green-50/30 border-t border-green-100/50 text-sm font-mono text-green-800">
                            ✓ Google Analytics Tracking ID is configured.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
