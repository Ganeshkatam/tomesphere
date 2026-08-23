-- Migration: 20260824000008_harden_maintenance_routine_privileges.sql
-- Description: Revoke execution of background maintenance procedures from PUBLIC, anon, and authenticated roles

-- 1. Recalculate Trending Projections (Maintenance routine)
REVOKE EXECUTE ON FUNCTION public.recalculate_trending_projections() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.recalculate_trending_projections() TO service_role;

-- 2. Batch Outdated Discovery Projections (Maintenance routine)
REVOKE EXECUTE ON FUNCTION public.refresh_outdated_discovery_projections(integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.refresh_outdated_discovery_projections(integer) TO service_role;

-- 3. Book Popularity Metrics (Internal scoring procedure)
REVOKE EXECUTE ON FUNCTION public.calculate_book_popularity_metrics(uuid, interval) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.calculate_book_popularity_metrics(uuid, interval) TO service_role;
