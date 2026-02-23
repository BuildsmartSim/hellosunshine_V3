'use server';

import { getFestivalData } from '@/data/festivals';

export async function getEventsAction() {
    try {
        const events = await getFestivalData();
        return events;
    } catch (error) {
        console.error('Failed to fetch events:', error);
        return [];
    }
}
