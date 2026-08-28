"use server";

import { z } from "zod";
import { ServerActionResult } from "@/lib/actions/action-result";
import { createSupabaseServerClient } from "@/shared/core/database/server";
import { requireAuth } from "@/modules/security/application/requireAuth";
import { SupabaseNotificationPreferencesRepository } from "../../infrastructure/repositories/SupabaseNotificationPreferencesRepository";
import { NotificationPreferences } from "../../domain/entities/NotificationPreferences";
import { UserId } from "@/shared/kernel/UserId";
import { revalidatePath } from "next/cache";

const ToggleFieldSchema = z.enum([
  "readingRemindersEnabled",
  "recommendationsEnabled",
  "weeklyDigestEnabled",
  "systemAnnouncementsEnabled",
  "emailAlertsEnabled",
  "pushNotificationsEnabled",
]);

const ToggleUpdateSchema = z.object({
  field: ToggleFieldSchema,
  value: z.boolean(),
});

export type ToggleUpdateInput = z.infer<typeof ToggleUpdateSchema>;

export interface NotificationPreferencesDto {
  userId: string;
  readingRemindersEnabled: boolean;
  recommendationsEnabled: boolean;
  weeklyDigestEnabled: boolean;
  systemAnnouncementsEnabled: boolean;
  emailAlertsEnabled: boolean;
  pushNotificationsEnabled: boolean;
  updatedAt: string;
}

export async function updateNotificationToggleAction(
  input: ToggleUpdateInput,
): Promise<ServerActionResult<void>> {
  try {
    const user = await requireAuth();
    const validated = ToggleUpdateSchema.parse(input);
    const supabase = await createSupabaseServerClient();
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

export async function getNotificationPreferencesAction(): Promise<
  ServerActionResult<NotificationPreferencesDto>
> {
  try {
    const user = await requireAuth();
    const supabase = await createSupabaseServerClient();
    const repo = new SupabaseNotificationPreferencesRepository(supabase);
    const userId = UserId.create(user.id);

    let prefs = await repo.findByUserId(userId);
    if (!prefs) {
      // Default preferences
      prefs = {
        userId,
        readingRemindersEnabled: true,
        recommendationsEnabled: true,
        weeklyDigestEnabled: true,
        systemAnnouncementsEnabled: true,
        emailAlertsEnabled: true,
        pushNotificationsEnabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    return {
      success: true,
      data: {
        userId: prefs.userId.value,
        readingRemindersEnabled: prefs.readingRemindersEnabled,
        recommendationsEnabled: prefs.recommendationsEnabled,
        weeklyDigestEnabled: prefs.weeklyDigestEnabled,
        systemAnnouncementsEnabled: prefs.systemAnnouncementsEnabled,
        emailAlertsEnabled: prefs.emailAlertsEnabled,
        pushNotificationsEnabled: prefs.pushNotificationsEnabled,
        updatedAt: prefs.updatedAt.toISOString(),
      },
    };
  } catch (error: any) {
    return { success: false, error: { message: error.message || "Failed to fetch notification preferences." } };
  }
}
