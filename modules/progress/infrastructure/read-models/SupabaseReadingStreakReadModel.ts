import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/modules/shared/core/types/database";
import { ReadingStreakReadModel } from "../../application/queries/GetReadingStreakQuery";
import { ReadingStreakDto } from "../../application/queries/GetReadingStreakQuery/dto";

export class SupabaseReadingStreakReadModel implements ReadingStreakReadModel {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getReadingStreak(userId: string): Promise<ReadingStreakDto | null> {
    const { data: progress, error } = await this.supabase
      .from("user_progress")
      .select("reading_streak_days")
      .eq("user_id", userId)
      .maybeSingle();

    // Since we don't have longest_streak in schema currently, we'll default it to current
    const currentStreakDays = progress?.reading_streak_days || 0;
    
    return {
      currentStreakDays,
      longestStreakDays: currentStreakDays, // Placeholder until schema update
    };
  }
}
