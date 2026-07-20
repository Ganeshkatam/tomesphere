import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";
import { ProgressRepository } from "../../domain/repositories/ProgressRepository";
import { UserProgress } from "../../domain/entities/UserProgress";
import { UserId } from "@/shared/kernel/UserId";
import { ProgressMapper } from "../mappers/ProgressMapper";
import { eventBus } from "@/shared/core/events/EventBus";

export class SupabaseProgressRepository implements ProgressRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async findByUserId(userId: UserId): Promise<UserProgress | null> {
    return ProgressMapper.toDomain(userId.value, null, []);
  }

  async save(progress: UserProgress): Promise<void> {
    // Gamification (levels, XP, streaks as writable state) is deferred to V2.
    // Progress/statistics is now a read-only projection (user_statistics) driven by reader events.
    // We only publish domain events if there are any left.
    const events = progress.pullDomainEvents();
    for (const event of events) {
      // Stub
    }
  }
}
