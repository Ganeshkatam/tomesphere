import { SignOutEverywhereCommand } from "./index";
import { SecurityRepository } from "../../../domain/repositories/SecurityRepository";

/**
 * Sign Out Everywhere Handler
 *
 * Refactored to use SecurityRepository port instead of SupabaseClient directly.
 * The infrastructure layer (SupabaseSecurityRepository) handles the actual auth call.
 */
export class SignOutEverywhereHandler {
  constructor(private readonly repository: SecurityRepository) {}

  async execute(_command: SignOutEverywhereCommand): Promise<void> {
    await this.repository.signOutAllSessions();
  }
}
