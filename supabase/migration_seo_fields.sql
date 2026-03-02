-- Migration to add SEO fields to app_events table
-- Ensures management can write SEO-optimized meta tags without affecting visible site copy

ALTER TABLE public.app_events 
ADD COLUMN IF NOT EXISTS seo_title TEXT,
ADD COLUMN IF NOT EXISTS seo_description TEXT;

-- Add comments for documentation
COMMENT ON COLUMN public.app_events.seo_title IS 'Invisible title tag for search engines (Rank Math emulation)';
COMMENT ON COLUMN public.app_events.seo_description IS 'Invisible meta description for search engines (Rank Math emulation)';
