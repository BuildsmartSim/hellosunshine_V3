import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from './supabaseAdmin';

export async function requireAdminOrPin(pin?: string): Promise<{ authorized: boolean, error?: string }> {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { authorized: false, error: 'Not authenticated' };
        }

        // 1. Check if natively admin
        const { data: roleData } = await supabaseAdmin
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .single();

        if (roleData?.role === 'admin') {
            return { authorized: true };
        }

        // 2. If not admin, verify PIN
        if (pin && pin.trim().length > 0) {
            const { data: settings } = await supabaseAdmin
                .from('admin_settings')
                .select('manager_pin')
                .eq('id', 'default')
                .single();

            if (settings && settings.manager_pin && settings.manager_pin === pin) {
                return { authorized: true };
            }
        }

        return { authorized: false, error: 'Unauthorized. Manager PIN required for this action.' };
    } catch (err: any) {
        console.error('Authorization error:', err);
        return { authorized: false, error: 'Failed to verify authorization.' };
    }
}
