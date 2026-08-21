import { UserId } from "@/shared/kernel/UserId";
import { NotificationPreferences } from "../entities/NotificationPreferences";

export interface NotificationPreferencesRepository {
  findByUserId(userId: UserId): Promise<NotificationPreferences | null>;
  save(preferences: NotificationPreferences): Promise<void>;
  updateToggle(
    userId: UserId,
    field: "readingRemindersEnabled" | "recommendationsEnabled" | "weeklyDigestEnabled" | "systemAnnouncementsEnabled",
    value: boolean
  ): Promise<void>;
}
