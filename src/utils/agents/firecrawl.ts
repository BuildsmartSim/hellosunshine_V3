import FirecrawlApp from '@mendable/firecrawl-js';

export async function scrapeUrl(url: string): Promise<string | null> {
    try {
        const firecrawl = new FirecrawlApp({
            apiKey: process.env.FIRECRAWL_API_KEY as string,
        });

        const scrapeResult = await firecrawl.scrape(url, {
            formats: ['markdown'],
        });

        return scrapeResult.markdown || null;
    } catch (error) {
        console.error(`Error in scrape for ${url}:`, error);
        return null;
    }
}
