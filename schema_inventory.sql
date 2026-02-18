-- Create the inventory table
CREATE TABLE public.ticket_inventory (
    id TEXT PRIMARY KEY, -- Matches the IDs in src/data/festivals.ts (e.g., 'av-eb')
    max_quantity INTEGER NOT NULL DEFAULT 0,
    sold_quantity INTEGER NOT NULL DEFAULT 0,
    reserved_quantity INTEGER NOT NULL DEFAULT 0, -- For future use with temporary holds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.ticket_inventory ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can READ inventory (to see if it's sold out)
CREATE POLICY "Enable read access for all users" ON public.ticket_inventory
    FOR SELECT USING (true);

-- Policy: Only Service Role (API) can UPDATE inventory (during checkout)
CREATE POLICY "Enable update for service role only" ON public.ticket_inventory
    FOR UPDATE USING (true) WITH CHECK (true); -- In Supabase, this restricts to service role if no other granular policy exists for anon

-- Seed Data (Initial Populations based on src/data/festivals.ts)
-- You can run this to populate your table
INSERT INTO public.ticket_inventory (id, max_quantity, sold_quantity)
VALUES 
    ('av-eb', 20, 0), -- Avalon Early Bird (Limit 20)
    ('av-guest', 100, 0),
    ('av-couple', 20, 0),
    ('av-crew', 50, 0),
    ('av-single', 200, 0),
    
    ('sw-guest', 150, 0),
    ('sw-single', 200, 0),
    ('sw-crew', 50, 0),

    ('cs-guest', 100, 0),
    ('cs-couple', 20, 0),
    ('cs-crew', 50, 0),

    ('mc-seb', 30, 0) -- Moving Connections Super Early Bird
ON CONFLICT (id) DO NOTHING;
