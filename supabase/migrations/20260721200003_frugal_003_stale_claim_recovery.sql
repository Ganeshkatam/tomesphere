-- Frugal Migration 003: Stale Claim Recovery & Table Fix
-- Fixes the table reference (outbox_messages instead of outbox_events) 
-- and adds stale lease recovery.

ALTER TABLE public.outbox_events 
ADD COLUMN IF NOT EXISTS claimed_at TIMESTAMP WITH TIME ZONE;

CREATE OR REPLACE FUNCTION internal.claim_outbox_events(limit_count integer)
RETURNS SETOF public.outbox_events
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RETURN QUERY
    UPDATE public.outbox_events
    SET status = 'processing', claimed_at = NOW()
    WHERE id IN (
        SELECT id
        FROM public.outbox_events
        WHERE status = 'pending'
           OR (status = 'failed' AND retry_count < 3)
           OR (status = 'processing' AND claimed_at < NOW() - INTERVAL '5 minutes') -- Stale lease recovery
        ORDER BY created_at ASC
        FOR UPDATE SKIP LOCKED
        LIMIT limit_count
    )
    RETURNING *;
END;
$$;
