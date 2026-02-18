-- Seed Data for Hello Sunshine Festivals

DO $$
DECLARE
    loc_avalon UUID;
    loc_small_world UUID;
    loc_campo UUID;
    loc_moving UUID;
BEGIN
    -- 1. Insert Locations and capture IDs
    INSERT INTO locations (name, type) VALUES ('Avalon Dance Odyssey', 'festival') RETURNING id INTO loc_avalon;
    INSERT INTO locations (name, type) VALUES ('Small World', 'festival') RETURNING id INTO loc_small_world;
    INSERT INTO locations (name, type) VALUES ('Campo Sancho', 'festival') RETURNING id INTO loc_campo;
    INSERT INTO locations (name, type) VALUES ('Moving Connections', 'festival') RETURNING id INTO loc_moving;

    -- 2. Insert Products (Ticket Tiers) linked to Locations
    -- Avalon
    INSERT INTO products (location_id, name, price_id, stock_limit) VALUES 
        (loc_avalon, 'Early Bird 5-Day', 'av-eb', 20),
        (loc_avalon, 'Guest 5-Day Pass', 'av-guest', 100),
        (loc_avalon, 'Couples 5-Day', 'av-couple', 20),
        (loc_avalon, 'Crew & Volunteer', 'av-crew', 50),
        (loc_avalon, 'Single Session', 'av-single', 200);

    -- Small World
    INSERT INTO products (location_id, name, price_id, stock_limit) VALUES 
        (loc_small_world, 'Guest Pass', 'sw-guest', 150),
        (loc_small_world, 'Single Session', 'sw-single', 200),
        (loc_small_world, 'Crew Pass', 'sw-crew', 50);

    -- Campo Sancho
    INSERT INTO products (location_id, name, price_id, stock_limit) VALUES 
        (loc_campo, 'Guest Pass', 'cs-guest', 100),
        (loc_campo, 'Couple Pass', 'cs-couple', 20),
        (loc_campo, 'Crew Pass', 'cs-crew', 50);

    -- Moving Connections
    INSERT INTO products (location_id, name, price_id, stock_limit) VALUES 
        (loc_moving, 'Super Early Bird', 'mc-seb', 30);

END $$;
