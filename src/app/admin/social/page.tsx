'use client';

import { useState, useTransition, useRef, useCallback } from 'react';
import { LivePreview } from '@/components/social/LivePreview';
import type { TemplateStyle } from '@/components/social/SunshineTemplate';

type Platform = 'facebook' | 'instagram';

interface PublishResult {
    success: boolean;
    imageUrl?: string;
    results?: Record<string, unknown>;
    errors?: Record<string, string>;
    error?: string;
}

const TEMPLATE_OPTIONS: { id: TemplateStyle; label: string; description: string }[] = [
    { id: 'festival', label: '🌅 Festival', description: 'Warm amber gradient — great for events' },
    { id: 'announcement', label: '📢 Announcement', description: 'Deep charcoal + gold — news & updates' },
];

const PLATFORM_OPTIONS: { id: Platform; label: string }[] = [
    { id: 'facebook', label: 'Facebook' },
    { id: 'instagram', label: 'Instagram' },
];

export default function SocialPublisherPage() {
    const [style, setStyle] = useState<TemplateStyle>('festival');
    const [headline, setHeadline] = useState('');
    const [body, setBody] = useState('');
    const [caption, setCaption] = useState('');
    const [targets, setTargets] = useState<Platform[]>(['instagram', 'facebook']);
    const [bgDataUrl, setBgDataUrl] = useState<string | undefined>();
    const [isDragging, setIsDragging] = useState(false);
    const [result, setResult] = useState<PublishResult | null>(null);
    const [isPending, startTransition] = useTransition();

    const fileInputRef = useRef<HTMLInputElement>(null);

    /* ── Photo handlers ─────────────────────────────────────────────── */

    const handleFile = useCallback((file: File) => {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => setBgDataUrl(e.target?.result as string);
        reader.readAsDataURL(file);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    /* ── Publish handler ────────────────────────────────────────────── */

    const togglePlatform = (p: Platform) =>
        setTargets((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);

    const handlePublish = () => {
        if (!headline.trim()) return;
        startTransition(async () => {
            setResult(null);
            const res = await fetch('/api/social/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    style, headline, body,
                    caption: caption || headline,
                    bgImageUrl: bgDataUrl,
                    targets,
                }),
            });
            setResult(await res.json());
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-neutral-800">Social Publisher</h2>
                <p className="text-sm text-neutral-500 font-mono mt-1">
                    Design a post and publish to Facebook &amp; Instagram
                </p>
            </div>

            {/* Credential reminder */}
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <span className="text-amber-500 text-lg mt-0.5">⚠</span>
                <div>
                    <p className="text-sm font-bold text-amber-800">Meta credentials not yet connected</p>
                    <p className="text-xs text-amber-700 mt-0.5 font-mono">
                        Publishing is in stub mode. Add{' '}
                        <code className="bg-amber-100 px-1 rounded">META_ACCESS_TOKEN</code>,{' '}
                        <code className="bg-amber-100 px-1 rounded">META_FB_PAGE_ID</code>,{' '}
                        <code className="bg-amber-100 px-1 rounded">META_IG_USER_ID</code> to{' '}
                        <code className="bg-amber-100 px-1 rounded">.env.local</code> to go live.
                    </p>
                </div>
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">

                {/* ── LEFT: Composer ──────────────────────────────────────────── */}
                <div className="space-y-5">

                    {/* 1. Template Style */}
                    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 space-y-4">
                        <h3 className="text-xs font-bold text-neutral-600 uppercase tracking-widest font-mono">
                            1 · Template Style
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {TEMPLATE_OPTIONS.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setStyle(t.id)}
                                    className={`text-left p-4 rounded-lg border-2 transition-all ${style === t.id
                                            ? 'border-neutral-900 bg-neutral-900 text-white shadow-md'
                                            : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-400'
                                        }`}
                                >
                                    <p className="font-bold text-sm">{t.label}</p>
                                    <p className={`text-xs mt-1 font-mono leading-snug ${style === t.id ? 'text-neutral-300' : 'text-neutral-400'}`}>
                                        {t.description}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 2. Background Photo */}
                    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 space-y-4">
                        <h3 className="text-xs font-bold text-neutral-600 uppercase tracking-widest font-mono">
                            2 · Background Photo
                            <span className="ml-2 normal-case font-normal text-neutral-400">(optional)</span>
                        </h3>

                        {/* Drop zone */}
                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed cursor-pointer transition-all min-h-[140px] ${isDragging
                                    ? 'border-neutral-900 bg-neutral-100'
                                    : bgDataUrl
                                        ? 'border-neutral-300 bg-neutral-50'
                                        : 'border-neutral-200 bg-neutral-50 hover:border-neutral-400 hover:bg-white'
                                }`}
                        >
                            {bgDataUrl ? (
                                /* Thumbnail preview */
                                <div className="flex items-center gap-4 w-full px-4">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={bgDataUrl}
                                        alt="Background preview"
                                        className="w-16 h-16 object-cover rounded-lg shadow-sm flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-neutral-700">Photo selected</p>
                                        <p className="text-xs text-neutral-400 font-mono mt-0.5">Click to change</p>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setBgDataUrl(undefined); }}
                                        className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-200 hover:bg-red-100 hover:text-red-600 text-neutral-500 flex items-center justify-center text-xs transition-colors font-bold"
                                        title="Remove photo"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <span className="text-3xl">🖼</span>
                                    <p className="text-sm font-bold text-neutral-600">
                                        {isDragging ? 'Drop it!' : 'Drop a photo or click to browse'}
                                    </p>
                                    <p className="text-xs font-mono text-neutral-400">
                                        JPG, PNG, WEBP · From your device or gallery
                                    </p>
                                </>
                            )}
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleFileChange}
                        />

                        <p className="text-xs text-neutral-400 font-mono">
                            💡 Tip: use a square photo for the best results. Landscape/portrait photos will be cropped to centre.
                        </p>
                    </div>

                    {/* 3. Content */}
                    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 space-y-4">
                        <h3 className="text-xs font-bold text-neutral-600 uppercase tracking-widest font-mono">3 · Content</h3>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider font-mono">Headline *</label>
                            <input
                                type="text"
                                value={headline}
                                onChange={(e) => setHeadline(e.target.value)}
                                placeholder="e.g. Summer Sauna Festival"
                                maxLength={60}
                                className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-neutral-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-400 placeholder:font-normal placeholder:text-neutral-300"
                            />
                            <p className="text-xs text-neutral-400 font-mono text-right">{headline.length}/60</p>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider font-mono">Sub-copy</label>
                            <textarea
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                placeholder="Short description shown on the visual"
                                maxLength={120}
                                rows={2}
                                className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 resize-none placeholder:text-neutral-300"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider font-mono">
                                Post Caption
                                <span className="ml-1 normal-case font-normal text-neutral-400">(text below the image on social)</span>
                            </label>
                            <textarea
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                placeholder="Caption that goes on Facebook & Instagram…"
                                maxLength={2200}
                                rows={4}
                                className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 resize-none placeholder:text-neutral-300"
                            />
                            <p className="text-xs text-neutral-400 font-mono text-right">{caption.length}/2200</p>
                        </div>
                    </div>

                    {/* 4. Platforms */}
                    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 space-y-4">
                        <h3 className="text-xs font-bold text-neutral-600 uppercase tracking-widest font-mono">4 · Publish To</h3>
                        <div className="flex gap-3">
                            {PLATFORM_OPTIONS.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => togglePlatform(p.id)}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 transition-all text-sm font-bold ${targets.includes(p.id)
                                            ? 'border-neutral-900 bg-neutral-900 text-white'
                                            : 'border-neutral-200 text-neutral-500 hover:border-neutral-400'
                                        }`}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Publish */}
                    <button
                        onClick={handlePublish}
                        disabled={isPending || !headline.trim() || !targets.length}
                        className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-sm ${isPending || !headline.trim() || !targets.length
                                ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                                : 'bg-neutral-900 text-white hover:bg-neutral-800 hover:shadow-md active:scale-[0.99]'
                            }`}
                    >
                        {isPending ? '⏳ Generating & publishing…' : '🚀 Publish Post'}
                    </button>

                    {/* Result */}
                    {result && (
                        <div className={`rounded-xl border p-4 text-sm font-mono space-y-2 ${result.success ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
                            }`}>
                            {result.success ? (
                                <>
                                    <p className="font-bold">✓ Published successfully</p>
                                    {result.imageUrl && (
                                        <p>
                                            Image:{' '}
                                            <a href={result.imageUrl} target="_blank" rel="noreferrer" className="underline">
                                                View in Supabase Storage
                                            </a>
                                        </p>
                                    )}
                                    {result.results && (
                                        <pre className="text-xs bg-white/60 rounded p-2 overflow-auto max-h-32">
                                            {JSON.stringify(result.results, null, 2)}
                                        </pre>
                                    )}
                                    {result.errors && Object.keys(result.errors).length > 0 && (
                                        <p className="text-amber-700 font-bold">
                                            ⚠ Some platforms failed:{' '}
                                            {Object.entries(result.errors).map(([k, v]) => `${k}: ${v}`).join(', ')}
                                        </p>
                                    )}
                                </>
                            ) : (
                                <p className="font-bold">✗ {result.error}</p>
                            )}
                        </div>
                    )}
                </div>

                {/* ── RIGHT: Live Preview ─────────────────────────────────────── */}
                <div className="sticky top-24">
                    <LivePreview style={style} headline={headline} body={body} bgImageUrl={bgDataUrl} />
                </div>
            </div>
        </div>
    );
}
