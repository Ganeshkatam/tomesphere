import { SupabaseClient } from "@supabase/supabase-js";
import { NotificationReadModel } from "../../application/queries/GetUnreadNotificationCountQuery/handler";

export class SupabaseNotificationReadModel implements NotificationReadModel {
  constructor(private readonly supabase: SupabaseClient) {}

  async getUnreadCount(userId: string): Promise<number> {
    const { count } = await this.supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("read", false);
    return count || 0;
  }
}
