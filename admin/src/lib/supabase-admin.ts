import { createClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";

/**
 * Standard Supabase client for admin dashboard UI read queries.
 * Operates under standard RLS rules with NEXT_PUBLIC_SUPABASE_ANON_KEY.
 * 
 * TomeSphere Architectural Rule:
 * No runtime path may depend on SUPABASE_SERVICE_ROLE_KEY.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
