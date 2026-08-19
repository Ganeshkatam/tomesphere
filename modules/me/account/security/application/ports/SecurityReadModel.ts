/**
 * Security Read Model (CQRS Query Side)
 *
 * Provides read-only security information for the SecurityPageFacade.
 * Separated from SecurityRepository (write side) per CQRS principles.
 */

export interface SecurityOverview {
  readonly hasPassword: boolean;
  readonly lastPasswordChange: string | null;
}

export interface SecurityReadModel {
  getSecurityOverview(userId: string): Promise<SecurityOverview>;
}
