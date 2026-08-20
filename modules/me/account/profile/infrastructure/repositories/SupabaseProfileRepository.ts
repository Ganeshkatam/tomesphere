import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";
import { UserId } from "@/shared/kernel/UserId";
import { Profile } from "../../domain/entities/Profile";
import { ProfileRepository } from "../../domain/repositories/ProfileRepository";

export class SupabaseProfileRepository implements ProfileRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  async findById(id: UserId): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from("profiles")
      .select("*")
      .eq("id", id.value)
      .single();

    if (error || !data) {
      if (error?.code === "PGRST116") return null; // Not found
      throw new Error(`Failed to find profile: ${error?.message}`);
    }

    return {
      id: UserId.create(data.id),
      displayName: data.display_name || "",
      bio: data.bio,
      location: data.location,
      avatarUrl: data.avatar_url,
      createdAt: data.created_at ? new Date(data.created_at) : new Date(),
      updatedAt: data.updated_at ? new Date(data.updated_at) : new Date(),
    };
  }

  async save(profile: Profile): Promise<void> {
    const { error } = await this.supabase
      .from("profiles")
      .update({
        display_name: profile.displayName,
        bio: profile.bio,
        location: profile.location,
        avatar_url: profile.avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id.value);

    if (error) {
      throw new Error(`Failed to save profile: ${error.message}`);
    }
  }
}
