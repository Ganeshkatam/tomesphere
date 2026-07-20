-- Migration: Upgrade Book Admin RPC with Optimistic Concurrency
-- Replaces the original save_book_aggregate_with_events to enforce version checking.

CREATE OR REPLACE FUNCTION public.save_book_aggregate_with_events(
    p_book JSONB,
    p_events JSONB
)
RETURNS void AS $$
DECLARE
    v_event JSONB;
    v_book_id UUID;
    v_expected_version INTEGER;
    v_rows_affected INTEGER;
    v_is_new BOOLEAN;
BEGIN
    v_book_id := (p_book->>'id')::UUID;
    v_expected_version := COALESCE((p_book->>'version')::INTEGER, 1);

    -- Check if this is a new book (INSERT) or existing (UPDATE)
    SELECT NOT EXISTS(SELECT 1 FROM public.books WHERE id = v_book_id) INTO v_is_new;

    IF v_is_new THEN
        -- INSERT: New book creation
        INSERT INTO public.books (
            id,
            title,
            description,
            is_textbook,
            is_published,
            is_archived,
            version,
            created_at,
            updated_at
        ) VALUES (
            v_book_id,
            p_book->>'title',
            p_book->>'description',
            COALESCE((p_book->>'is_textbook')::BOOLEAN, false),
            COALESCE((p_book->>'is_published')::BOOLEAN, false),
            COALESCE((p_book->>'is_archived')::BOOLEAN, false),
            v_expected_version,
            COALESCE((p_book->>'created_at')::TIMESTAMPTZ, NOW()),
            COALESCE((p_book->>'updated_at')::TIMESTAMPTZ, NOW())
        );
    ELSE
        -- UPDATE: Enforce optimistic concurrency via version guard
        UPDATE public.books
        SET
            title = p_book->>'title',
            description = p_book->>'description',
            is_textbook = COALESCE((p_book->>'is_textbook')::BOOLEAN, false),
            is_published = COALESCE((p_book->>'is_published')::BOOLEAN, false),
            is_archived = COALESCE((p_book->>'is_archived')::BOOLEAN, false),
            version = v_expected_version,
            updated_at = COALESCE((p_book->>'updated_at')::TIMESTAMPTZ, NOW())
        WHERE id = v_book_id
          AND version = v_expected_version - 1;

        GET DIAGNOSTICS v_rows_affected = ROW_COUNT;

        IF v_rows_affected = 0 THEN
            RAISE EXCEPTION 'Concurrency conflict: book % was modified by another editor (expected version %)',
                v_book_id, v_expected_version - 1
                USING ERRCODE = 'serialization_failure';
        END IF;
    END IF;

    -- Insert Outbox Events (only reached if UPDATE/INSERT succeeded)
    IF p_events IS NOT NULL AND jsonb_array_length(p_events) > 0 THEN
        FOR v_event IN SELECT * FROM jsonb_array_elements(p_events)
        LOOP
            INSERT INTO public.outbox_events (
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
