import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SUPABASE URL or SERVICE KEY in .env.local");
    process.exit(1);
}

// const supabase = createClient(supabaseUrl, supabaseKey); // This line is no longer needed for direct pg connection

async function runMigration() {
    try {
        const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        // A standard Supabase Postgres connection string (requires password from original setup)
        // Actually, Supabase provides a direct connection pooler string in the dashboard under Database.
        // If the user hasn't set DATABASE_URL, we'll need it.

        const dbUrl = process.env.DATABASE_URL;
        if (!dbUrl) {
            console.error("FATAL: Missing DATABASE_URL in .env.local (Required for direct SQL execution)");
            console.error("Please add DATABASE_URL=postgres://postgres.[project-ref]:[db-password]@aws-0-eu-west-2.pooler.supabase.com:6543/postgres");
            process.exit(1);
        }

        const client = new Client({
            connectionString: dbUrl,
            ssl: { rejectUnauthorized: false }
        });

        await client.connect();

        const sqlPath = path.join(process.cwd(), 'supabase', 'migration_v2.sql');
        const sqlQuery = fs.readFileSync(sqlPath, 'utf8');

        console.log("Applying Migration V2...");
        await client.query(sqlQuery);
        console.log("Migration applied successfully.");

        await client.end();
    } catch (err) {
        console.error("Migration failed:", err);
    }
}

runMigration();
