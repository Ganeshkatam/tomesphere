-- Migration: 20260828010000_retire_export_requests.sql
-- Description: Completely retire the export_requests table and its enum type.

DROP TABLE IF EXISTS public.export_requests CASCADE;
DROP TYPE IF EXISTS public.export_request_status CASCADE;
