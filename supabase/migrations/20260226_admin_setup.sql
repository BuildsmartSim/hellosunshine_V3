-- 1. Create User Roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'clerk')),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id)
);

-- 2. Create Admin Settings table
CREATE TABLE IF NOT EXISTS public.admin_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    chief_email TEXT,
    telegram_bot_token TEXT,
    telegram_chat_id TEXT,
    updated_at TIMESTAMPTZ DEFAULT now(),
    updated_by UUID REFERENCES auth.users(id)
);

-- 3. Add refund_reason to tickets
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'tickets' AND COLUMN_NAME = 'refund_reason') THEN
        ALTER TABLE public.tickets ADD COLUMN refund_reason TEXT;
    END IF;
END $$;

-- 4. Enable RLS on new tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- 5. Policies (Admin only for settings, roles)
-- Note: These policies assume we will be using the service role for many operations, but good to have.
CREATE POLICY "Admins can view and manage all roles" ON public.user_roles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur 
            WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
        )
    );

CREATE POLICY "Admins can view and manage settings" ON public.admin_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur 
            WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
        )
    );

-- Insert a default settings record if it doesn't exist
INSERT INTO public.admin_settings (id) VALUES ('default') ON CONFLICT (id) DO NOTHING;
