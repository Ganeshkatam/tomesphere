import { UserId } from "@/shared/kernel/UserId";

export interface INotificationPreferences {
  userId: UserId;
  readingRemindersEnabled: boolean;
  recommendationsEnabled: boolean;
  weeklyDigestEnabled: boolean;
  systemAnnouncementsEnabled: boolean;
}

export interface INotificationPreferencesRepository {
  findByUserId(userId: UserId): Promise<INotificationPreferences | null>;
  save(preferences: INotificationPreferences): Promise<void>;
  updateToggle(
    userId: UserId,
    field:
      | "readingRemindersEnabled"
      | "recommendationsEnabled"
      | "weeklyDigestEnabled"
      | "systemAnnouncementsEnabled",
    value: boolean
  ): Promise<void>;
}
