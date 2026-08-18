import { IEventBus } from "@/shared/core/events/types";
import { WorkerDatabaseClient } from "@/shared/infrastructure/database/WorkerDatabaseClient";

export class NotificationEventHandlers {
  constructor(private eventBus: IEventBus) {}

  public register(): void {
    // 1. Account Export Completed
    this.eventBus.subscribe("account.export.completed", async (payload) => {
      try {
        await WorkerDatabaseClient.query(
          `INSERT INTO public.notifications (
            user_id, event_name, aggregate_id, aggregate_type, type, title, body, metadata
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT DO NOTHING;`,
          [
            payload.userId,
            "account.export.completed",
            payload.exportRequestId,
            "export_request",
            "SUCCESS",
            "Your data export is ready",
            "You can now download your exported data.",
            JSON.stringify({ downloadUrl: payload.downloadUrl }),
          ]
        );
      } catch (error) {
        console.error("[NotificationEventHandlers] Failed to create export notification:", error);
      }
    });

    // 2. Progress Level Up
    this.eventBus.subscribe("progress.level.up", async (payload) => {
      try {
        await WorkerDatabaseClient.query(
          `INSERT INTO public.notifications (
            user_id, event_name, aggregate_id, aggregate_type, type, title, body, metadata
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT DO NOTHING;`,
          [
            payload.userId,
            "progress.level.up",
            payload.level.toString(),
            "level",
            "SUCCESS",
            "Level Up!",
            `Congratulations, you've reached level ${payload.level}: ${payload.title}!`,
            JSON.stringify({ level: payload.level, title: payload.title }),
          ]
        );
      } catch (error) {
        console.error("[NotificationEventHandlers] Failed to create level up notification:", error);
      }
    });

    // 3. Achievement Unlocked
    this.eventBus.subscribe("progress.achievement.unlocked", async (payload) => {
      try {
        await WorkerDatabaseClient.query(
          `INSERT INTO public.notifications (
            user_id, event_name, aggregate_id, aggregate_type, type, title, body, metadata
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT DO NOTHING;`,
          [
            payload.userId,
            "progress.achievement.unlocked",
            payload.achievementId,
            "achievement",
            "SUCCESS",
            "Achievement Unlocked",
            "You have unlocked a new achievement! Check your learning space.",
            JSON.stringify({ achievementId: payload.achievementId }),
          ]
        );
      } catch (error) {
        console.error("[NotificationEventHandlers] Failed to create achievement notification:", error);
      }
    });
  }
}
