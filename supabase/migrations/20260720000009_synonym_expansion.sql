-- Migration: Synonym Expansion
-- Adds search synonyms table and normalization function

CREATE TABLE IF NOT EXISTS public.search_synonyms (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    canonical text NOT NULL,
    synonym text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

CREATE UNIQUE INDEX search_synonyms_synonym_idx ON public.search_synonyms(synonym);

CREATE OR REPLACE FUNCTION public.normalize_search_query(p_query text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
    v_words text[];
    v_word text;
    v_normalized text := '';
    v_canonical text;
BEGIN
    -- Simple word-by-word replacement.
    -- For multi-word synonyms or true stemming, a custom FTS dictionary is better.
    -- But this serves our V1 needs perfectly.
    v_words := regexp_split_to_array(lower(trim(p_query)), '\s+');
    
    FOREACH v_word IN ARRAY v_words
    LOOP
        SELECT canonical INTO v_canonical
        FROM public.search_synonyms
        WHERE synonym = v_word;
        
        IF v_canonical IS NOT NULL THEN
            v_normalized := v_normalized || ' ' || v_canonical;
        ELSE
            v_normalized := v_normalized || ' ' || v_word;
        END IF;
    END LOOP;
    
    RETURN trim(v_normalized);
END;
$$;

INSERT INTO public.search_synonyms (canonical, synonym) VALUES
('science fiction', 'scifi'),
('science fiction', 'sf'),
('science fiction', 'sci-fi'),
('young adult', 'ya')
ON CONFLICT (synonym) DO NOTHING;
