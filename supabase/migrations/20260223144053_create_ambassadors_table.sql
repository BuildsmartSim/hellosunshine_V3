-- Add ambassadors table
CREATE TABLE IF NOT EXISTS public.ambassadors (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text NOT NULL,
    email text NOT NULL,
    referral_code text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add primary key
ALTER TABLE public.ambassadors
    ADD CONSTRAINT ambassadors_pkey PRIMARY KEY (id);

-- Ensure emails and referral codes are unique
ALTER TABLE public.ambassadors
    ADD CONSTRAINT ambassadors_email_key UNIQUE (email);
ALTER TABLE public.ambassadors
    ADD CONSTRAINT ambassadors_referral_code_key UNIQUE (referral_code);

-- Enable RLS
ALTER TABLE public.ambassadors ENABLE ROW LEVEL SECURITY;

-- Allow public read access to verify codes exist easily
CREATE POLICY "Allow public read access on ambassadors"
    ON public.ambassadors
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING (true);

-- Allow service role to manage everything
CREATE POLICY "Allow service role full access on ambassadors"
    ON public.ambassadors
    AS PERMISSIVE
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Add ambassador tracking to tickets
ALTER TABLE public.tickets
    ADD COLUMN ambassador_id uuid;

ALTER TABLE public.tickets
    ADD CONSTRAINT tickets_ambassador_id_fkey FOREIGN KEY (ambassador_id) REFERENCES public.ambassadors(id) ON DELETE SET NULL;
