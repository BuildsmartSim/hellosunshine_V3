import { textures } from '@/design-system/tokens';
import { supabaseAdmin } from '@/lib/supabaseAdmin';


export type TicketSubTier = {
    id: string;
    name: string;
    price: string;
    description: string;
    stock_limit?: number | null;
};

export type EventData = {
    id: string;
    title: string;
    location: string;
    dates: string;
    description: string;
    logoSrc: string;
    featuredPrice: string;
    facilities: string[];
    tiers: TicketSubTier[];
    openingTimes: string[];
    externalUrl: string;
    services: ('sauna' | 'plunge' | 'shower' | 'tub' | 'fire' | 'heart' | 'towels')[];
    isFeatured: boolean;
};

export const SERVICE_ICONS: Record<string, string> = {
    sauna: '/icons/sauna.png',
    plunge: '/icons/plunge-pool.png',
    shower: '/icons/shower.png',
    tub: '/icons/hot-tub.png',
    fire: '/icons/fire-pit.png',
    heart: '/icons/heart.png',
    towels: '/icons/towels.png'
};

export const getFestivalData = async (): Promise<EventData[]> => {
    try {
        console.log('[DEBUG] getFestivalData: Querying app_events...');
        const { data, error } = await supabaseAdmin
            .from('app_events')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: true });

        if (error) {
            console.error("[DEBUG] getFestivalData: Supabase Error during fetch:", error.message || error);
            return [];
        }

        if (!data) {
            console.warn("[DEBUG] getFestivalData: Supabase returned null data.");
            return [];
        }

        console.log(`[DEBUG] getFestivalData: Successfully received ${data.length} raw events.`);

        return data.map((event: any): EventData => ({
            id: event.id,
            title: event.title,
            location: event.location,
            dates: event.dates,
            description: event.description,
            logoSrc: event.logo_src,
            featuredPrice: event.featured_price,
            facilities: event.facilities || [],
            tiers: event.tiers || [],
            openingTimes: event.opening_times || [],
            externalUrl: event.external_url || '',
            services: event.services || [],
            isFeatured: event.is_featured || false,
        }));
    } catch (err) {
        console.error("Failed to fetch festival data:", err);
        return [];
    }
};

