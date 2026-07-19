import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";
import { ProfileRepository } from "../../domain/repositories/ProfileRepository";
import { UserProfile } from "../../domain/entities/UserProfile";
import { UserId } from "@/shared/kernel/UserId";
import { ProfileMapper } from "../mappers/ProfileMapper";
import { eventBus } from "@/shared/core/events/EventBus";

export class SupabaseProfileRepository implements ProfileRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async findByUserId(userId: UserId): Promise<UserProfile | null> {
    const { data, error } = await this.supabase
      .from("profiles")
      .select("*")
      .eq("id", userId.value)
      .single();

    if (error || !data) {
      return null;
    }

    return ProfileMapper.toDomain(data);
  }

  async save(profile: UserProfile): Promise<void> {
    const row = ProfileMapper.toPersistence(profile);

    // Atomic update to profiles table
    const { error } = await this.supabase
      .from("profiles")
      .update({
        name: row.name,
        avatar_url: row.avatar_url,
        biography: row.biography,
        location: row.location,
        updated_at: row.updated_at,
      })
      .eq("id", row.id);

    if (error) {
      throw new Error(`Failed to save profile: ${error.message}`);
    }

    // Publish domain events
    const events = profile.pullDomainEvents();
    for (const event of events) {
      if (event.eventName === "ProfileIdentityUpdated") {
        const e = event as any;
        eventBus.emit("profile:identity_updated", {
          userId: e.aggregateId,
          displayName: e.displayName,
          biography: e.biography,
          location: e.location,
        });
      } else if (event.eventName === "AvatarChanged") {
        const e = event as any;
        eventBus.emit("profile:avatar_changed", {
          userId: e.aggregateId,
          avatarUrl: e.avatarUrl,
        });
      }
    }
  }

  async setupInitialProfile(
    userId: UserId,
    name: string,
    favoriteGenres: string[],
    readingGoal: any
  ): Promise<void> {
    const { error } = await (this.supabase.rpc as any)("setup_profile", {
      user_id: userId.value,
      p_name: name,
      p_favorite_genres: favoriteGenres,
      p_reading_goal: readingGoal,
    });

    if (error) {
      throw new Error(`Failed to setup profile: ${error.message}`);
    }
  }
}
