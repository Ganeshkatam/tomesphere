import { SupabaseClient } from "@supabase/supabase-js";
import { Permission } from "@/shared/kernel/security/Permission";
import { AuthorizationRepository } from "../domain/AuthorizationRepository";
import { AuthorizationInfrastructureError } from "../domain/errors/AuthorizationInfrastructureError";

export class SupabaseAuthorizationRepository implements AuthorizationRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async hasPermission(
    userId: string,
    permission: Permission,
  ): Promise<boolean> {
    const { data, error } = await this.supabase.rpc("has_permission", {
      p_user_id: userId,
      p_permission: permission,
    });

    if (error) {
      console.error("[SupabaseAuthorizationRepository] RPC has_permission failed:", error);
      throw new AuthorizationInfrastructureError(
        `Failed to evaluate permission '${permission}' for user '${userId}': ${error.message}`,
        error,
      );
    }

    return Boolean(data);
  }

  async getUserPermissions(userId: string): Promise<Permission[]> {
    const { data, error } = await this.supabase.rpc("get_user_permissions", {
      p_user_id: userId,
    });

    if (error) {
      console.error("[SupabaseAuthorizationRepository] RPC get_user_permissions failed:", error);
      throw new AuthorizationInfrastructureError(
        `Failed to retrieve permissions for user '${userId}': ${error.message}`,
        error,
      );
    }

    if (!data) return [];

    // Map string results to canonical Permission enum values
    const validPermissions = Object.values(Permission) as string[];
    return (data as Array<{ permission: string } | string>)
      .map((item) => (typeof item === "string" ? item : item.permission))
      .filter((p): p is Permission => validPermissions.includes(p));
  }
}

