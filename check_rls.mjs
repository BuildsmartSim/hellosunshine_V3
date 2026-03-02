import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkRls() {
    const { data, error } = await supabase.rpc('get_rls_status', { table_name: 'discovery_leads' });
    if (error) {
        // Just execute raw sql to check
        const res = await supabase.from('discovery_leads').select('*').limit(1);
        console.log("Service key access:", res.data ? "OK" : "Error");
    }
}
checkRls();
