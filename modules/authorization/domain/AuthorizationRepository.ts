import { Permission } from "@/modules/shared/kernel/security/Permission";

/**
 * A strictly read-only interface that abstracts away the underlying authorization
 * schema (e.g., user_roles, role_permissions).
 * Role assignment is a separate administrative concern.
 */
export interface AuthorizationRepository {
  /**
   * Determines if a user holds a specific permission.
   */
  hasPermission(userId: string, permission: Permission): Promise<boolean>;

  /**
   * Retrieves all permissions granted to a user via their roles.
   */
  getUserPermissions(userId: string): Promise<Permission[]>;
}
