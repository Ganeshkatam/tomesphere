-- Migration: Transactional Outbox Pattern (Phase 10C.3)

-- 1. Create outbox_messages table
CREATE TABLE IF NOT EXISTS public.outbox_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aggregate_type TEXT NOT NULL,
    aggregate_id UUID NOT NULL,
    event_type TEXT NOT NULL,
    event_version INTEGER NOT NULL DEFAULT 1,
    payload JSONB NOT NULL,
    occurred_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'processed', 'failed', 'failed_permanent')),
    retry_count INTEGER NOT NULL DEFAULT 0,
    last_error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_outbox_messages_status ON public.outbox_messages(status, created_at);
CREATE INDEX idx_outbox_messages_aggregate ON public.outbox_messages(aggregate_type, aggregate_id);

-- Enable RLS
ALTER TABLE public.outbox_messages ENABLE ROW LEVEL SECURITY;
-- Internal table, no public access required. Service role bypasses RLS.

-- 2. Safe Claiming RPC for the Relay
CREATE OR REPLACE FUNCTION public.claim_outbox_messages(limit_count INTEGER DEFAULT 50)
RETURNS SETOF public.outbox_messages AS $$
BEGIN
    RETURN QUERY
    UPDATE public.outbox_messages
    SET status = 'processing'
    WHERE id IN (
        SELECT id
        FROM public.outbox_messages
        WHERE status = 'pending'
           OR (status = 'failed' AND retry_count < 3)
        ORDER BY created_at ASC
        FOR UPDATE SKIP LOCKED
        LIMIT limit_count
    )
    RETURNING *;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. Thin RPCs for Aggregate Persistence + Staged Events

-- Example: Saving a Reader Session
CREATE OR REPLACE FUNCTION public.save_reader_session_with_events(
    p_user_id UUID,
    p_book_id UUID,
    p_current_page INTEGER,
    p_percentage NUMERIC,
    p_library_status text,
    p_events JSONB
)
RETURNS void AS $$
DECLARE
    v_event JSONB;
BEGIN
    -- 1. Update Reader Session
    INSERT INTO public.reader_sessions (user_id, book_id, current_page, percentage, last_read_at)
    VALUES (p_user_id, p_book_id, p_current_page, p_percentage, NOW())
    ON CONFLICT (user_id, book_id) DO UPDATE SET
        current_page = EXCLUDED.current_page,
        percentage = EXCLUDED.percentage,
        last_read_at = EXCLUDED.last_read_at;

    -- 2. Update Library Book Status (since they are often saved together in this bounded context flow)
    INSERT INTO public.library_books (user_id, book_id, status, updated_at)
    VALUES (p_user_id, p_book_id, p_library_status::reading_status, NOW())
    ON CONFLICT (user_id, book_id) DO UPDATE SET
        status = EXCLUDED.status,
        updated_at = EXCLUDED.updated_at;

    -- 3. Insert Outbox Events
    IF p_events IS NOT NULL AND jsonb_array_length(p_events) > 0 THEN
        FOR v_event IN SELECT * FROM jsonb_array_elements(p_events)
        LOOP
            INSERT INTO public.outbox_messages (
                aggregate_type, aggregate_id, event_type, event_version, payload, occurred_at
            ) VALUES (
                v_event->>'aggregate_type',
                (v_event->>'aggregate_id')::uuid,
                v_event->>'event_type',
                COALESCE((v_event->>'event_version')::int, 1),
                v_event->'payload',
                COALESCE((v_event->>'occurred_at')::timestamptz, NOW())
            );
        END LOOP;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Example: Generic Book Action (Like, Rate, Review)
CREATE OR REPLACE FUNCTION public.save_book_action_with_events(
    p_action_type TEXT,
    p_user_id UUID,
    p_book_id UUID,
    p_action_data JSONB,
    p_events JSONB
)
RETURNS void AS $$
DECLARE
    v_event JSONB;
BEGIN
    -- 1. Persist the action
    IF p_action_type = 'like' THEN
        INSERT INTO public.book_likes (book_id, user_id) VALUES (p_book_id, p_user_id) ON CONFLICT DO NOTHING;
    ELSIF p_action_type = 'unlike' THEN
        DELETE FROM public.book_likes WHERE book_id = p_book_id AND user_id = p_user_id;
    ELSIF p_action_type = 'rate' THEN
        INSERT INTO public.ratings (book_id, user_id, rating) 
        VALUES (p_book_id, p_user_id, (p_action_data->>'rating')::int)
        ON CONFLICT (book_id, user_id) DO UPDATE SET rating = EXCLUDED.rating;
    ELSIF p_action_type = 'review' THEN
        INSERT INTO public.reviews (book_id, user_id, content)
        VALUES (p_book_id, p_user_id, p_action_data->>'content');
    END IF;

    -- 2. Insert Outbox Events
    IF p_events IS NOT NULL AND jsonb_array_length(p_events) > 0 THEN
        FOR v_event IN SELECT * FROM jsonb_array_elements(p_events)
        LOOP
            INSERT INTO public.outbox_messages (
                aggregate_type, aggregate_id, event_type, event_version, payload, occurred_at
            ) VALUES (
                v_event->>'aggregate_type',
                (v_event->>'aggregate_id')::uuid,
                v_event->>'event_type',
                COALESCE((v_event->>'event_version')::int, 1),
                v_event->'payload',
                COALESCE((v_event->>'occurred_at')::timestamptz, NOW())
            );
        END LOOP;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- (Legacy activity_queue is retained for observation period)
