/**
 * DEPRECATED AND BANNED ARCHITECTURAL PATTERN
 * 
 * TomeSphere architectural rule:
 * No runtime path may depend on SUPABASE_SERVICE_ROLE_KEY.
 * 
 * For background worker operations, use WorkerDatabaseClient with TOMESPHERE_WORKER_DATABASE_URL.
 * For client/user actions, use Row Level Security (RLS) with authenticated user contexts.
 */
export function createSupabaseAdminClient(): never {
  throw new Error(
    "[Security Constraint] SUPABASE_SERVICE_ROLE_KEY usage is forbidden in TomeSphere runtime code. Use WorkerDatabaseClient for background workers or RLS-scoped user clients."
  );
}
