/**
 * Security Page DTO
 *
 * Nested structure reflecting the security page layout:
 * - Password section
 * - Danger Zone (deletion)
 */

export interface SecurityPageDto {
  readonly password: {
    readonly hasPassword: boolean;
    readonly lastPasswordChange: string | null;
  };
  readonly deletion: {
    readonly canDelete: boolean;
  };
}
