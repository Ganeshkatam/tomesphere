import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";
import { RecentActivityReadModel } from "../../application/queries/GetRecentActivityQuery";
import {
  RecentActivityDto,
  ActivityEventType,
  RecentActivityEventDto,
} from "../../application/queries/GetRecentActivityQuery/dto";

export class SupabaseRecentActivityReadModel implements RecentActivityReadModel {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getRecentActivity(userId: string): Promise<RecentActivityDto | null> {
    return { events: [] };
  }
}
