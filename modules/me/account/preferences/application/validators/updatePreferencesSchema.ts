import { z } from "zod";

/**
 * Zod schema for preferences updates.
 * Validates input before constructing UpdatePreferencesCommand.
 */
export const updatePreferencesSchema = z.object({
  appearance: z
    .object({
      themeMode: z.enum(["light", "dark", "system"]).optional(),
      language: z.string().min(2).max(10).optional(),
    })
    .optional(),
  reader: z
    .object({
      theme: z.enum(["light", "dark", "sepia"]).optional(),
      fontFamily: z.string().max(50).optional(),
      fontSize: z.string().max(10).optional(),
      lineHeight: z.number().min(1).max(3).optional(),
      pageMargins: z.number().min(0).max(100).optional(),
      scrollMode: z.enum(["scroll", "paginated"]).optional(),
      dictionaryLanguage: z.string().min(2).max(10).optional(),
      textAlignment: z.enum(["left", "justify"]).optional(),
      hyphenation: z.boolean().optional(),
    })
    .optional(),
  notifications: z
    .object({
      emailAlerts: z.boolean().optional(),
      weeklyDigest: z.boolean().optional(),
      pushNotifications: z.boolean().optional(),
    })
    .optional(),
});

export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>;
