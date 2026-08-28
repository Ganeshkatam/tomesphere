import "server-only";

import { createSupabaseServerClient } from "@/shared/core/database/server";
import { User } from "@supabase/supabase-js";

/**
 * Authentication Guards
 *
 * Reusable session authentication guards for server actions and routes.
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
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new AuthenticationError();
  }

  return user;
}

/**
 * Requires the current session to have a specific role.
 *
 * @throws AuthenticationError if not authenticated.
 * @throws AuthorizationError if the user lacks the required role.
 */
export async function requireRole(role: "admin" | "user"): Promise<User> {
  const user = await requireAuth();

  if (role === "user") {
    return user;
  }

  const supabase = await createSupabaseServerClient();
  const { data: userRole, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", role)
    .maybeSingle();

  if (error) {
    throw new AuthorizationError(`Failed to verify role: ${error.message}`);
  }

  if (!userRole) {
    throw new AuthorizationError(`This action requires the '${role}' role.`);
  }

  return user;
}
