import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { AdminSettingsManager } from './AdminSettingsManager';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const revalidate = 0;

export default async function SettingsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/admin/login');
    }

    const { data: roleData } = await supabaseAdmin
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

    if (roleData?.role !== 'admin') {
        redirect('/admin');
    }

    const { data: settings } = await supabaseAdmin
        .from('admin_settings')
        .select('*')
        .eq('id', 'default')
        .single();

    const defaultSettings = {
        chief_email: '',
        telegram_bot_token: '',
        telegram_chat_id: ''
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-black text-neutral-800 tracking-tight uppercase font-mono">Chief Settings</h2>
                <p className="text-xs text-neutral-500 font-mono mt-1 uppercase tracking-widest">Global configuration for notifications and security</p>
            </div>

            <AdminSettingsManager initialSettings={settings || defaultSettings} />
        </div>
    );
}
