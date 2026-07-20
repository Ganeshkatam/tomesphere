-- Migration: Book Admin Transactional RPC
-- Implements Phase 10: Admin Backoffice

CREATE OR REPLACE FUNCTION public.save_book_aggregate_with_events(
    p_book JSONB,
    p_events JSONB
)
RETURNS void AS $$
DECLARE
    v_event JSONB;
    v_book_id UUID;
BEGIN
    v_book_id := (p_book->>'id')::UUID;

    -- 1. UPSERT books table
    INSERT INTO public.books (
        id,
        title,
        description,
        is_textbook,
        is_published,
        is_archived,
        created_at,
        updated_at
    ) VALUES (
        v_book_id,
        p_book->>'title',
        p_book->>'description',
        COALESCE((p_book->>'is_textbook')::BOOLEAN, false),
        COALESCE((p_book->>'is_published')::BOOLEAN, false),
        COALESCE((p_book->>'is_archived')::BOOLEAN, false),
        COALESCE((p_book->>'created_at')::TIMESTAMPTZ, NOW()),
        COALESCE((p_book->>'updated_at')::TIMESTAMPTZ, NOW())
    )
    ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        is_textbook = EXCLUDED.is_textbook,
        is_published = EXCLUDED.is_published,
        is_archived = EXCLUDED.is_archived,
        updated_at = EXCLUDED.updated_at;

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
