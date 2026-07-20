import { SupabaseClient } from "@supabase/supabase-js";
import { FeaturedBook } from "../domain/entities/FeaturedBook";
import { FeaturedBookRepository } from "../domain/repositories/FeaturedBookRepository";
import { Database } from "../../../shared/core/types/database";

export class SupabaseFeaturedBookRepository implements FeaturedBookRepository {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async list(): Promise<FeaturedBook[]> {
    const { data, error } = await this.client
      .from("featured_books")
      .select("*")
      .order("position");

    if (error || !data) return [];

    return data.map((d) => ({
      book_id: d.book_id,
      position: d.position,
      starts_at: d.starts_at,
      ends_at: d.ends_at,
    }));
  }

  async saveAll(entities: FeaturedBook[]): Promise<void> {
    // Delete all
    await this.client
      .from("featured_books")
      .delete()
      .neq("book_id", "00000000-0000-0000-0000-000000000000"); // hack to delete all

    // Insert new
    if (entities.length > 0) {
      const { error } = await this.client.from("featured_books").insert(
        entities.map((e) => ({
          book_id: e.book_id,
          position: e.position,
          starts_at: e.starts_at,
          ends_at: e.ends_at,
        })),
      );
      if (error)
        throw new Error(`Failed to save featured books: ${error.message}`);
    }
  }
}
