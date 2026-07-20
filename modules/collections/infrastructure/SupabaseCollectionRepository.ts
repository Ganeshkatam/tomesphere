import { SupabaseClient } from "@supabase/supabase-js";
import { Collection } from "../domain/entities/Collection";
import { CollectionRepository } from "../domain/repositories/CollectionRepository";
import { Database } from "../../../shared/core/types/database";

export class SupabaseCollectionRepository implements CollectionRepository {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async findById(id: string): Promise<Collection | null> {
    const { data, error } = await this.client
      .from("collections")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      description: data.description,
      cover_url: data.cover_url,
      is_active: data.is_active,
    };
  }

  async list(): Promise<Collection[]> {
    const { data, error } = await this.client
      .from("collections")
      .select("*")
      .order("title");

    if (error || !data) return [];

    return data.map((d) => ({
      id: d.id,
      title: d.title,
      slug: d.slug,
      description: d.description,
      cover_url: d.cover_url,
      is_active: d.is_active,
    }));
  }

  async save(entity: Collection): Promise<void> {
    const payload = {
      id: entity.id,
      title: entity.title,
      slug: entity.slug,
      description: entity.description,
      cover_url: entity.cover_url,
      is_active: entity.is_active,
      updated_at: new Date().toISOString(),
    };

    const { error } = await this.client.from("collections").upsert(payload);

    if (error) throw new Error(`Failed to save collection: ${error.message}`);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client
      .from("collections")
      .delete()
      .eq("id", id);

    if (error) throw new Error(`Failed to delete collection: ${error.message}`);
  }

  async updateBooks(collectionId: string, bookIds: string[]): Promise<void> {
    // Delete existing
    await this.client
      .from("collection_books")
      .delete()
      .eq("collection_id", collectionId);

    // Insert new
    if (bookIds.length > 0) {
      const payload = bookIds.map((book_id, index) => ({
        collection_id: collectionId,
        book_id,
        position: index,
      }));
      await this.client.from("collection_books").insert(payload);
    }
  }
}
