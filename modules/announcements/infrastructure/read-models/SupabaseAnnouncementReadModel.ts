import { SupabaseClient } from "@supabase/supabase-js";
import { AnnouncementReadModel } from "../../application/ports/read-models/AnnouncementReadModel";
import { AnnouncementDto } from "../../application/dto/AnnouncementDto";

export class SupabaseAnnouncementReadModel implements AnnouncementReadModel {
  constructor(private readonly supabase: SupabaseClient) {}

  async getActiveAnnouncements(): Promise<AnnouncementDto[]> {
    const { data, error } = await this.supabase
      .from("announcements")
      .select("*")
      .eq("is_active", true)
      .lte("starts_at", new Date().toISOString())
      .gte("ends_at", new Date().toISOString())
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch announcements: ${error.message}`);
    }

    return (data || []).map((row) => ({
      id: row.id,
      title: row.title,
      content: row.content,
      type: row.type,
      linkUrl: row.link_url,
      linkText: row.link_text,
      isDismissible: row.is_dismissible,
      startsAt: row.starts_at,
      endsAt: row.ends_at,
    }));
  }
}
