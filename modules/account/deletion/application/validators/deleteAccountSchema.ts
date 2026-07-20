import { z } from "zod";

const DELETION_CONFIRMATION = "DELETE MY ACCOUNT";

/**
 * Zod schema for account deletion.
 * Requires the user to type the exact confirmation phrase.
 */
export const deleteAccountSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  confirmationText: z.string().refine((val) => val === DELETION_CONFIRMATION, {
    message: `You must type "${DELETION_CONFIRMATION}" to confirm account deletion`,
  }),
});

export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
