import "server-only";

import { createSupabaseServerClient } from "@/modules/shared/core/database/server";
import { User } from "@supabase/supabase-js";

/**
 * Authentication & Authorization Guards
 *
 * Reusable guards for server actions. Replace the repeated
 * `supabase.auth.getUser() → if (!user) return error` pattern.
 *
 * Usage:
 *   const user = await requireAuth();
 *   // user is guaranteed to be authenticated here
 *
 *   const admin = await requireRole("admin");
 *   // admin is guaranteed to have the admin role
 */

export class AuthenticationError extends Error {
  constructor(message: string = "Not authenticated") {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends Error {
  constructor(message: string = "Insufficient permissions") {
    super(message);
    this.name = "AuthorizationError";
  }
}

/**
 * Requires the current session to be authenticated.
 * @throws AuthenticationError if no valid session exists.
 */
export async function requireAuth(): Promise<User> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new AuthenticationError();
  }

  return user;
}

/**
 * Requires the current session to have a specific role.
 * Reads the role from the user_roles table (verified in live DB via Supabase MCP).
 *
 * @throws AuthenticationError if not authenticated.
 * @throws AuthorizationError if the user lacks the required role.
 */
export async function requireRole(
  role: "admin" | "user",
): Promise<User> {
  const user = await requireAuth();

  // Default role for all authenticated users
  if (role === "user") {
    return user;
  }

  // Check user_roles table for elevated roles (admin, etc.)
  const supabase = await createSupabaseServerClient();
  const { data: userRole } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", role)
    .maybeSingle();

  if (!userRole) {
    throw new AuthorizationError(
      `This action requires the '${role}' role.`,
    );
  }

  return user;
}
