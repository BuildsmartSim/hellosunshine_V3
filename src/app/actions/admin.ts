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

export async function getReadinessTasksAction() {
    try {
        const { data, error } = await supabaseAdmin
            .from('profiles')
            .select('email, full_name, phone')
            .ilike('email', '%@readiness.test');

        if (error) throw error;

        return (data || []).map((task: any) => ({
            id: task.email || '',
            label: task.full_name || '',
            isCompleted: task.phone === 'YES'
        }));
    } catch (error) {
        console.error('Failed to fetch readiness tasks:', error);
        return [];
    }
}

export async function toggleReadinessTaskAction(email: string, isCompleted: boolean) {
    try {
        const { error } = await supabaseAdmin
            .from('profiles')
            .update({ phone: isCompleted ? 'YES' : 'NO' })
            .eq('email', email);

        if (error) throw error;
        revalidatePath('/admin');
        revalidatePath('/admin/scanner');
        return true;
    } catch (error) {
        console.error('Failed to toggle readiness task:', error);
        return false;
    }
}
