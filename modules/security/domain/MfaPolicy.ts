import { SecurityAction } from "@/shared/kernel/security/SecurityAction";

/**
 * Defines which security actions require multi-factor authentication (AAL2).
 */
export class MfaPolicy {
  static requiresAAL2(action: SecurityAction): boolean {
    switch (action) {
      case SecurityAction.DeleteAccount:
      case SecurityAction.DisableMfa:
      case SecurityAction.ChangeEmail:
      case SecurityAction.GenerateApiKey:
      case SecurityAction.AssignRole:
        return true;
      default:
        return false;
    }
  }
}
