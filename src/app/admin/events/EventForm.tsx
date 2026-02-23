'use client';

import React, { useState } from 'react';
import { saveEventAction } from '@/app/actions/event_management';
import { useRouter } from 'next/navigation';

const AVAILABLE_SERVICES = ['sauna', 'plunge', 'shower', 'tub', 'fire', 'heart', 'towels'];

export default function EventForm({ initialData }: { initialData?: any }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const [formData, setFormData] = useState({
        id: initialData?.id || '',
        title: initialData?.title || '',
        location: initialData?.location || '',
        dates: initialData?.dates || '',
        description: initialData?.description || '',
        logo_src: initialData?.logo_src || '',
        featured_price: initialData?.featured_price || '',
        facilities: initialData?.facilities?.join(', ') || '',
        opening_times: initialData?.opening_times?.join(', ') || '',
        external_url: initialData?.external_url || '',
        services: initialData?.services || [],
        tiers: initialData?.tiers || [],
        is_active: initialData?.is_active ?? true,
        is_featured: initialData?.is_featured ?? false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleServiceToggle = (service: string) => {
        setFormData(prev => {
            const newServices = prev.services.includes(service)
                ? prev.services.filter((s: string) => s !== service)
                : [...prev.services, service];
            return { ...prev, services: newServices };
        });
    };

    const addTier = () => {
        setFormData(prev => ({
            ...prev,
            tiers: [...prev.tiers, { id: `tier-${Date.now()}`, name: '', price: '', description: '', stock_limit: '' }]
        }));
    };

    const updateTier = (index: number, field: string, value: string) => {
        setFormData(prev => {
            const newTiers = [...prev.tiers];
            newTiers[index] = { ...newTiers[index], [field]: value };
            return { ...prev, tiers: newTiers };
        });
    };

    const removeTier = (index: number) => {
        setFormData(prev => ({
            ...prev,
            tiers: prev.tiers.filter((_: any, i: number) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        // Transform arrays back
        const payload = {
            ...formData,
            facilities: formData.facilities.split(',').map((s: string) => s.trim()).filter(Boolean),
            opening_times: formData.opening_times.split(',').map((s: string) => s.trim()).filter(Boolean),
        };

        const res = await saveEventAction(payload);
        if (res.success) {
            router.push('/admin');
        } else {
            setErrorMsg(res.error || 'Failed to save event');
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl border border-neutral-200">
            {errorMsg && <div className="p-4 bg-red-50 text-red-600 rounded-lg">{errorMsg}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-1">Title</label>
                    <input required name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border border-neutral-300 rounded focus:ring-2 focus:ring-neutral-800" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-1">Location</label>
                    <input required name="location" value={formData.location} onChange={handleChange} className="w-full p-2 border border-neutral-300 rounded focus:ring-2 focus:ring-neutral-800" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-1">Dates</label>
                    <input required name="dates" value={formData.dates} onChange={handleChange} className="w-full p-2 border border-neutral-300 rounded focus:ring-2 focus:ring-neutral-800" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-1">Featured Price (e.g. £20)</label>
                    <input name="featured_price" value={formData.featured_price} onChange={handleChange} className="w-full p-2 border border-neutral-300 rounded focus:ring-2 focus:ring-neutral-800" />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-neutral-700 mb-1">Description</label>
                    <textarea required name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border border-neutral-300 rounded focus:ring-2 focus:ring-neutral-800" rows={3}></textarea>
                </div>
                <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-1">Logo URL (Optional)</label>
                    <input name="logo_src" value={formData.logo_src} onChange={handleChange} className="w-full p-2 border border-neutral-300 rounded focus:ring-2 focus:ring-neutral-800" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-1">External Ticket URL (Optional)</label>
                    <input name="external_url" value={formData.external_url} onChange={handleChange} className="w-full p-2 border border-neutral-300 rounded focus:ring-2 focus:ring-neutral-800" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-1">Facilities (Comma Separated)</label>
                    <input name="facilities" value={formData.facilities} onChange={handleChange} placeholder="Changing Rooms, Lockers..." className="w-full p-2 border border-neutral-300 rounded focus:ring-2 focus:ring-neutral-800" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-1">Opening Times (Comma Separated)</label>
                    <input name="opening_times" value={formData.opening_times} onChange={handleChange} placeholder="Fri: 4pm-10pm, Sat: 9am-10pm" className="w-full p-2 border border-neutral-300 rounded focus:ring-2 focus:ring-neutral-800" />
                </div>
            </div>

            <div className="border-t border-neutral-200 pt-6">
                <label className="block text-sm font-bold text-neutral-700 mb-3">Available Services</label>
                <div className="flex flex-wrap gap-3">
                    {AVAILABLE_SERVICES.map(svc => (
                        <label key={svc} className="flex items-center space-x-2 cursor-pointer bg-neutral-50 px-3 py-2 rounded-lg border border-neutral-200 hover:border-neutral-400">
                            <input
                                type="checkbox"
                                checked={formData.services.includes(svc)}
                                onChange={() => handleServiceToggle(svc)}
                                className="w-4 h-4 text-neutral-800 rounded border-neutral-300 focus:ring-neutral-800"
                            />
                            <span className="text-sm font-medium capitalize">{svc}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="border-t border-neutral-200 pt-6">
                <div className="flex justify-between items-center mb-4">
                    <label className="block text-lg font-bold text-neutral-800">Ticket Tiers</label>
                    <button type="button" onClick={addTier} className="px-4 py-2 bg-neutral-800 text-white text-sm font-bold rounded hover:bg-neutral-700 transition-colors">
                        + Add Tier
                    </button>
                </div>

                {formData.tiers.length === 0 ? (
                    <p className="text-sm text-neutral-500 italic">No tickets tiers added. Click "Add Tier" to create some.</p>
                ) : (
                    <div className="space-y-4">
                        {formData.tiers.map((tier: any, idx: number) => (
                            <div key={idx} className="p-4 border border-neutral-200 rounded bg-neutral-50 relative">
                                <button type="button" onClick={() => removeTier(idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-sm font-bold">Remove</button>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mr-16">
                                    <div className="md:col-span-3 flex space-x-4 items-center">
                                        <span className="text-xs font-mono text-neutral-400">ID: {tier.id}</span>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-700 mb-1">Tier Name (e.g. VIP Pass)</label>
                                        <input required value={tier.name} onChange={(e) => updateTier(idx, 'name', e.target.value)} className="w-full text-sm p-2 border border-neutral-300 rounded" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-700 mb-1">Price (e.g. £45)</label>
                                        <input required value={tier.price} onChange={(e) => updateTier(idx, 'price', e.target.value)} className="w-full text-sm p-2 border border-neutral-300 rounded" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-700 mb-1">Stock Limit (Leave empty for unlimited)</label>
                                        <input type="number" value={tier.stock_limit || ''} onChange={(e) => updateTier(idx, 'stock_limit', e.target.value)} className="w-full text-sm p-2 border border-neutral-300 rounded" />
                                    </div>
                                    <div className="md:col-span-3">
                                        <label className="block text-xs font-bold text-neutral-700 mb-1">Short Description</label>
                                        <input required value={tier.description} onChange={(e) => updateTier(idx, 'description', e.target.value)} className="w-full text-sm p-2 border border-neutral-300 rounded" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="pt-6 flex justify-end space-x-4">
                <button type="button" onClick={() => router.push('/admin')} className="px-6 py-3 font-bold text-neutral-600 hover:text-neutral-900">
                    Cancel
                </button>
                <button type="submit" disabled={isLoading} className="px-6 py-3 bg-neutral-900 text-white font-bold rounded shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50">
                    {isLoading ? 'Saving...' : 'Save Event'}
                </button>
            </div>
        </form>
    );
}
