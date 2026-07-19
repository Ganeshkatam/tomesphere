import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";
import { RecentActivityReadModel } from "../../application/queries/GetRecentActivityQuery";
import { RecentActivityDto, ActivityEventType, RecentActivityEventDto } from "../../application/queries/GetRecentActivityQuery/dto";

export class SupabaseRecentActivityReadModel implements RecentActivityReadModel {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getRecentActivity(userId: string): Promise<RecentActivityDto | null> {
    const { data: activityLog, error } = await this.supabase
      .from("activity_log")
      .select("id, action_type, created_at, metadata, book_id, books(title, cover_url)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error || !activityLog || activityLog.length === 0) {
      return { events: [] };
    }

    const events: RecentActivityEventDto[] = activityLog.map((log) => {
      const bookData = Array.isArray(log.books) ? log.books[0] : log.books;
      let type: ActivityEventType = "STARTED";
      let description = "Performed an action";

      switch (log.action_type) {
        case "book_started":
          type = "STARTED";
          description = `Started reading ${bookData?.title || "a book"}`;
          break;
        case "book_finished":
          type = "FINISHED";
          description = `Finished reading ${bookData?.title || "a book"}`;
          break;
        case "bookmark_created":
          type = "BOOKMARK_CREATED";
          description = `Created a bookmark in ${bookData?.title || "a book"}`;
          break;
        case "highlight_created":
          type = "HIGHLIGHT_CREATED";
          description = `Highlighted a section in ${bookData?.title || "a book"}`;
          break;
        case "added_to_library":
          type = "ADDED_TO_LIBRARY";
          description = `Added ${bookData?.title || "a book"} to library`;
          break;
        case "goal_completed":
          type = "GOAL_COMPLETED";
          description = `Completed a reading goal`;
          break;
        default:
          type = "STARTED"; // Fallback
          description = `Action: ${log.action_type}`;
      }

      return {
        id: log.id,
        type,
        description,
        timestamp: log.created_at || new Date().toISOString(),
        bookId: log.book_id || undefined,
        coverUrl: bookData?.cover_url || undefined,
      };
    });

    return { events };
  }
}
