import { Permission } from "./Permission";

export interface IAuthorizationRepository {
  hasPermission(userId: string, permission: Permission): Promise<boolean>;
  getUserPermissions(userId: string): Promise<Permission[]>;
}

export class UnauthorizedError extends Error {
  constructor(permission: Permission) {
    super(`User does not have the required permission: ${permission}`);
    this.name = "UnauthorizedError";
  }
}

/**
 * Cross-cutting application service for performing authorization checks.
 * Replaces direct role checks with granular permission assertions.
 */
export class PermissionService {
  constructor(private repository: IAuthorizationRepository) {}

  /**
   * Asserts that a user has a specific permission.
   * Throws an UnauthorizedError if they do not.
   */
  async assertPermission(
    userId: string,
    permission: Permission,
  ): Promise<void> {
    const hasPermission = await this.repository.hasPermission(
      userId,
      permission,
    );

    if (!hasPermission) {
      throw new UnauthorizedError(permission);
    }
  }

  /**
   * Returns true if a user has a specific permission, false otherwise.
   */
  async checkPermission(
    userId: string,
    permission: Permission,
  ): Promise<boolean> {
    return await this.repository.hasPermission(userId, permission);
  }
}
