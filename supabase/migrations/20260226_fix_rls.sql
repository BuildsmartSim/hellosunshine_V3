-- Fix RLS for user_roles to avoid recursion and allow users to see their own status
DROP POLICY IF EXISTS "Admins can view and manage all roles" ON public.user_roles;

CREATE POLICY "Users can view their own role" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Fix RLS for admin_settings
DROP POLICY IF EXISTS "Admins can view and manage settings" ON public.admin_settings;

CREATE POLICY "Admins can manage settings" ON public.admin_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );
