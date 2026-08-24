import { UserId } from "@/shared/kernel/UserId";

export interface NotificationPreferences {
  userId: UserId;
  readingRemindersEnabled: boolean;
  recommendationsEnabled: boolean;
  weeklyDigestEnabled: boolean;
  systemAnnouncementsEnabled: boolean;
  emailAlertsEnabled: boolean;
  pushNotificationsEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}
