import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";
import { ReadingStreakReadModel } from "../../application/queries/GetReadingStreakQuery";
import { ReadingStreakDto } from "../../application/queries/GetReadingStreakQuery/dto";

export class SupabaseReadingStreakReadModel implements ReadingStreakReadModel {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getReadingStreak(userId: string): Promise<ReadingStreakDto | null> {
    const { data: stats, error } = await this.supabase
      .from("user_statistics")
      .select("current_streak, longest_streak")
      .eq("user_id", userId)
      .maybeSingle();

    return {
      currentStreakDays: stats?.current_streak || 0,
      longestStreakDays: stats?.longest_streak || 0,
    };
  }
}
