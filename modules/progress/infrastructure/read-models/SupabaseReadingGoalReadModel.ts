import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";
import { ReadingGoalReadModel } from "../../application/queries/GetReadingGoalQuery";
import { GoalProgressDto } from "../../application/queries/GetReadingGoalQuery/dto";

export class SupabaseReadingGoalReadModel implements ReadingGoalReadModel {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getGoalProgress(userId: string): Promise<GoalProgressDto | null> {
    const today = new Date().toISOString().split("T")[0];
    
    // Attempt to get from analytics_user_daily
    const { data: dailyStats, error: statsError } = await this.supabase
      .from("analytics_user_daily")
      .select("pages_read, reading_time_minutes, books_completed")
      .eq("user_id", userId)
      .eq("date", today)
      .maybeSingle();

    // Default to a pages goal for V1 if we don't have custom goals in schema
    const targetValue = 50; // Default 50 pages per day
    const currentValue = dailyStats?.pages_read || 0;
    
    return {
      hasGoal: true, // Assuming default goal if none set
      type: "pages",
      currentValue,
      targetValue,
      percentage: Math.min(100, Math.round((currentValue / targetValue) * 100))
    };
  }
}
