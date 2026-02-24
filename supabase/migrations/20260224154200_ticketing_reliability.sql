-- 20260224154200_ticketing_reliability.sql

-- 0. Add 'pending' to ticket_status enum
ALTER TYPE public.ticket_status ADD VALUE IF NOT EXISTS 'pending';

-- 1. Add email_sent tracking to tickets
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS email_sent BOOLEAN DEFAULT false;

-- 2. Add idempotency constraint for Stripe Webhooks
-- This prevents the same stripe_session_id from creating multiple tickets if the webhook fires twice.
ALTER TABLE public.tickets ADD CONSTRAINT tickets_stripe_session_id_key UNIQUE (stripe_session_id);

-- 3. Add price_amount_pence to products for secure server-side price lookup
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price_amount_pence INTEGER DEFAULT 0;

