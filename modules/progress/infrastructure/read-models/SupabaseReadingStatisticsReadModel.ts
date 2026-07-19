import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";
import { ReadingStatisticsReadModel } from "../../application/queries/GetReadingStatisticsQuery";
import { ReadingStatisticsDto } from "../../application/queries/GetReadingStatisticsQuery/dto";

export class SupabaseReadingStatisticsReadModel implements ReadingStatisticsReadModel {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getReadingStatistics(userId: string): Promise<ReadingStatisticsDto | null> {
    const { data: analytics, error } = await this.supabase
      .from("analytics_user_daily")
      .select("books_completed, pages_read, reading_time_minutes")
      .eq("user_id", userId);

    if (error || !analytics) {
      return { booksFinished: 0, pagesRead: 0, hoursRead: 0 };
    }

    let booksFinished = 0;
    let pagesRead = 0;
    let minutesRead = 0;

    for (const row of analytics) {
      booksFinished += row.books_completed || 0;
      pagesRead += row.pages_read || 0;
      minutesRead += row.reading_time_minutes || 0;
    }

    return {
      booksFinished,
      pagesRead,
      hoursRead: Math.round((minutesRead / 60) * 10) / 10, // Round to 1 decimal place
    };
  }
}
