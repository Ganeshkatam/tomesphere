import { ReadingActivityRepository } from "../../domain/repositories/ReadingActivityRepository";
import { ActivityLog } from "../../domain/entities/ActivityLog";
import { ReadingStreak } from "../../domain/entities/ReadingStreak";
import { SupabaseClient } from "@supabase/supabase-js";

export class SupabaseReadingActivityRepository implements ReadingActivityRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async logActivity(activity: ActivityLog): Promise<void> {
    const { error } = await this.supabase.from("activity_log").insert({
      id: activity.id,
      user_id: activity.userId,
      action_type: "read", // General reading activity
      created_at: activity.date.toISOString(), // We use the activity date for created_at
    });

    if (error) {
      console.error("Error logging activity:", error);
    }
  }

  async getStreak(userId: string): Promise<ReadingStreak> {
    const { data, error } = await this.supabase
      .from("activity_log")
      .select("created_at")
      .eq("user_id", userId)
      .eq("action_type", "read") // Only count reading actions
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return ReadingStreak.create("new-streak", {
        userId,
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: null,
        totalDaysActive: 0,
      });
    }

    // Calculate streak from dates
    const dates = data
      .map((d: any) => new Date(d.created_at).toISOString().split("T")[0])
      .sort()
      .reverse();
    
    // Remove duplicates
    const uniqueDates = [...new Set(dates)];

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const current = new Date(uniqueDates[i]);
      const next = new Date(uniqueDates[i + 1]);
      const diffDays = Math.floor((current.getTime() - next.getTime()) / 86400000);

      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }

    longestStreak = Math.max(longestStreak, tempStreak);

    // Check if streak is current
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
      currentStreak = tempStreak;
    }

    return ReadingStreak.create("streak-" + userId, {
      userId,
      currentStreak,
      longestStreak,
      lastActivityDate: new Date(uniqueDates[0]),
      totalDaysActive: uniqueDates.length,
    });
  }
}
