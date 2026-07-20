import { SupabaseClient } from "@supabase/supabase-js";
import { Genre } from "../domain/entities/Genre";
import { GenreRepository } from "../domain/repositories/GenreRepository";
import { Database } from "../../../shared/core/types/database";

export class SupabaseGenreRepository implements GenreRepository {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async findById(id: string): Promise<Genre | null> {
    const { data, error } = await this.client
      .from("genres")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description ?? undefined,
      icon: data.icon ?? undefined,
    };
  }

  async save(entity: Genre): Promise<void> {
    const payload: any = {
      id: entity.id,
      name: entity.name,
      slug: entity.slug,
      description: entity.description,
      updated_at: new Date().toISOString(),
    };
    payload.icon = entity.icon;

    const { error } = await this.client.from("genres").upsert(payload);

    if (error) throw new Error(`Failed to save genre: ${error.message}`);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client.from("genres").delete().eq("id", id);

    if (error) throw new Error(`Failed to delete genre: ${error.message}`);
  }
}
