import { NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/shared/core/database/server";
import { User } from "@supabase/supabase-js";

export class BearerAuthGuard {
  static async validate(request: NextRequest): Promise<User | null> {
    // 1. Check for standard Authorization header (Bearer token)
    const authHeader = request.headers.get("Authorization");
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const supabase = await createSupabaseServerClient();
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (!error && user) return user;
    }

    // 2. Fallback to cookies for internal Next.js requests (useful during migration)
    try {
      const supabase = await createSupabaseServerClient();
      const { data: { user } } = await supabase.auth.getUser();
      return user || null;
    } catch {
      return null;
    }
  }
}
