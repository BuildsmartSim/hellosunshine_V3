import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env vars
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // or anon key

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SUPABASE URl or KEY in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
    console.log("Checking remote Supabase database for 'app_events'...");

    const { data: events, error: eventsError } = await supabase
        .from('app_events')
        .select('id, title, is_featured, is_active')
        .limit(5);

    if (eventsError) {
        if (eventsError.code === '42P01') {
            console.log("❌ Table 'app_events' DOES NOT EXIST.");
        } else {
            console.error("Error checking app_events:", eventsError.message);
        }
    } else {
        console.log("✅ Table 'app_events' EXISTS!");
        console.log(`Found ${events.length} events:`);
        console.dir(events, { depth: null });
    }

    // Check locations / products to see if seeding ran
    const { data: locations, error: locError } = await supabase
        .from('locations')
        .select('name')
        .limit(5);

    if (!locError && locations && locations.length > 0) {
        console.log("\n✅ Locations table exists and is populated:", locations.map(l => l.name).join(', '));
    } else {
        console.log("\n❌ Locations table is empty or missing.");
    }
}

checkDatabase();
