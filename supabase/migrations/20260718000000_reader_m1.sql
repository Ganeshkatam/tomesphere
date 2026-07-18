-- ==============================================================================
-- MILESTONE 1: Reader MVP
-- Description: Core tables for Reader Experience (Positions, Highlights, Notes)
-- ==============================================================================

-- 1. Reader Positions (For Session Resume)
-- NOTE: This uses last-write-wins semantics. If multiple devices update position 
-- concurrently, the final write will overwrite the previous anchor.
CREATE TABLE public.reader_positions (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    location_anchor JSONB NOT NULL, -- Format: { "type": "epubcfi", "value": "..." }
    last_read_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, book_id)
);

-- 2. Reader Highlights
CREATE TABLE public.reader_highlights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    location_anchor JSONB NOT NULL,
    selected_text TEXT NOT NULL,
    color VARCHAR(20) DEFAULT 'yellow',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Reader Notes
CREATE TABLE public.reader_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    highlight_id UUID REFERENCES public.reader_highlights(id) ON DELETE SET NULL, -- Optional 1:1 or 1:N attachment
    location_anchor JSONB NOT NULL,
    body_markdown TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for querying all annotations for a book by a user
CREATE INDEX idx_reader_highlights_user_book ON public.reader_highlights(user_id, book_id);
CREATE INDEX idx_reader_notes_user_book ON public.reader_notes(user_id, book_id);

-- RLS Policies
ALTER TABLE public.reader_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reader_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reader_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own reader positions" ON public.reader_positions
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own reader highlights" ON public.reader_highlights
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own reader notes" ON public.reader_notes
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Triggers for updated_at on notes
CREATE TRIGGER update_reader_notes_updated_at BEFORE UPDATE ON public.reader_notes FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
