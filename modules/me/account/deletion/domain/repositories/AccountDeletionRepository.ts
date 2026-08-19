/**
 * Account Deletion Repository Port
 *
 * Moved from modules/user/profile/domain/repositories/ to
 * modules/me/account/deletion/domain/repositories/ per frozen architecture.
 *
 * Account owns the deletion lifecycle.
 */

export interface AccountDeletionRepository {
  /**
   * Sanitizes the user's data by nullifying PII in logs
   * and archiving necessary audit records before deletion.
   */
  sanitizeAccount(userId: string): Promise<void>;

  /**
   * Permanently deletes the user from the authentication system
   * which cascades to delete all their relational data.
   */
  deleteUser(userId: string): Promise<void>;
}
