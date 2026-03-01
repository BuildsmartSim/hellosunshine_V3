CREATE TABLE IF NOT EXISTS archived_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    event_name TEXT,
    event_year INTEGER,
    postal_code TEXT,
    city TEXT,
    lat FLOAT,
    long FLOAT,
    wp_entry_id TEXT UNIQUE,
    source TEXT DEFAULT 'wordpress',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE archived_bookings ENABLE ROW LEVEL SECURITY;

-- Allow admin full access
CREATE POLICY "Allow authenticated full access to archived_bookings"
ON archived_bookings FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
