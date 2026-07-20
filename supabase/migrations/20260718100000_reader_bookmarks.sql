-- ==============================================================================
-- MILESTONE 1: Sprint 3 - Bookmarks
-- Description: Table for storing user bookmarks in the Reader
-- ==============================================================================

CREATE TABLE public.reader_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    location_anchor JSONB NOT NULL,
    label VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reader_bookmarks_user_book ON public.reader_bookmarks(user_id, book_id);

ALTER TABLE public.reader_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own bookmarks" ON public.reader_bookmarks
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
