import { SupabaseClient } from "@supabase/supabase-js";
import { AnnouncementReadModel } from "../../application/ports/read-models/AnnouncementReadModel";
import { AnnouncementDto } from "../../application/dto/AnnouncementDto";

export class SupabaseAnnouncementReadModel implements AnnouncementReadModel {
  constructor(private readonly supabase: SupabaseClient) {}

  async getActiveAnnouncements(): Promise<AnnouncementDto[]> {
    try {
      const nowIso = new Date().toISOString();
      const { data, error } = await this.supabase
        .from("announcements")
        .select("*")
        .eq("is_active", true)
        .lte("starts_at", nowIso)
        .or(`ends_at.is.null,ends_at.gte.${nowIso}`)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch announcements:", error.message);
        return [];
      }

      return (data || []).map((row) => ({
        id: row.id,
        title: row.title,
        content: row.content,
        type: row.type as AnnouncementDto["type"],
        linkUrl: row.link_url || undefined,
        linkText: row.link_text || undefined,
        isDismissible: row.is_dismissible ?? true,
        startsAt: row.starts_at,
        endsAt: row.ends_at,
      }));
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
      return [];
    }
  }
}
