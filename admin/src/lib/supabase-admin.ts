import { createClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";

/**
 * Service-role Supabase client for admin server-side operations.
 * Bypasses RLS. Only use in Server Components and Server Actions.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
