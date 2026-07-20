-- Migration: Clean Retired Schema (Community & Contests)
-- Description: Drops tables belonging to bounded contexts that have been permanently retired.

DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.book_likes CASCADE;
DROP TABLE IF EXISTS public.ratings CASCADE;
DROP TABLE IF EXISTS public.book_comments CASCADE;

DROP TABLE IF EXISTS public.discussions CASCADE;
DROP TABLE IF EXISTS public.discussion_replies CASCADE;
DROP TABLE IF EXISTS public.discussion_comments CASCADE;
DROP TABLE IF EXISTS public.discussion_likes CASCADE;
DROP TABLE IF EXISTS public.comment_likes CASCADE;

DROP TABLE IF EXISTS public.badges CASCADE;
DROP TABLE IF EXISTS public.user_badges CASCADE;

DROP TABLE IF EXISTS public.user_recommendations CASCADE;
DROP TABLE IF EXISTS public.suggestions CASCADE;
