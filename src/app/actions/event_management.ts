'use server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { revalidatePath } from 'next/cache';

export async function saveEventAction(eventData: any) {
    try {
        // 1. Upsert the event into app_events
        const eventToSave = { ...eventData };
        if (!eventToSave.id) {
            delete eventToSave.id; // Let supabase generate ID if creating new
        }

        const { data: savedEvent, error: eventError } = await supabaseAdmin
            .from('app_events')
            .upsert(eventToSave)
            .select()
            .single();

        if (eventError) throw eventError;

        // 2. We need a location_id for products. 
        let locationId = 'b0f807df-6228-4ad0-bab8-868c2ee886a1'; // arbitrary fallback if no DB sync works
        if (eventData.location) {
            const { data: existingLoc } = await supabaseAdmin
                .from('locations')
                .select('id')
                .eq('name', eventData.location)
                .single();

            if (existingLoc) {
                locationId = existingLoc.id;
            } else {
                const { data: newLoc } = await supabaseAdmin
                    .from('locations')
                    .insert({ name: eventData.location, type: 'pop_up', is_active: true })
                    .select('id')
                    .single();
                if (newLoc) locationId = newLoc.id;
            }
        }

        // 3. Upsert products for each tier
        if (eventData.tiers && Array.isArray(eventData.tiers)) {
            for (const tier of eventData.tiers) {
                const stockLimit = (tier.stock_limit !== undefined && tier.stock_limit !== null && tier.stock_limit !== '')
                    ? parseInt(tier.stock_limit.toString(), 10)
                    : null;

                const { data: existingProduct } = await supabaseAdmin
                    .from('products')
                    .select('id')
                    .eq('price_id', tier.id)
                    .single();

                if (existingProduct) {
                    await supabaseAdmin.from('products').update({
                        name: tier.name,
                        stock_limit: stockLimit,
                        location_id: locationId
                    }).eq('id', existingProduct.id);
                } else {
                    await supabaseAdmin.from('products').insert({
                        price_id: tier.id,
                        name: tier.name,
                        stock_limit: stockLimit,
                        location_id: locationId,
                        is_scheduled: false
                    });
                }
            }
        }

        revalidatePath('/admin');
        revalidatePath('/');
        return { success: true, eventId: savedEvent.id };
    } catch (error) {
        console.error('Failed to save event:', error);
        return { success: false, error: (error as any).message };
    }
}

export async function deleteEventAction(eventId: string) {
    try {
        const { error } = await supabaseAdmin
            .from('app_events')
            .delete()
            .eq('id', eventId);

        if (error) throw error;

        revalidatePath('/admin');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete event:', error);
        return { success: false, error: (error as any).message };
    }
}
