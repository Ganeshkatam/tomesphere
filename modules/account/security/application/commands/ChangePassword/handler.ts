import { ChangePasswordCommand } from "./index";
import { SecurityRepository } from "../../../domain/repositories/SecurityRepository";

/**
 * Change Password Handler
 *
 * Refactored to use SecurityRepository port instead of SupabaseClient directly.
 * The infrastructure layer (SupabaseSecurityRepository) handles the actual auth call.
 */
export class ChangePasswordHandler {
  constructor(private readonly repository: SecurityRepository) {}

  async execute(command: ChangePasswordCommand): Promise<void> {
    await this.repository.changePassword(command.newPassword);
  }
}
