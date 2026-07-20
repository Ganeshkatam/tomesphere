import { SupabaseClient } from "@supabase/supabase-js";
import {
  UserAchievementsReadModel,
  UserAchievementDto,
} from "../../application/ports/read-models/UserAchievementsReadModel";

export class SupabaseUserAchievementsReadModel implements UserAchievementsReadModel {
  constructor(private readonly supabase: SupabaseClient) {}

  async getUserAchievements(userId: string): Promise<UserAchievementDto[]> {
    const { data, error } = await this.supabase
      .from("user_achievements")
      .select(
        "earned_at, achievements(id, name, description, badge_icon, points)",
      )
      .eq("user_id", userId);

    if (error || !data) return [];

    return data
      .map((ua: any) => ({
        id: ua.achievements?.id,
        name: ua.achievements?.name,
        description: ua.achievements?.description,
        icon: ua.achievements?.badge_icon || "",
        points: ua.achievements?.points || 0,
        earnedAt: ua.earned_at,
      }))
      .filter((b: any) => b.id);
  }
}
