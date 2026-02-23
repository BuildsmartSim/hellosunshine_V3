'use server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { revalidatePath } from 'next/cache';

export async function toggleEventFeatureAction(eventId: string, isFeatured: boolean) {
    try {
        const { error } = await supabaseAdmin
            .from('app_events')
            .update({ is_featured: isFeatured })
            .eq('id', eventId);

        if (error) throw error;
        revalidatePath('/'); // Revalidate homepage so the new featured list shows up
        revalidatePath('/admin');
        return true;
    } catch (error) {
        console.error('Failed to toggle feature status:', error);
        return false;
    }
}

export async function toggleEventActiveAction(eventId: string, isActive: boolean) {
    try {
        const { error } = await supabaseAdmin
            .from('app_events')
            .update({ is_active: isActive })
            .eq('id', eventId);

        if (error) throw error;
        revalidatePath('/tickets');
        revalidatePath('/admin');
        return true;
    } catch (error) {
        console.error('Failed to toggle active status:', error);
        return false;
    }
}
