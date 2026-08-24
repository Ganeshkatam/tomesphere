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

    // 4. Book Completed
    this.eventBus.subscribe("reader.book.completed", async (payload) => {
      try {
        await WorkerDatabaseClient.query(
          `INSERT INTO public.notifications (
            user_id, event_name, aggregate_id, aggregate_type, type, title, body, metadata
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT DO NOTHING;`,
          [
            payload.userId,
            "reader.book.completed",
            payload.bookId,
            "book",
            "SUCCESS",
            "Book Completed",
            "You finished a book. Great work!",
            JSON.stringify({ bookId: payload.bookId }),
          ]
        );
      } catch (error) {
        console.error("[NotificationEventHandlers] Failed to create book completed notification:", error);
      }
    });

    // 5. Account Export Requested
    this.eventBus.subscribe("account.export.requested", async (payload) => {
      try {
        await WorkerDatabaseClient.query(
          `INSERT INTO public.notifications (
            user_id, event_name, aggregate_id, aggregate_type, type, title, body, metadata
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT DO NOTHING;`,
          [
            payload.userId,
            "account.export.requested",
            payload.exportRequestId,
            "export_request",
            "INFO",
            "Export Requested",
            "Your data export is being prepared.",
            JSON.stringify({ exportRequestId: payload.exportRequestId }),
          ]
        );
      } catch (error) {
        console.error("[NotificationEventHandlers] Failed to create export requested notification:", error);
      }
    });

    // 6. Book Added to Library
    this.eventBus.subscribe("library.book.added", async (payload) => {
      try {
        await WorkerDatabaseClient.query(
          `INSERT INTO public.notifications (
            user_id, event_name, aggregate_id, aggregate_type, type, title, body, metadata
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT DO NOTHING;`,
          [
            payload.userId,
            "library.book.added",
            payload.bookId,
            "library_book",
            "INFO",
            "Added to Library",
            "A new book has been added to your library.",
            JSON.stringify({ bookId: payload.bookId, status: payload.status }),
          ]
        );
      } catch (error) {
        console.error("[NotificationEventHandlers] Failed to create library book notification:", error);
      }
    });
  }
}
