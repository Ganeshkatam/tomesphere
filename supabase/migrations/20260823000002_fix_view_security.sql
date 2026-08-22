-- Migration: Fix View Security Definer

-- Set the view to security invoker to satisfy the advisor
ALTER VIEW public.trending_searches SET (security_invoker = on);
