-- SQL Migration V2: Add is_featured to app_events
-- This allows admins to control which events display on the homepage.
ALTER TABLE public.app_events Add COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT true;

-- 1. App Events Table
CREATE TABLE IF NOT EXISTS public.app_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    location TEXT NOT NULL,
    dates TEXT NOT NULL,
    description TEXT NOT NULL,
    logo_src TEXT NOT NULL,
    featured_price TEXT NOT NULL,
    facilities JSONB DEFAULT '[]'::jsonb,
    tiers JSONB DEFAULT '[]'::jsonb,
    opening_times JSONB DEFAULT '[]'::jsonb,
    external_url TEXT,
    services JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    is_active BOOLEAN DEFAULT true
);

-- Note: We are strictly storing JSONB arrays for facilities, tiers, opening_times, and services
-- to allow for rich, unstructured UI rendering exactly as it was statically typed in festivals.ts.

-- Enable RLS
ALTER TABLE public.app_events ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active events
CREATE POLICY "Allow public read access to active events" 
ON public.app_events FOR SELECT 
USING (is_active = true);

-- Allow admins to do everything
CREATE POLICY "Allow authenticated full access to events"
ON public.app_events FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Ensure Tickets have product_id
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES products(id);

-- Restock
UPDATE products SET stock_limit = stock_limit + 50;

-- Seeding
DO $$
DECLARE
    loc_avalon UUID;
    loc_small_world UUID;
    loc_campo UUID;
    loc_moving UUID;
BEGIN
    -- 1. Insert Locations
    INSERT INTO locations (name, type) VALUES ('Avalon Dance Odyssey', 'festival') RETURNING id INTO loc_avalon;
    INSERT INTO locations (name, type) VALUES ('Small World', 'festival') RETURNING id INTO loc_small_world;
    INSERT INTO locations (name, type) VALUES ('Campo Sancho', 'festival') RETURNING id INTO loc_campo;
    INSERT INTO locations (name, type) VALUES ('Moving Connections', 'festival') RETURNING id INTO loc_moving;

    -- 2. Insert Products (Ticket Tiers)
    INSERT INTO products (location_id, name, price_id, stock_limit) VALUES 
        (loc_avalon, 'Early Bird 5-Day', 'av-eb', 20),
        (loc_avalon, 'Guest 5-Day Pass', 'av-guest', 100),
        (loc_avalon, 'Couples 5-Day', 'av-couple', 20),
        (loc_avalon, 'Crew & Volunteer', 'av-crew', 50),
        (loc_avalon, 'Single Session', 'av-single', 200);

    INSERT INTO products (location_id, name, price_id, stock_limit) VALUES 
        (loc_small_world, 'Guest Pass', 'sw-guest', 150),
        (loc_small_world, 'Single Session', 'sw-single', 200),
        (loc_small_world, 'Crew Pass', 'sw-crew', 50);

    INSERT INTO products (location_id, name, price_id, stock_limit) VALUES 
        (loc_campo, 'Guest Pass', 'cs-guest', 100),
        (loc_campo, 'Couple Pass', 'cs-couple', 20),
        (loc_campo, 'Crew Pass', 'cs-crew', 50);

    INSERT INTO products (location_id, name, price_id, stock_limit) VALUES 
        (loc_moving, 'Super Early Bird', 'mc-seb', 30);
END $$;
