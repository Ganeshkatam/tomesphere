import { SupabaseClient } from "@supabase/supabase-js";
import { Subject } from "../domain/entities/Subject";
import { SubjectRepository } from "../domain/repositories/SubjectRepository";
import { Database } from "../../../shared/core/types/database";

export class SupabaseSubjectRepository implements SubjectRepository {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async findById(id: string): Promise<Subject | null> {
    const { data, error } = await this.client
      .from("subjects")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description ?? undefined,
    };
  }

  async save(entity: Subject): Promise<void> {
    const payload: any = {
      id: entity.id,
      name: entity.name,
      slug: entity.slug,
      description: entity.description,
      updated_at: new Date().toISOString(),
    };

    const { error } = await this.client.from("subjects").upsert(payload);

    if (error) throw new Error(`Failed to save subject: ${error.message}`);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client.from("subjects").delete().eq("id", id);

    if (error) throw new Error(`Failed to delete subject: ${error.message}`);
  }
}
