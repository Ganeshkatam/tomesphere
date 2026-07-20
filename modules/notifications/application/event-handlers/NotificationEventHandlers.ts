import { IEventBus } from "@/shared/core/events/types";
import { createSupabaseAdminClient } from "@/shared/core/database/admin";

export class NotificationEventHandlers {
  constructor(private eventBus: IEventBus) {}

  public register(): void {
    // 1. Account Export Completed
    this.eventBus.subscribe("account.export.completed", async (payload) => {
      const supabase = createSupabaseAdminClient();
      
      const { error } = await supabase
        .from("notifications")
        .insert({
          user_id: payload.userId,
          event_name: "account.export.completed",
          aggregate_id: payload.exportRequestId,
          aggregate_type: "export_request",
          type: "SUCCESS",
          title: "Your data export is ready",
          body: "You can now download your exported data.",
          metadata: { downloadUrl: payload.downloadUrl }
        });

      if (error && error.code !== "23505") { // Ignore unique constraint violations (idempotency)
        console.error("[NotificationEventHandlers] Failed to create export notification:", error);
      }
    });

    // 2. Progress Level Up
    this.eventBus.subscribe("progress.level.up", async (payload) => {
      const supabase = createSupabaseAdminClient();
      
      const { error } = await supabase
        .from("notifications")
        .insert({
          user_id: payload.userId,
          event_name: "progress.level.up",
          aggregate_id: payload.level.toString(), // The level itself acts as the aggregate identity here
          aggregate_type: "level",
          type: "SUCCESS",
          title: "Level Up!",
          body: `Congratulations, you've reached level ${payload.level}: ${payload.title}!`,
          metadata: { level: payload.level, title: payload.title }
        });

      if (error && error.code !== "23505") {
        console.error("[NotificationEventHandlers] Failed to create level up notification:", error);
      }
    });

    // 3. Achievement Unlocked
    this.eventBus.subscribe("progress.achievement.unlocked", async (payload) => {
      const supabase = createSupabaseAdminClient();
      
      const { error } = await supabase
        .from("notifications")
        .insert({
          user_id: payload.userId,
          event_name: "progress.achievement.unlocked",
          aggregate_id: payload.achievementId,
          aggregate_type: "achievement",
          type: "SUCCESS",
          title: "Achievement Unlocked",
          body: "You have unlocked a new achievement! Check your learning space.",
          metadata: { achievementId: payload.achievementId }
        });

      if (error && error.code !== "23505") {
        console.error("[NotificationEventHandlers] Failed to create achievement notification:", error);
      }
    });
  }
}
