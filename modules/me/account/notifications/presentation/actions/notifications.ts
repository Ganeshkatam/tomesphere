"use server";

import { z } from "zod";
import { ServerActionResult } from "@/lib/actions/action-result";
import { createSupabaseServerClient } from "@/shared/core/database/server";
import { SupabaseNotificationPreferencesRepository } from "../../infrastructure/repositories/SupabaseNotificationPreferencesRepository";
import { UserId } from "@/shared/kernel/UserId";
import { revalidatePath } from "next/cache";

const ToggleFieldSchema = z.enum([
  "readingRemindersEnabled",
  "recommendationsEnabled",
  "weeklyDigestEnabled",
  "systemAnnouncementsEnabled",
]);

const ToggleUpdateSchema = z.object({
  field: ToggleFieldSchema,
  value: z.boolean(),
});

export type ToggleUpdateInput = z.infer<typeof ToggleUpdateSchema>;

export async function updateNotificationToggleAction(
  input: ToggleUpdateInput
): Promise<ServerActionResult<void>> {
  try {
    const validated = ToggleUpdateSchema.parse(input);

    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: { message: "Unauthorized. Please log in." } };
    }

    const repo = new SupabaseNotificationPreferencesRepository(supabase);
    const userId = UserId.create(user.id);

    await repo.updateToggle(userId, validated.field, validated.value);

    revalidatePath("/me/account/notifications");

    return { success: true, data: undefined };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, error: { message: "Invalid toggle parameter." } };
    }
    return { success: false, error: { message: error.message || "Failed to update notification setting." } };
  }
}
