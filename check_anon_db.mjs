import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkAnonDb() {
    const { data, error } = await supabase
        .from('discovery_leads')
        .select('*');

    if (error) {
        console.error("Anon DB Error:", error);
    } else {
        console.log(`Anon client found ${data.length} leads in the database.`);
    }
}
checkAnonDb();
