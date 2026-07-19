export enum SecurityAction {
  // Account management
  DeleteAccount = "DeleteAccount",
  DisableMfa = "DisableMfa",
  ChangeEmail = "ChangeEmail",
  GenerateApiKey = "GenerateApiKey",
  AssignRole = "AssignRole",

  // Authentication events
  LoginSuccess = "LoginSuccess",
  LoginFailed = "LoginFailed",
  Logout = "Logout",
  AccountLocked = "AccountLocked",
  AccountUnlocked = "AccountUnlocked",

  // Password recovery
  PasswordResetRequested = "PasswordResetRequested",
  PasswordResetCompleted = "PasswordResetCompleted",

  // MFA lifecycle
  MfaEnrolled = "MfaEnrolled",
  MfaVerified = "MfaVerified",
  MfaDisabled = "MfaDisabled",

  // Email verification
  EmailVerificationSent = "EmailVerificationSent",
}
