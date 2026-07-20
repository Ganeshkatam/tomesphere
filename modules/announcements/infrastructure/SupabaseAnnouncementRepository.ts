import { SupabaseClient } from "@supabase/supabase-js";
import { Announcement } from "../domain/entities/Announcement";
import { AnnouncementRepository } from "../domain/repositories/AnnouncementRepository";
import { Database } from "../../../shared/core/types/database";

export class SupabaseAnnouncementRepository implements AnnouncementRepository {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async findById(id: string): Promise<Announcement | null> {
    const { data, error } = await this.client
      .from("announcements")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      title: data.title,
      content: data.content,
      type: data.type,
      link_url: data.link_url,
      link_text: data.link_text,
      is_dismissible: data.is_dismissible ?? false,
      is_active: data.is_active ?? false,
      starts_at: data.starts_at,
      ends_at: data.ends_at,
    };
  }

  async list(): Promise<Announcement[]> {
    const { data, error } = await this.client
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data.map((d: any) => ({
      id: d.id,
      title: d.title,
      content: d.content,
      type: d.type,
      link_url: d.link_url,
      link_text: d.link_text,
      is_dismissible: d.is_dismissible,
      is_active: d.is_active,
      starts_at: d.starts_at,
      ends_at: d.ends_at,
    }));
  }

  async save(entity: Announcement): Promise<void> {
    const payload = {
      id: entity.id,
      title: entity.title,
      content: entity.content,
      type: entity.type,
      link_url: entity.link_url,
      link_text: entity.link_text,
      is_dismissible: entity.is_dismissible,
      is_active: entity.is_active,
      starts_at: entity.starts_at || null,
      ends_at: entity.ends_at || null,
      updated_at: new Date().toISOString(),
    } as any;

    const { error } = await this.client.from("announcements").upsert(payload);

    if (error) throw new Error(`Failed to save announcement: ${error.message}`);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client
      .from("announcements")
      .delete()
      .eq("id", id);

    if (error)
      throw new Error(`Failed to delete announcement: ${error.message}`);
  }
}
