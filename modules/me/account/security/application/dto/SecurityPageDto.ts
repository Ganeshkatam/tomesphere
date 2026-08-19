/**
 * Security Page DTO
 *
 * Nested structure reflecting the security page layout:
 * - Password section
 * - Export Data section
 * - Danger Zone (deletion)
 */

export interface SecurityPageDto {
  readonly password: {
    readonly hasPassword: boolean;
    readonly lastPasswordChange: string | null;
  };
  readonly exportData: {
    readonly status:
      | "requested"
      | "queued"
      | "processing"
      | "completed"
      | "failed"
      | "expired";
    readonly downloadUrl: string | null;
    readonly requestedAt: string | Date | null;
  } | null;
  readonly deletion: {
    readonly canDelete: boolean;
  };
}
