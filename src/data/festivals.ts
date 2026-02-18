import { textures } from '@/design-system/tokens';

export type TicketSubTier = {
    id: string;
    name: string;
    price: string;
    description: string;
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

export const FESTIVAL_DATA: EventData[] = [
    {
        id: 'avalon',
        title: "Avalon Dance Odyssey",
        location: "Glastonbury",
        dates: "18-22 Sept",
        description: "The UK’s premier festival sanctuary. A multi-day journey of heat, cold therapy, and deep relaxation under the stars.",
        logoSrc: "/Festival Logo_svg/Avalon Dance Oddessy2.svg",
        featuredPrice: "£45",
        facilities: ["2x Wood-fired Saunas", "2x Cold Plunges", "6x Hot & Cold Showers", "2x Hot Tubs"],
        openingTimes: [
            "Thursday: 6pm - 2am",
            "Friday - Sunday: 8am - 2am",
            "Monday: 8am - 11am"
        ],
        externalUrl: "https://hellosunshinesauna.com/avalon-dance-odyssey",
        services: ['sauna', 'plunge', 'shower', 'tub', 'fire', 'heart'],
        tiers: [
            { id: 'av-eb', name: "Early Bird 5-Day", price: "£35", description: "Limited sale for early seekers." },
            { id: 'av-guest', name: "Guest 5-Day Pass", price: "£45", description: "Full access for the duration." },
            { id: 'av-couple', name: "Couples 5-Day", price: "£80", description: "Shared warmth for two." },
            { id: 'av-crew', name: "Crew & Volunteer", price: "£30", description: "For the hard-working souls." },
            { id: 'av-single', name: "Single Session", price: "£15", description: "A moment of stillness." }
        ]
    },
    {
        id: 'small-world',
        title: "Small World",
        location: "Kent",
        dates: "21st-24th August",
        description: "The original creation. A haven of peace and calm, always hot and clean, with a beautiful and welcoming garden.",
        logoSrc: "/Festival Logo_svg/Small world.svg",
        featuredPrice: "£30",
        facilities: ["1969 Thomson Glenn Sauna", "Cold Plunge Pool", "Bamboo Privacy Showers", "Fire Bowl Hub"],
        openingTimes: [
            "Thursday: 3pm - 8pm",
            "Friday - Monday: 8am - 8pm",
            "Tuesday: 8am - Noon"
        ],
        externalUrl: "https://hellosunshinesauna.com/small-world",
        services: ['sauna', 'plunge', 'shower', 'fire'],
        tiers: [
            { id: 'sw-guest', name: "Guest Pass", price: "£30", description: "Full weekend immersion." },
            { id: 'sw-single', name: "Single Session", price: "£15", description: "One-hour ritual." },
            { id: 'sw-crew', name: "Crew Pass", price: "£15", description: "Special rate for village team." }
        ]
    },
    {
        id: 'sancho-campo',
        title: "Campo Sancho",
        location: "Hertfordshire",
        dates: "24-28 July",
        description: "A social focal point for the festival. Fire, steam, and intimate conversations in our bespoke wood-fired sanctuary.",
        logoSrc: "/Festival Logo_svg/rumble camp.svg",
        featuredPrice: "£30",
        facilities: ["Wood-fired Sauna", "Icy Cold Plunge", "Chill Zone Garden", "Night Lighting"],
        openingTimes: [
            "Thursday: 6pm - 12am",
            "Friday - Sunday: 8am - 8pm",
            "Monday: 8am - 11am"
        ],
        externalUrl: "https://hellosunshinesauna.com/campo-sancho-sauna-pass",
        services: ['sauna', 'plunge', 'fire', 'heart'],
        tiers: [
            { id: 'cs-guest', name: "Guest Pass", price: "£30", description: "5-day festival access." },
            { id: 'cs-couple', name: "Couple Pass", price: "£55", description: "Full festival for two." },
            { id: 'cs-crew', name: "Crew Pass", price: "£20", description: "Hard-work recovery pass." }
        ]
    },
    {
        id: 'moving-connections',
        title: "Moving Connections",
        location: "London",
        dates: "31 July - 10 Aug",
        description: "Introspective meditation and euphoric bliss. Join us in the heart of London for a radiant journey of wellness.",
        logoSrc: "/Festival Logo_svg/Small world.svg",
        featuredPrice: "£40",
        facilities: ["London Urban Sanctuary", "Dual-Weekend Access", "Euphoric Steam Rituals", "Stillness Zone"],
        openingTimes: [
            "Tues - Thurs: 3pm - 12am",
            "Fri - Sun: 8am - 3am",
            "Monday: 8am - 12pm"
        ],
        externalUrl: "https://hellosunshinesauna.com/moving-connections-sauna-pass",
        services: ['sauna', 'plunge', 'heart'],
        tiers: [
            { id: 'mc-seb', name: "Super Early Bird", price: "£40", description: "Full pass for dual weekends." }
        ]
    },
];
