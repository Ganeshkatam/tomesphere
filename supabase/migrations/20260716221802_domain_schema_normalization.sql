-- ==============================================================================
-- PHASE 1: CREATE NEW SCHEMA
-- ==============================================================================

-- 1. Library Bounded Context
CREATE TABLE public.library_books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    status reading_status NOT NULL DEFAULT 'want_to_read',
    queue_order INTEGER DEFAULT 0,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, book_id)
);

CREATE TABLE public.shelves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    cover_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.shelf_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shelf_id UUID NOT NULL REFERENCES public.shelves(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    position INTEGER,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(shelf_id, book_id)
);

-- 2. Reader Bounded Context
CREATE TABLE public.reader_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    current_page INTEGER DEFAULT 0,
    total_pages INTEGER,
    percentage NUMERIC DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    finished_at TIMESTAMP WITH TIME ZONE,
    reading_time_minutes INTEGER DEFAULT 0,
    UNIQUE(user_id, book_id)
);

-- 3. Progress Bounded Context
CREATE TABLE public.user_progress (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0,
    reading_streak_days INTEGER DEFAULT 0,
    engagement_score INTEGER DEFAULT 0,
    total_reading_time_seconds BIGINT DEFAULT 0,
    profile_completed BOOLEAN DEFAULT false,
    last_activity_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.progress_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    reading_time_minutes INTEGER DEFAULT 0,
    pages_read INTEGER DEFAULT 0,
    books_completed INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);


-- ==============================================================================
-- PHASE 2: COPY DATA (Safe Migration)
-- ==============================================================================

-- Copy reading_lists to library_books
INSERT INTO public.library_books (id, user_id, book_id, status, queue_order, added_at, updated_at)
SELECT id, user_id, book_id, status, queue_order, created_at, updated_at
FROM public.reading_lists;

-- Copy collections to shelves
INSERT INTO public.shelves (id, user_id, name, description, is_public, cover_image, created_at, updated_at)
SELECT id, user_id, name, description, is_public, cover_image, created_at, updated_at
FROM public.collections;

-- Copy collection_items to shelf_items
INSERT INTO public.shelf_items (id, shelf_id, book_id, position, added_at)
SELECT id, collection_id, book_id, position, added_at
FROM public.collection_items;

-- Copy reading_progress to reader_sessions
INSERT INTO public.reader_sessions (id, user_id, book_id, current_page, total_pages, percentage, started_at, last_read_at, finished_at, reading_time_minutes)
SELECT id, user_id, book_id, current_page, total_pages, percentage, started_at, last_read_at, finished_at, reading_time_minutes
FROM public.reading_progress;

-- Copy user_stats to user_progress
INSERT INTO public.user_progress (user_id, total_points, reading_streak_days, engagement_score, total_reading_time_seconds, profile_completed, last_activity_at, updated_at)
SELECT user_id, total_points, reading_streak_days, engagement_score, total_reading_time_seconds, profile_completed, last_activity_at, NOW()
FROM public.user_stats;

-- Copy user_daily_stats to progress_daily
INSERT INTO public.progress_daily (id, user_id, date, reading_time_minutes, pages_read, books_completed, created_at)
SELECT id, user_id, date, reading_time_minutes, pages_read, books_completed, created_at
FROM public.user_daily_stats;


-- ==============================================================================
-- PHASE 4: CREATE INDEXES
-- ==============================================================================
CREATE INDEX idx_library_books_user ON public.library_books(user_id);
CREATE INDEX idx_library_books_book ON public.library_books(book_id);
CREATE INDEX idx_shelves_user ON public.shelves(user_id);
CREATE INDEX idx_shelf_items_shelf ON public.shelf_items(shelf_id);
CREATE INDEX idx_shelf_items_book ON public.shelf_items(book_id);
CREATE INDEX idx_reader_sessions_user ON public.reader_sessions(user_id);
CREATE INDEX idx_reader_sessions_book ON public.reader_sessions(book_id);
CREATE INDEX idx_progress_daily_user ON public.progress_daily(user_id);
CREATE INDEX idx_progress_daily_date ON public.progress_daily(date);


-- ==============================================================================
-- PHASE 5: ENABLE RLS AND CREATE POLICIES
-- ==============================================================================

ALTER TABLE public.library_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shelves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shelf_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reader_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_daily ENABLE ROW LEVEL SECURITY;

-- Library Books Policies
CREATE POLICY "Users can manage their own library books" ON public.library_books
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Shelves Policies
CREATE POLICY "Users can manage their own shelves" ON public.shelves
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public shelves are viewable by everyone" ON public.shelves
FOR SELECT USING (is_public = true);

-- Shelf Items Policies
CREATE POLICY "Users can view items in public shelves" ON public.shelf_items
FOR SELECT USING (EXISTS (SELECT 1 FROM public.shelves s WHERE s.id = shelf_id AND s.is_public = true));

CREATE POLICY "Users can manage items in their own shelves" ON public.shelf_items
FOR ALL USING (EXISTS (SELECT 1 FROM public.shelves s WHERE s.id = shelf_id AND s.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.shelves s WHERE s.id = shelf_id AND s.user_id = auth.uid()));

-- Reader Sessions Policies
CREATE POLICY "Users can manage their own reader sessions" ON public.reader_sessions
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Progress Policies
CREATE POLICY "Users can manage their own progress" ON public.user_progress
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own daily progress" ON public.progress_daily
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Apply automatic updated_at trigger where applicable
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.library_books FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.shelves FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.user_progress FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
