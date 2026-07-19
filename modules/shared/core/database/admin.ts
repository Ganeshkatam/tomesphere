import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/database";

/**
 * Creates a Supabase client using the Service Role Key.
 * DANGER: This client bypasses Row Level Security (RLS).
 * It should ONLY be used in server-side operations that require admin privileges 
 * (like user deletion, or cross-tenant data migrations).
 */
export function createSupabaseAdminClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }
  
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
