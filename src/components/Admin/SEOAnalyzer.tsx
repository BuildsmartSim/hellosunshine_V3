'use client';

import React, { useMemo } from 'react';

type SEOAnalyzerProps = {
    title: string;
    description: string;
    focusKeyword?: string;
};

export const SEOAnalyzer: React.FC<SEOAnalyzerProps> = ({ title, description, focusKeyword }) => {

    const analyze = useMemo(() => {
        let score = 0;
        const checks = [];

        // 1. Title Length Check
        const titleLength = title.length;
        if (titleLength === 0) {
            checks.push({ status: 'error', text: 'SEO Title is missing.' });
        } else if (titleLength < 30) {
            score += 10;
            checks.push({ status: 'warning', text: `SEO Title is a bit short (${titleLength}/60 chars).` });
        } else if (titleLength > 60) {
            score += 10;
            checks.push({ status: 'warning', text: `SEO Title is too long (${titleLength}/60 chars). It may be truncated on Google.` });
        } else {
            score += 20;
            checks.push({ status: 'success', text: `SEO Title length is perfect (${titleLength}/60 chars).` });
        }

        // 2. Description Length Check
        const descLength = description.length;
        if (descLength === 0) {
            checks.push({ status: 'error', text: 'SEO Description is missing.' });
        } else if (descLength < 120) {
            score += 10;
            checks.push({ status: 'warning', text: `SEO Description is too short (${descLength}/160 chars). Add more detail.` });
        } else if (descLength > 160) {
            score += 10;
            checks.push({ status: 'warning', text: `SEO Description is too long (${descLength}/160 chars). It will be truncated.` });
        } else {
            score += 20;
            checks.push({ status: 'success', text: `SEO Description length is perfect (${descLength}/160 chars).` });
        }

        // 3. Focus Keyword check
        if (focusKeyword) {
            const keywordLower = focusKeyword.toLowerCase();

            // In Title
            if (title.toLowerCase().includes(keywordLower)) {
                score += 30;
                checks.push({ status: 'success', text: `Focus keyword "${focusKeyword}" found in SEO Title.` });
            } else {
                checks.push({ status: 'error', text: `Focus keyword not found in SEO Title.` });
            }

            // In Description
            if (description.toLowerCase().includes(keywordLower)) {
                score += 30;
                checks.push({ status: 'success', text: `Focus keyword "${focusKeyword}" found in SEO Description.` });
            } else {
                checks.push({ status: 'error', text: `Focus keyword not found in SEO Description.` });
            }
        } else {
            // Give free points if they aren't using the keyword feature yet
            score += 60;
            checks.push({ status: 'neutral', text: 'Set a Focus Keyword to enable more precise analysis.' });
        }

        return { score, checks };
    }, [title, description, focusKeyword]);

    // Color logic based on score
    let scoreColor = 'text-red-500 bg-red-50 border-red-200';
    if (analyze.score >= 50 && analyze.score < 80) scoreColor = 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (analyze.score >= 80) scoreColor = 'text-green-600 bg-green-50 border-green-200';

    return (
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm mt-4">
            <div className="flex items-center justify-between mb-4 border-b border-neutral-100 pb-4">
                <div className="flex items-center gap-3">
                    <span className="text-xl">🔍</span>
                    <div>
                        <h3 className="font-bold text-neutral-800">SEO Analysis</h3>
                        <p className="text-xs text-neutral-500 font-mono">Real-time Rank Math emulation</p>
                    </div>
                </div>

                {/* Score Circle */}
                <div className={`w-14 h-14 rounded-full border-4 flex items-center justify-center font-bold text-lg ${scoreColor}`}>
                    {analyze.score}
                </div>
            </div>

            <ul className="space-y-3">
                {analyze.checks.map((check, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                        {check.status === 'success' && <span className="text-green-500 mt-0.5">✓</span>}
                        {check.status === 'error' && <span className="text-red-500 mt-0.5">✕</span>}
                        {check.status === 'warning' && <span className="text-yellow-500 mt-0.5">!</span>}
                        {check.status === 'neutral' && <span className="text-neutral-400 mt-0.5">ℹ</span>}
                        <span className={
                            check.status === 'success' ? 'text-green-800' :
                                check.status === 'error' ? 'text-red-800' :
                                    check.status === 'warning' ? 'text-yellow-800' : 'text-neutral-600'
                        }>{check.text}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
