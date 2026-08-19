import { z } from "zod";

/**
 * Zod schema for export request.
 * Minimal validation — the user only needs to be authenticated.
 */
export const requestExportSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
});

export type RequestExportInput = z.infer<typeof requestExportSchema>;
