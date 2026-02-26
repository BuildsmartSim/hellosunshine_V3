-- Add check-in tracking columns to tickets table
ALTER TABLE tickets 
ADD COLUMN IF NOT EXISTS checked_in_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS check_in_notes TEXT;

-- Create an index for performance on check-in lookups
CREATE INDEX IF NOT EXISTS idx_tickets_checked_in_at ON tickets(checked_in_at) WHERE checked_in_at IS NOT NULL;

-- Enable RLS for these columns if needed, but since we use supabaseAdmin it's fine.
COMMENT ON COLUMN tickets.checked_in_at IS 'Timestamp when the guest was scanned at the door.';
COMMENT ON COLUMN tickets.check_in_notes IS 'Optional staff notes captured during check-in.';
