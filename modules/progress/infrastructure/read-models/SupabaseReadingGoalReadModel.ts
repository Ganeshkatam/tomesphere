import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";
import { ReadingGoalReadModel } from "../../application/queries/GetReadingGoalQuery";
import { GoalProgressDto } from "../../application/queries/GetReadingGoalQuery/dto";

export class SupabaseReadingGoalReadModel implements ReadingGoalReadModel {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getGoalProgress(userId: string): Promise<GoalProgressDto | null> {
    const today = new Date().toISOString().split("T")[0];

    // Daily analytics is deferred to V2. We'll stub this for V1.
    const targetValue = 50;
    const currentValue = 0;

    return {
      hasGoal: true, // Assuming default goal if none set
      type: "pages",
      currentValue,
      targetValue,
      percentage: Math.min(100, Math.round((currentValue / targetValue) * 100)),
    };
  }
}
