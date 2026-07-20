import { SupabaseClient } from "@supabase/supabase-js";
import { Author } from "../domain/entities/Author";
import { AuthorRepository } from "../domain/repositories/AuthorRepository";
import { Database } from "../../../shared/core/types/database";

export class SupabaseAuthorRepository implements AuthorRepository {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async findById(id: string): Promise<Author | null> {
    const { data, error } = await this.client
      .from("authors")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      bio: data.bio ?? undefined,
      avatar_url: data.avatar_url ?? undefined,
    };
  }

  async save(author: Author): Promise<void> {
    const { error } = await this.client.from("authors").upsert({
      id: author.id,
      name: author.name,
      slug: author.slug,
      bio: author.bio,
      avatar_url: author.avatar_url,
      updated_at: new Date().toISOString(),
    });

    if (error) throw new Error(`Failed to save author: ${error.message}`);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client.from("authors").delete().eq("id", id);

    if (error) throw new Error(`Failed to delete author: ${error.message}`);
  }
}
