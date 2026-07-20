import { SupabaseClient } from "@supabase/supabase-js";
import { Language } from "../domain/entities/Language";
import { LanguageRepository } from "../domain/repositories/LanguageRepository";
import { Database } from "../../../shared/core/types/database";

export class SupabaseLanguageRepository implements LanguageRepository {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async findById(id: string): Promise<Language | null> {
    const { data, error } = await this.client
      .from("languages")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      code: data.code,
      name: data.name,
      native_name: data.native_name,
      is_active: data.is_active,
    };
  }

  async findByCode(code: string): Promise<Language | null> {
    const { data, error } = await this.client
      .from("languages")
      .select("*")
      .eq("code", code)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      code: data.code,
      name: data.name,
      native_name: data.native_name,
      is_active: data.is_active,
    };
  }

  async list(): Promise<Language[]> {
    const { data, error } = await this.client
      .from("languages")
      .select("*")
      .order("name");

    if (error || !data) return [];

    return data.map((d) => ({
      id: d.id,
      code: d.code,
      name: d.name,
      native_name: d.native_name,
      is_active: d.is_active,
    }));
  }

  async save(entity: Language): Promise<void> {
    const payload = {
      id: entity.id,
      code: entity.code,
      name: entity.name,
      native_name: entity.native_name,
      is_active: entity.is_active,
      updated_at: new Date().toISOString(),
    };

    const { error } = await this.client.from("languages").upsert(payload);

    if (error) throw new Error(`Failed to save language: ${error.message}`);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client.from("languages").delete().eq("id", id);

    if (error) throw new Error(`Failed to delete language: ${error.message}`);
  }
}
