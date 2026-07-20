import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";
import { SignalRepository } from "../domain/repositories/SignalRepository";
import { UserInteractionFact } from "../domain/value-objects/UserInteractionFact";
import { BookFeature } from "../domain/value-objects/BookFeature";

export class SupabaseSignalRepository implements SignalRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getUserInteractions(userId: string): Promise<UserInteractionFact[]> {
    // Recommendation engine deferred to V2.
    return [];
  }

  async getBookFeatures(bookIds: string[]): Promise<BookFeature[]> {
    // Recommendation engine deferred to V2.
    return [];
  }
}
