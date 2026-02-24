'use client';

import React, { useState, useEffect } from 'react';
import { fetchBroadcastAudiencesAction, sendBroadcastEmailAction } from '@/app/actions/broadcasts';
import { Button } from '@/components/Button';

export default function BroadcastStudio() {
    const [audiences, setAudiences] = useState<any[]>([]);
    const [selectedAudience, setSelectedAudience] = useState<string>('all');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [resultMsg, setResultMsg] = useState('');

    useEffect(() => {
        const loadAudiences = async () => {
            const res = await fetchBroadcastAudiencesAction();
            if (res.success && res.audiences) {
                setAudiences(res.audiences);
            }
        };
        loadAudiences();
    }, []);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!confirm('Are you sure you want to send this broadcast email to the selected audience? This action cannot be undone.')) {
            return;
        }

        setStatus('loading');
        setResultMsg('');

        try {
            // Note: In a production environment with many recipients, Resend recommends batching 
            // the API calls if passing 50+ bcc emails. For now, we are utilizing the quick blind-copy approach.
            const res = await sendBroadcastEmailAction(selectedAudience, subject, message);

            if (res.success) {
                setStatus('success');
                setResultMsg(`Successfully dispatched email to ${res.recipientCount} recipients.`);
                setSubject('');
                setMessage('');
            } else {
                setStatus('error');
                setResultMsg(res.error || 'Failed to send broadcast.');
            }
        } catch (err: any) {
            setStatus('error');
            setResultMsg('An unexpected error occurred.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-neutral-800">Email Studio</h2>
                <p className="text-sm text-neutral-500 font-mono mt-1">
                    Compose and dispatch broadcast emails securely to specific guest groups.
                </p>
            </div>

            <form onSubmit={handleSend} className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-8 space-y-6">
                    {/* Audience Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider font-mono">Target Audience</label>
                        <select
                            value={selectedAudience}
                            onChange={(e) => setSelectedAudience(e.target.value)}
                            className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-neutral-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-400 bg-neutral-50"
                        >
                            <option value="all">All Registered Profiles & Guests</option>
                            <optgroup label="Specific Event Audiences">
                                {audiences.map((a: any) => (
                                    <option key={a.id} value={a.id}>Ticket Holders: {a.title}</option>
                                ))}
                            </optgroup>
                        </select>
                        <p className="text-xs text-neutral-400 mt-1">Guests will be blind-copied (BCC) to protect their privacy.</p>
                    </div>

                    {/* Subject Line */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider font-mono">Subject Line *</label>
                        <input
                            type="text"
                            required
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="e.g. Important Update for the Summer Solstice Event"
                            className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-neutral-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-400 placeholder:font-normal placeholder:text-neutral-300"
                        />
                    </div>

                    {/* Email Message */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider font-mono">Message (Plain Text) *</label>
                        <textarea
                            required
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message here..."
                            rows={10}
                            className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 resize-y placeholder:text-neutral-300 font-body leading-relaxed"
                        ></textarea>
                    </div>

                    {/* Status Feedback */}
                    {status === 'error' && (
                        <div className="bg-red-50 text-red-700 px-4 py-3 rounded text-sm font-bold border border-red-200">
                            {resultMsg}
                        </div>
                    )}
                    {status === 'success' && (
                        <div className="bg-green-50 text-green-700 px-4 py-3 rounded text-sm font-bold border border-green-200">
                            ✓ {resultMsg}
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="bg-neutral-50/80 border-t border-neutral-100 p-6 flex items-center justify-between">
                    <p className="text-xs text-neutral-400 font-mono">
                        Sent securely via Resend Delivery network.
                    </p>
                    <Button
                        type="submit"
                        disabled={status === 'loading'}
                        className="px-8 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg shadow-sm font-bold tracking-widest text-xs uppercase disabled:opacity-50"
                    >
                        {status === 'loading' ? 'Dispatching...' : 'Send Broadcast'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
