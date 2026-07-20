-- Migration: Search Analytics Schema
-- Enhances the search_history table to capture query performance and facets

ALTER TABLE public.search_history
ADD COLUMN IF NOT EXISTS execution_time_ms integer,
ADD COLUMN IF NOT EXISTS is_zero_result boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_slow_query boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS filters jsonb,
ADD COLUMN IF NOT EXISTS sort_strategy text;

CREATE INDEX IF NOT EXISTS search_history_zero_result_idx ON public.search_history(is_zero_result) WHERE is_zero_result = true;
CREATE INDEX IF NOT EXISTS search_history_slow_query_idx ON public.search_history(is_slow_query) WHERE is_slow_query = true;
