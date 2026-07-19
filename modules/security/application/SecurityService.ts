import { AuthenticationProvider } from "../domain/AuthenticationProvider";
import { MfaPolicy } from "../domain/MfaPolicy";
import { SecurityAction } from "@/modules/shared/kernel/security/SecurityAction";

export class MfaRequiredError extends Error {
  constructor(action: SecurityAction) {
    super(
      `Multi-factor authentication (AAL2) is required to perform: ${action}`,
    );
    this.name = "MfaRequiredError";
  }
}

/**
 * Application service that orchestrates MFA, Session validation, and Security events.
 * Relies on the AuthenticationProvider port to avoid tight coupling to Supabase.
 */
export class SecurityService {
  constructor(private authProvider: AuthenticationProvider) {}

  /**
   * Asserts that the current session satisfies the MFA requirements for the given action.
   * Throws MfaRequiredError if AAL2 is required but not satisfied.
   */
  async assertActionSecurity(action: SecurityAction): Promise<void> {
    if (MfaPolicy.requiresAAL2(action)) {
      const hasAAL2 = await this.authProvider.verifyAAL2();
      if (!hasAAL2) {
        throw new MfaRequiredError(action);
      }
    }
  }
}
