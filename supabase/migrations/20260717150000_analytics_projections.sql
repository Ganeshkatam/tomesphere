-- ==============================================================================
-- PHASE 10C.4: Analytics Read Models (CQRS Projections)
-- ==============================================================================

-- 1. Daily Analytics Projection
CREATE TABLE public.analytics_user_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    pages_read INTEGER DEFAULT 0,
    books_completed INTEGER DEFAULT 0,
    reading_time_minutes INTEGER DEFAULT 0,
    streak_active BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- 2. Monthly Analytics Projection
CREATE TABLE public.analytics_user_monthly (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
    pages_read INTEGER DEFAULT 0,
    books_completed INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, month)
);

-- 3. Genre Analytics Projection (Durable Facts over Policy)
CREATE TABLE public.analytics_user_genres (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    genre TEXT NOT NULL,
    books_started INTEGER DEFAULT 0,
    books_completed INTEGER DEFAULT 0,
    ratings_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    pages_read INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, genre)
);

-- 4. Book Statistics Projection
CREATE TABLE public.analytics_book_statistics (
    book_id UUID PRIMARY KEY REFERENCES public.books(id) ON DELETE CASCADE,
    total_reads INTEGER DEFAULT 0,
    completions INTEGER DEFAULT 0,
    average_rating NUMERIC(3, 2) DEFAULT 0.00,
    rating_count INTEGER DEFAULT 0,
    abandonment_count INTEGER DEFAULT 0,
    pages_read_total BIGINT DEFAULT 0,
    active_readers INTEGER DEFAULT 0,
    completion_rate NUMERIC(5, 4) DEFAULT 0.0000, -- e.g., 0.8500 for 85%
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.analytics_user_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_user_monthly ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_user_genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_book_statistics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own daily analytics" ON public.analytics_user_daily FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can read own monthly analytics" ON public.analytics_user_monthly FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can read own genre analytics" ON public.analytics_user_genres FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can read book statistics" ON public.analytics_book_statistics FOR SELECT USING (true);

-- Triggers for updated_at
CREATE TRIGGER update_analytics_user_daily_updated_at BEFORE UPDATE ON public.analytics_user_daily FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_analytics_user_monthly_updated_at BEFORE UPDATE ON public.analytics_user_monthly FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_analytics_user_genres_updated_at BEFORE UPDATE ON public.analytics_user_genres FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_analytics_book_statistics_updated_at BEFORE UPDATE ON public.analytics_book_statistics FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
