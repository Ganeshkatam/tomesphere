import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";
import { ReadingStatisticsReadModel } from "../../application/queries/GetReadingStatisticsQuery";
import { ReadingStatisticsDto } from "../../application/queries/GetReadingStatisticsQuery/dto";

export class SupabaseReadingStatisticsReadModel implements ReadingStatisticsReadModel {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getReadingStatistics(
    userId: string,
  ): Promise<ReadingStatisticsDto | null> {
    const { data: stats, error } = await this.supabase
      .from("user_statistics")
      .select("books_completed, pages_read, minutes_read")
      .eq("user_id", userId)
      .maybeSingle();

    if (error || !stats) {
      return { booksFinished: 0, pagesRead: 0, hoursRead: 0 };
    }

    return {
      booksFinished: stats.books_completed || 0,
      pagesRead: stats.pages_read || 0,
      hoursRead: Math.round(((stats.minutes_read || 0) / 60) * 10) / 10,
    };
  }
}
