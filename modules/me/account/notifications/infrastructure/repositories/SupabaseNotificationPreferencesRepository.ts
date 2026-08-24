import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";
import { UserId } from "@/shared/kernel/UserId";
import { NotificationPreferences } from "../../domain/entities/NotificationPreferences";
import { NotificationPreferencesRepository } from "../../domain/repositories/NotificationPreferencesRepository";

export class SupabaseNotificationPreferencesRepository
  implements NotificationPreferencesRepository
{
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async findByUserId(userId: UserId): Promise<NotificationPreferences | null> {
    const { data, error } = await this.supabase
      .from("user_notification_preferences")
      .select("*")
      .eq("user_id", userId.value)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch notification preferences: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return {
      userId: UserId.create(data.user_id),
      readingRemindersEnabled: data.reading_reminders_enabled,
      recommendationsEnabled: data.recommendations_enabled,
      weeklyDigestEnabled: data.weekly_digest_enabled,
      systemAnnouncementsEnabled: data.system_announcements_enabled,
      emailAlertsEnabled: data.email_alerts_enabled,
      pushNotificationsEnabled: data.push_notifications_enabled,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  async save(preferences: NotificationPreferences): Promise<void> {
    const { error } = await this.supabase
      .from("user_notification_preferences")
      .upsert({
        user_id: preferences.userId.value,
        reading_reminders_enabled: preferences.readingRemindersEnabled,
        recommendations_enabled: preferences.recommendationsEnabled,
        weekly_digest_enabled: preferences.weeklyDigestEnabled,
        system_announcements_enabled: preferences.systemAnnouncementsEnabled,
        email_alerts_enabled: preferences.emailAlertsEnabled,
        push_notifications_enabled: preferences.pushNotificationsEnabled,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      throw new Error(`Failed to save notification preferences: ${error.message}`);
    }
  }

  async updateToggle(
    userId: UserId,
    field: "readingRemindersEnabled" | "recommendationsEnabled" | "weeklyDigestEnabled" | "systemAnnouncementsEnabled" | "emailAlertsEnabled" | "pushNotificationsEnabled",
    value: boolean
  ): Promise<void> {
    const payload: Database["public"]["Tables"]["user_notification_preferences"]["Insert"] = {
      user_id: userId.value,
      updated_at: new Date().toISOString(),
    };

    if (field === "readingRemindersEnabled") {
      payload.reading_reminders_enabled = value;
    } else if (field === "recommendationsEnabled") {
      payload.recommendations_enabled = value;
    } else if (field === "weeklyDigestEnabled") {
      payload.weekly_digest_enabled = value;
    } else if (field === "systemAnnouncementsEnabled") {
      payload.system_announcements_enabled = value;
    } else if (field === "emailAlertsEnabled") {
      payload.email_alerts_enabled = value;
    } else if (field === "pushNotificationsEnabled") {
      payload.push_notifications_enabled = value;
    }

    const { error } = await this.supabase
      .from("user_notification_preferences")
      .upsert(payload, { onConflict: "user_id" });

    if (error) {
      throw new Error(`Failed to update notification toggle: ${error.message}`);
    }
  }
}
