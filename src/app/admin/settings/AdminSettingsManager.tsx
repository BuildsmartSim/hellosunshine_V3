'use client';

import React, { useState } from 'react';

interface AdminSettings {
    chief_email: string;
    telegram_bot_token: string;
    telegram_chat_id: string;
}

import { updateSettingsAction, sendTestNotificationAction } from '@/app/actions/tickets';

export function AdminSettingsManager({ initialSettings }: { initialSettings: AdminSettings }) {
    const [settings, setSettings] = useState(initialSettings);
    const [isSaving, setIsSaving] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleTestNotifications = async () => {
        setIsTesting(true);
        setMessage({ text: '', type: '' });
        try {
            const res = await sendTestNotificationAction();
            if (res.success) {
                setMessage({ text: res.message || 'Test sent!', type: 'success' });
            } else {
                setMessage({ text: res.error || 'Test failed', type: 'error' });
            }
        } catch (err: any) {
            setMessage({ text: 'Test failed: ' + err.message, type: 'error' });
        } finally {
            setIsTesting(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ text: '', type: '' });

        try {
            const res = await updateSettingsAction(settings);

            if (!res.success) throw new Error(res.error);

            setMessage({ text: 'Settings saved successfully!', type: 'success' });
        } catch (err: any) {
            setMessage({ text: err.message || 'Failed to save settings', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <form onSubmit={handleSave} className="space-y-8">
                {/* Email Section */}
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-neutral-100 bg-neutral-900">
                        <h3 className="text-sm font-black text-white tracking-[0.2em] uppercase font-mono">Chief Contact Email</h3>
                    </div>
                    <div className="p-8">
                        <p className="text-xs text-neutral-500 font-mono mb-6 uppercase tracking-widest leading-relaxed italic">
                            this address will receive all critical alerts, including refunds and daily summaries.
                        </p>
                        <div>
                            <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono mb-2">Primary Email</label>
                            <input
                                type="email"
                                value={settings.chief_email || ''}
                                onChange={(e) => setSettings({ ...settings, chief_email: e.target.value })}
                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 outline-none font-mono text-sm transition-all"
                                placeholder="chief@hellosunshinesauna.com"
                            />
                        </div>
                    </div>
                </div>

                {/* Telegram Section */}
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-neutral-100 bg-neutral-900 flex justify-between items-center">
                        <h3 className="text-sm font-black text-white tracking-[0.2em] uppercase font-mono">Telegram Integration</h3>
                        <span className="text-[10px] font-black bg-blue-500 text-white px-2 py-1 rounded font-mono uppercase tracking-widest">Recommended</span>
                    </div>
                    <div className="p-8 space-y-6">
                        <p className="text-xs text-neutral-500 font-mono mb-2 uppercase tracking-widest leading-relaxed italic">
                            connect a telegram bot for instant mobile alerts.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono mb-2">Bot Token</label>
                                <input
                                    type="password"
                                    value={settings.telegram_bot_token || ''}
                                    onChange={(e) => setSettings({ ...settings, telegram_bot_token: e.target.value })}
                                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 outline-none font-mono text-sm transition-all"
                                    placeholder="••••••••••••••••••••"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono mb-2">Chat ID</label>
                                <input
                                    type="text"
                                    value={settings.telegram_chat_id || ''}
                                    onChange={(e) => setSettings({ ...settings, telegram_chat_id: e.target.value })}
                                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 outline-none font-mono text-sm transition-all"
                                    placeholder="12345678"
                                />
                            </div>
                        </div>

                        <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-100">
                            <h4 className="text-[10px] font-black text-neutral-800 uppercase tracking-widest font-mono mb-2">How to get these?</h4>
                            <ol className="text-[10px] text-neutral-500 font-mono space-y-1 list-decimal list-inside lowercase tracking-wide">
                                <li>message @botfather on telegram to create a bot and get a <b>token</b>.</li>
                                <li>message @userinfobot to get your <b>chat id</b>.</li>
                                <li>enter them above and save.</li>
                            </ol>
                        </div>
                    </div>
                </div>

                {message.text && (
                    <div className={`p-4 rounded-xl font-mono text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={handleTestNotifications}
                        disabled={isSaving || isTesting}
                        className="py-5 border-2 border-neutral-900 text-neutral-900 font-black rounded-2xl hover:bg-neutral-50 active:scale-95 transition-all text-sm uppercase tracking-[0.2em] font-mono disabled:opacity-50"
                    >
                        {isTesting ? 'Testing Alerts...' : 'TEST NOTIFICATIONS'}
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving || isTesting}
                        className="py-5 bg-neutral-900 text-white font-black rounded-2xl shadow-2xl hover:bg-neutral-800 active:scale-95 transition-all text-sm uppercase tracking-[0.3em] font-mono disabled:opacity-50"
                    >
                        {isSaving ? 'Saving Preferences...' : 'SAVE CONFIGURATION'}
                    </button>
                </div>
            </form>
        </div>
    );
}
