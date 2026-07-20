import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";
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

    // Daily analytics is deferred to V2. Stubbing for now.
    const activeMap = new Set<string>();

    return {
      days: days.map((d) => ({
        date: d,
        active: activeMap.has(d),
      })),
    };
  }
}
