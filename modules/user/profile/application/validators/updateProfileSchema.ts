import { z } from "zod";

/**
 * Zod schema for profile updates.
 * Validates input before constructing UpdateProfileCommand.
 */
export const updateProfileSchema = z.object({
  displayName: z
    .string()
    .min(2, "Display name must be at least 2 characters")
    .max(50, "Display name must be at most 50 characters")
    .optional(),
  biography: z
    .string()
    .max(500, "Biography must be at most 500 characters")
    .optional(),
  location: z
    .string()
    .max(100, "Location must be at most 100 characters")
    .optional(),
  avatarUrl: z
    .string()
    .url("Avatar must be a valid URL")
    .optional()
    .or(z.literal("")),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
