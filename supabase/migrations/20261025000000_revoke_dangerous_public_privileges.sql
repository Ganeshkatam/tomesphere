-- Migration: Revoke Dangerous Public Privileges on Updates and Offers
-- Date: 2026-10-25
-- Severity: Critical Security Remediation
-- Scope: Revoke TRUNCATE, TRIGGER, and REFERENCES on public.updates and public.offers from anon and authenticated roles

REVOKE TRUNCATE, TRIGGER, REFERENCES ON public.updates FROM anon, authenticated;
REVOKE TRUNCATE, TRIGGER, REFERENCES ON public.offers FROM anon, authenticated;
