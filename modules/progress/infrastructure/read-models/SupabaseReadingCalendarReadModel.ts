import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/modules/shared/core/types/database";
import { ReadingCalendarReadModel } from "../../application/queries/GetReadingCalendarQuery";
import { ReadingCalendarDto } from "../../application/queries/GetReadingCalendarQuery/dto";

export class SupabaseReadingCalendarReadModel implements ReadingCalendarReadModel {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getReadingCalendar(userId: string): Promise<ReadingCalendarDto | null> {
    // Generate dates for the last 7 days
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split("T")[0];
    });

    const { data: analytics, error } = await this.supabase
      .from("analytics_user_daily")
      .select("date, streak_active")
      .eq("user_id", userId)
      .gte("date", days[0])
      .lte("date", days[6]);

    if (error) {
      return { days: days.map(d => ({ date: d, active: false })) };
    }

    const activeMap = new Set(analytics?.filter(a => a.streak_active).map(a => a.date) || []);

    return {
      days: days.map(d => ({
        date: d,
        active: activeMap.has(d),
      }))
    };
  }
}
