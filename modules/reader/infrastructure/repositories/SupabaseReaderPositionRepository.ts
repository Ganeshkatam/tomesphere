import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";
import { ReaderPositionRepository } from "../../domain/repositories/ReaderPositionRepository";
import { ReaderPositionDto } from "../../application/dto/response/ReaderPositionDto";
import { LocationAnchor } from "@/shared/core/events/types";

export class SupabaseReaderPositionRepository implements ReaderPositionRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getPosition(
    userId: string,
    bookId: string,
  ): Promise<ReaderPositionDto | null> {
    const { data, error } = await this.supabase
      .from("reading_progress")
      .select("*")
      .match({ user_id: userId, book_id: bookId })
      .maybeSingle();

    if (error || !data) return null;

    return {
      bookId: data.book_id,
      locationAnchor: data.location_anchor as unknown as LocationAnchor,
      lastReadAt: data.last_read_at,
    };
  }

  async upsertPosition(
    userId: string,
    bookId: string,
    locationAnchor: LocationAnchor,
  ): Promise<void> {
    const { error } = await this.supabase.from("reading_progress").upsert(
      {
        user_id: userId,
        book_id: bookId,
        location_anchor: locationAnchor as any,
        last_read_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,book_id",
      },
    );

    if (error) {
      throw new Error(`Failed to upsert reader position: ${error.message}`);
    }
  }
}
