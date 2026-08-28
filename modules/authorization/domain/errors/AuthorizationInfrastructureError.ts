export class AuthorizationInfrastructureError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(`Authorization infrastructure failure: ${message}`);
    this.name = "AuthorizationInfrastructureError";
  }
}
