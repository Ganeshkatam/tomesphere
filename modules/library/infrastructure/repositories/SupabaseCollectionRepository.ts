import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";
import { CollectionRepository } from "../../domain/repositories/CollectionRepository";
import { CollectionDto } from "../../application/dto/response/CollectionDto";

export class SupabaseCollectionRepository implements CollectionRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getCollections(userId: string): Promise<CollectionDto[]> {
    const { data, error } = await this.supabase
      .from("shelves")
      .select(`
        *,
        shelf_items (count)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data.map((row: any) => this.mapToDto(row));
  }

  async getCollection(id: string, userId: string): Promise<CollectionDto | null> {
    const { data, error } = await this.supabase
      .from("shelves")
      .select(`
        *,
        shelf_items (count)
      `)
      .match({ id, user_id: userId })
      .single();

    if (error || !data) return null;

    return this.mapToDto(data);
  }

  async createCollection(userId: string, data: { name: string; description?: string; isPublic?: boolean }): Promise<CollectionDto> {
    const { data: result, error } = await this.supabase
      .from("shelves")
      .insert({
        user_id: userId,
        name: data.name,
        description: data.description,
        is_public: data.isPublic ?? false,
      })
      .select(`
        *,
        shelf_items (count)
      `)
      .single();

    if (error || !result) {
      throw new Error(`Failed to create collection: ${error?.message}`);
    }

    return this.mapToDto(result);
  }

  async updateCollection(id: string, userId: string, data: { name?: string; description?: string; isPublic?: boolean }): Promise<CollectionDto | null> {
    const updates: any = {};
    if (data.name !== undefined) updates.name = data.name;
    if (data.description !== undefined) updates.description = data.description;
    if (data.isPublic !== undefined) updates.is_public = data.isPublic;

    const { data: result, error } = await this.supabase
      .from("shelves")
      .update(updates)
      .match({ id, user_id: userId })
      .select(`
        *,
        shelf_items (count)
      `)
      .single();

    if (error || !result) return null;

    return this.mapToDto(result);
  }

  async deleteCollection(id: string, userId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from("shelves")
      .delete()
      .match({ id, user_id: userId });

    return !error;
  }

  private mapToDto(row: any): CollectionDto {
    const itemCount = row.shelf_items?.[0]?.count ?? 0;
    return {
      id: row.id,
      name: row.name,
      description: row.description || undefined,
      coverImage: row.cover_image || undefined,
      isPublic: row.is_public ?? false,
      createdAt: row.created_at || new Date().toISOString(),
      updatedAt: row.updated_at || new Date().toISOString(),
      itemCount,
    };
  }
}
