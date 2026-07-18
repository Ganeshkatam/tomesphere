-- Phase 10C.1: Recommendation Signal Projections

CREATE TABLE public.discovery_recommendation_signals (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
    liked BOOLEAN DEFAULT false,
    rating INTEGER,
    completion_percent NUMERIC DEFAULT 0,
    interaction_count INTEGER DEFAULT 0,
    last_activity_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, book_id)
);

CREATE INDEX idx_discovery_recommendation_signals_user ON public.discovery_recommendation_signals(user_id);
CREATE INDEX idx_discovery_recommendation_signals_book ON public.discovery_recommendation_signals(book_id);

CREATE TABLE public.discovery_book_features (
    book_id UUID PRIMARY KEY REFERENCES public.books(id) ON DELETE CASCADE,
    popularity_score NUMERIC DEFAULT 0,
    embedding_score NUMERIC DEFAULT 0,
    trending_score NUMERIC DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.discovery_recommendation_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discovery_book_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own recommendation signals" 
ON public.discovery_recommendation_signals FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read book features" 
ON public.discovery_book_features FOR SELECT 
USING (true);

-- Incremental reconciliation function
CREATE OR REPLACE FUNCTION public.refresh_recommendation_signals(target_user_id UUID DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- This function reconciles facts from canonical tables to the discovery projection.
    
    INSERT INTO public.discovery_recommendation_signals (
        user_id, book_id, liked, rating, completion_percent, interaction_count, last_activity_at, updated_at
    )
    SELECT 
        COALESCE(l.user_id, r.user_id, s.user_id),
        COALESCE(l.book_id, r.book_id, s.book_id),
        l.id IS NOT NULL as liked,
        r.rating,
        COALESCE(s.percentage, 0) as completion_percent,
        (CASE WHEN l.id IS NOT NULL THEN 1 ELSE 0 END) + 
        (CASE WHEN r.id IS NOT NULL THEN 1 ELSE 0 END) + 
        (CASE WHEN s.id IS NOT NULL THEN 1 ELSE 0 END) as interaction_count,
        GREATEST(l.created_at, r.created_at, s.last_read_at) as last_activity_at,
        NOW() as updated_at
    FROM 
        (SELECT id, user_id, book_id, created_at FROM public.book_likes WHERE (target_user_id IS NULL OR user_id = target_user_id)) l
    FULL OUTER JOIN 
        (SELECT id, user_id, book_id, rating, created_at FROM public.ratings WHERE (target_user_id IS NULL OR user_id = target_user_id)) r
    ON l.user_id = r.user_id AND l.book_id = r.book_id
    FULL OUTER JOIN 
        (SELECT id, user_id, book_id, percentage, last_read_at FROM public.reader_sessions WHERE (target_user_id IS NULL OR user_id = target_user_id)) s
    ON COALESCE(l.user_id, r.user_id) = s.user_id AND COALESCE(l.book_id, r.book_id) = s.book_id
    ON CONFLICT (user_id, book_id) DO UPDATE SET
        liked = EXCLUDED.liked,
        rating = EXCLUDED.rating,
        completion_percent = EXCLUDED.completion_percent,
        interaction_count = EXCLUDED.interaction_count,
        last_activity_at = EXCLUDED.last_activity_at,
        updated_at = EXCLUDED.updated_at;
END;
$$;
