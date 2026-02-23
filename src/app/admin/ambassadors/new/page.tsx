'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createAmbassadorAction } from '@/app/actions/ambassadors';
import Link from 'next/link';
import { Button } from '@/components/Button';

export default function NewAmbassadorPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        referralCode: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const generateCode = () => {
        if (!formData.name) return;
        const base = formData.name.toUpperCase().replace(/[^A-Z]/g, '');
        const randomNum = Math.floor(100 + Math.random() * 900);
        setFormData(prev => ({ ...prev, referralCode: `SUNSHINE-${base}${randomNum}` }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        if (formData.referralCode.includes(' ')) {
            setErrorMsg('Referral code cannot contain spaces.');
            setIsLoading(false);
            return;
        }

        const res = await createAmbassadorAction({
            name: formData.name,
            email: formData.email,
            referralCode: formData.referralCode.toUpperCase()
        });

        if (res.success) {
            router.push('/admin/ambassadors');
        } else {
            setErrorMsg(res.error || 'Failed to create ambassador.');
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">New Ambassador</h1>
                    <p className="text-neutral-500 mt-1">Generate a unique referral code to start tracking sales.</p>
                </div>
                <Link href="/admin/ambassadors" className="text-sm font-bold text-neutral-500 hover:text-neutral-800 transition-colors">
                    &larr; Back
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-neutral-200 shadow-sm space-y-6">
                {errorMsg && <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">{errorMsg}</div>}

                <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-1">Full Name</label>
                    <input
                        required
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Alex Sun"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-1">Email Address</label>
                    <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="alex@example.com"
                    />
                    <p className="text-xs text-neutral-500 mt-2">Used for sending updates and rewards.</p>
                </div>

                <div className="pt-4 border-t border-neutral-100">
                    <div className="flex justify-between items-end mb-1">
                        <label className="block text-sm font-bold text-neutral-700">Unique Referral Code</label>
                        <button
                            type="button"
                            onClick={generateCode}
                            className="text-xs text-primary font-bold hover:text-primary/70 cursor-pointer"
                        >
                            Auto-Generate
                        </button>
                    </div>
                    <input
                        required
                        name="referralCode"
                        value={formData.referralCode}
                        onChange={handleChange}
                        className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-mono uppercase tracking-widest text-lg"
                        placeholder="SUNSHINE-ALEX"
                    />
                    <p className="text-xs text-neutral-500 mt-2">This is the code they will share with customers (e.g. yourwebsite.com/tickets?ref=CODE).</p>
                </div>

                <div className="pt-6">
                    <Button type="submit" disabled={isLoading} className="w-full py-4 !rounded-xl text-lg">
                        {isLoading ? 'Creating...' : 'Create Ambassador'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
