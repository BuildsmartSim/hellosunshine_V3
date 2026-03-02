import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkDb() {
    const { data, error } = await supabase
        .from('discovery_leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error("DB Error:", error);
    } else {
        console.log(`Found ${data.length} leads in the database.`);
        data.forEach(lead => {
            console.log(`\n- Name: ${lead.name}`);
            console.log(`  URL: ${lead.url}`);
            console.log(`  Vibe Score: ${lead.vibe_score}`);
            console.log(`  Emails: ${lead.emails?.join(', ')}`);
            console.log(`  Notes: ${lead.vibe_notes}`);
        });
    }
}
checkDb();
