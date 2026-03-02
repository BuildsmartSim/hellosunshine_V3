import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';
import { searchSerper } from '@/utils/agents/serper';
import { scrapeUrl } from '@/utils/agents/firecrawl';



const QUERIES = [
    "large UK festivals boutique camping",
    "major UK music festivals healing fields",
    "uk boutique music festivals",
    "small independent arts festivals uk",
    "uk wild swimming clubs",
    "uk glamping sites with lakes",
    "uk trail running events with event village"
];

const SYSTEM_PROMPT = `
You are an AI scouting for a premium mobile wood-fired sauna business called 'Hello Sunshine'. 
We are looking for B2B partnerships, boutique wellness integrations, and pop-up events. 
Our vibe is community-focused, rustic-yet-premium, wellness-oriented, but also open to alternative music/arts events. 

Your task is to analyze the provided markdown text from a website and return a JSON object with the following structure:
{
  "name": "The name of the festival or spot",
  "emails": ["list of contact emails found"],
  "vibe_score": An integer from 1 to 100,
  "vibe_notes": "A short summary of *why* you gave this score based on their website copy."
}

Scoring Rules:
- We need locations or events with outdoor space, water access, and a crowd that appreciates high-quality relaxation.
- When scoring festivals (especially large ones 4000+ capacity), prioritize those that explicitly mention 'boutique camping', 'VIP areas', 'healing fields', or 'wellness sanctuaries'. Give these high scores (80-100).
- If the site is a wild swimming club or luxury glamping site, give it a high score (80-100).
- If it seems like a generic corporate event or an indoor location, give it a low score (< 40).

Return ONLY valid JSON.
`;

export const maxDuration = 300;

export async function GET(request: Request) {
    // 1. Check authorization (Vercel Cron or manual admin)
    const authHeader = request.headers.get('authorization');
    const isVercelCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
    const isManual = new URL(request.url).searchParams.get('key') === process.env.CRON_SECRET;

    if (!isVercelCron && !isManual && process.env.NODE_ENV !== 'development') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        // 2. Select a random query
        const query = QUERIES[Math.floor(Math.random() * QUERIES.length)];
        console.log(`[Discovery] Running search for: "${query}"`);

        // 3. Search Serper
        const searchResults = await searchSerper(query);
        if (!searchResults.length) {
            return NextResponse.json({ message: 'No search results found.' });
        }

        const processedUrls: string[] = [];
        let addedCount = 0;

        // Process top 2 results to save time/tokens on a single cron run
        for (const result of searchResults.slice(0, 2)) {
            const url = result.link;

            // 4. Check if URL already exists in DB
            const { data: existing } = await supabase
                .from('discovery_leads')
                .select('id')
                .eq('url', url)
                .single();

            if (existing) {
                console.log(`[Discovery] Skipping existing URL: ${url}`);
                continue;
            }

            console.log(`[Discovery] Scraping ${url}...`);

            // 5. Scrape with Firecrawl
            const markdown = await scrapeUrl(url);
            if (!markdown) {
                console.log(`[Discovery] Could not scrape ${url}, skipping.`);
                continue;
            }

            console.log(`[Discovery] Analyzing markdown for ${url}...`);

            // 6. Extract with Gemini
            try {
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: [
                        { text: SYSTEM_PROMPT },
                        { text: `WEBSITE MARKDOWN:\n\n${markdown.substring(0, 50000)}` } // Limit to 50k chars
                    ],
                    config: {
                        responseMimeType: 'application/json',
                    }
                });

                // Use type assertion to avoid TS complaining about the getter
                const jsonText = String((response as any).text);
                if (!jsonText) throw new Error("No text response from Gemini");

                const extractedData = JSON.parse(jsonText);

                // Determine Type rough guess
                const isFestival =
                    query.includes('festival') ||
                    extractedData.name?.toLowerCase().includes('festival');

                const type = isFestival ? 'festival' : 'popup_spot';

                // 7. Save to DB
                const { error: insertError } = await supabase
                    .from('discovery_leads')
                    .insert({
                        type,
                        name: extractedData.name || result.title,
                        url,
                        emails: Array.isArray(extractedData.emails) ? extractedData.emails : [],
                        vibe_score: extractedData.vibe_score || 50,
                        vibe_notes: extractedData.vibe_notes || '',
                        source: isManual ? 'manual' : 'cron',
                        status: 'PENDING'
                    });

                if (insertError) {
                    console.error(`[Discovery] DB Insert Error for ${url}:`, insertError);
                } else {
                    console.log(`[Discovery] successfully added: ${extractedData.name}`);
                    addedCount++;
                    processedUrls.push(url);
                }
            } catch (geminiError) {
                console.error(`[Discovery] Gemini Extraction Error for ${url}:`, geminiError);
            }
        }

        return NextResponse.json({
            success: true,
            query,
            processed: processedUrls.length,
            added: addedCount
        });

    } catch (err: any) {
        console.error("[Discovery] Global Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
