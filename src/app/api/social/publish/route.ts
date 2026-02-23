/**
 * POST /api/social/publish
 *
 * Generates the visual template image, then publishes to Facebook and/or Instagram.
 *
 *  ┌─ NOTE: Meta credentials are stubbed until credentials are available ─┐
 *  │  Set these env vars in .env.local to enable live posting:            │
 *  │  META_ACCESS_TOKEN     — Long-lived Page Access Token                │
 *  │  META_FB_PAGE_ID       — Facebook Page ID                            │
 *  │  META_IG_USER_ID       — Instagram Business Account ID               │
 *  └───────────────────────────────────────────────────────────────────────┘
 *
 * Body: {
 *   style: "festival" | "announcement",
 *   headline: string,
 *   body: string,
 *   bgImageUrl?: string,
 *   caption: string,          // The text caption for the social post
 *   targets: ("facebook" | "instagram")[],
 * }
 */

import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

const META_API_BASE = 'https://graph.facebook.com/v19.0';

/* ── Helpers ────────────────────────────────────────────────────────────────── */

async function generateImage(postData: object, baseUrl: string): Promise<string> {
    const res = await fetch(`${baseUrl}/api/social/generate-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Image generation failed');
    return json.url as string;
}

async function postToFacebook(imageUrl: string, caption: string): Promise<object> {
    const pageId = process.env.META_FB_PAGE_ID;
    const token = process.env.META_ACCESS_TOKEN;

    if (!pageId || !token) {
        // ── STUB: credentials not yet configured ──────────────────────────────
        console.log('[social/publish] Facebook stub — would post:', { imageUrl, caption });
        return { stubbed: true, platform: 'facebook', imageUrl, message: caption };
    }

    const res = await fetch(
        `${META_API_BASE}/${pageId}/photos?url=${encodeURIComponent(imageUrl)}&message=${encodeURIComponent(caption)}&access_token=${token}`,
        { method: 'POST' }
    );
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Facebook post failed');
    return json;
}

async function postToInstagram(imageUrl: string, caption: string): Promise<object> {
    const igUserId = process.env.META_IG_USER_ID;
    const token = process.env.META_ACCESS_TOKEN;

    if (!igUserId || !token) {
        // ── STUB: credentials not yet configured ──────────────────────────────
        console.log('[social/publish] Instagram stub — would post:', { imageUrl, caption });
        return { stubbed: true, platform: 'instagram', imageUrl, message: caption };
    }

    // Step A: Create media container
    const containerRes = await fetch(
        `${META_API_BASE}/${igUserId}/media?image_url=${encodeURIComponent(imageUrl)}&caption=${encodeURIComponent(caption)}&access_token=${token}`,
        { method: 'POST' }
    );
    const container = await containerRes.json();
    if (!containerRes.ok) throw new Error(container.error?.message || 'IG container creation failed');

    // Step B: Publish the container
    const publishRes = await fetch(
        `${META_API_BASE}/${igUserId}/media_publish?creation_id=${container.id}&access_token=${token}`,
        { method: 'POST' }
    );
    const published = await publishRes.json();
    if (!publishRes.ok) throw new Error(published.error?.message || 'IG publish failed');
    return published;
}

/* ── Route handler ──────────────────────────────────────────────────────────── */

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { style, headline, body: templateBody, bgImageUrl, caption, targets = [] } = body as {
            style: string;
            headline: string;
            body: string;
            bgImageUrl?: string;
            caption: string;
            targets: string[];
        };

        if (!targets.length) {
            return NextResponse.json({ error: 'No platforms selected' }, { status: 400 });
        }

        // Determine base URL for internal API calls
        const host =
            process.env.NEXT_PUBLIC_SITE_URL ||
            (req.headers.get('host') ? `http://${req.headers.get('host')}` : 'http://localhost:3000');

        /* 1. Generate image */
        const imageUrl = await generateImage({ style, headline, body: templateBody, bgImageUrl }, host);

        /* 2. Post to selected platforms in parallel */
        const results: Record<string, unknown> = {};
        const errors: Record<string, string> = {};

        await Promise.allSettled(
            targets.map(async (platform: string) => {
                try {
                    if (platform === 'facebook') results.facebook = await postToFacebook(imageUrl, caption);
                    if (platform === 'instagram') results.instagram = await postToInstagram(imageUrl, caption);
                } catch (e: unknown) {
                    errors[platform] = e instanceof Error ? e.message : String(e);
                }
            })
        );

        return NextResponse.json({ success: true, imageUrl, results, errors });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error('[social/publish]', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
