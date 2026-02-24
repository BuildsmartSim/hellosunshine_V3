import { createClient } from '@supabase/supabase-js'

let _supabase: any = null;

// This client uses the Service Role Key and should ONLY be used in server-side code (API routes, Server Actions)
// It bypasses RLS, so use it carefully!
// Lazily initialize to avoid crashes during build time if env vars are missing
export const supabaseAdmin = new Proxy({} as any, {
    get(target, prop) {
        if (!_supabase) {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy-project.supabase.co';
            const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_service_key_for_local_dev';

            if (!supabaseUrl || !supabaseServiceKey) {
                // This shouldn't hit now due to the fallbacks, but kept for type safety logic
                throw new Error('Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY) are missing.');
            }
            _supabase = createClient(supabaseUrl, supabaseServiceKey);
        }
        return _supabase[prop];
    }
});
