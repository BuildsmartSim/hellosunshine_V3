-- 1. Create Enums (Idempotent)
DO $$ BEGIN
    CREATE TYPE location_type AS ENUM ('festival', 'fixed_site', 'pop_up');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ticket_status AS ENUM ('active', 'used', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Locations Table
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type location_type NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price_id TEXT NOT NULL, -- We will store our 'av-eb' IDs here
    stock_limit INTEGER,
    is_scheduled BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Slots Table
CREATE TABLE IF NOT EXISTS slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    capacity INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    full_name TEXT,
    age INTEGER,
    gender TEXT,
    total_sweats INTEGER DEFAULT 0,
    medical_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Tickets Table
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    slot_id UUID REFERENCES slots(id) ON DELETE SET NULL,
    product_id UUID REFERENCES products(id), -- Added direct link for flexibility
    status ticket_status DEFAULT 'active',
    check_in_at TIMESTAMPTZ,
    stripe_session_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Setup
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- 7. Logic: Loyalty Function
CREATE OR REPLACE FUNCTION increment_sweats(profile_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE profiles
    SET total_sweats = total_sweats + 1
    WHERE id = profile_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
