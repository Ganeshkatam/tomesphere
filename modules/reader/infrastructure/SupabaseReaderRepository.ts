import { ReaderSession } from "../domain/ReaderSession";
import { ReaderRepository } from "./ReaderRepository";
import { ReadingPosition } from "../domain/ReadingPosition";
import { BookmarkCollection } from "../domain/BookmarkCollection";
import { HighlightCollection } from "../domain/HighlightCollection";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";

export class SupabaseReaderRepository implements ReaderRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async save(session: ReaderSession): Promise<void> {
    const { error } = await this.supabase.from("reading_sessions").upsert({
      id: session.id,
      user_id: session.readerId,
      book_id: session.bookId,
      current_page: session.position.page || null,
      last_read_at: session.position.updatedAt.toISOString(),
      percentage: session.position.progress || null,
      reading_time_minutes:
        Math.floor(session.totalDurationSeconds / 60) || null,
      started_at: session.startedAt.toISOString(),
      finished_at: session.finishedAt?.toISOString() || null,
    });

    if (error) {
      throw new Error(`Failed to save reader session: ${error.message}`);
    }
  }

  async findById(id: string): Promise<ReaderSession | null> {
    const { data, error } = await this.supabase
      .from("reading_sessions")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) return null;

    const totalDurationSeconds = (data.reading_time_minutes || 0) * 60;

    return ReaderSession.restore({
      id: data.id,
      readerId: data.user_id,
      bookId: data.book_id,
      status: data.finished_at ? "finished" : "active",
      position: ReadingPosition.create({
        location: String(data.current_page || 0),
        page: data.current_page || undefined,
        progress: data.percentage || 0,
        updatedAt: new Date(
          data.last_read_at || data.started_at || new Date().toISOString(),
        ),
      }),
      bookmarks: BookmarkCollection.create(),
      highlights: HighlightCollection.create(),
      startedAt: new Date(data.started_at || new Date().toISOString()),
      lastResumedAt: new Date(
        data.last_read_at || data.started_at || new Date().toISOString(),
      ),
      finishedAt: data.finished_at ? new Date(data.finished_at) : undefined,
      totalDurationSeconds,
    });
  }

  async getActiveSession(readerId: string): Promise<ReaderSession | null> {
    const { data, error } = await this.supabase
      .from("reading_sessions")
      .select("*")
      .match({ user_id: readerId })
      .is("finished_at", null)
      .order("started_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;

    const totalDurationSeconds = (data.reading_time_minutes || 0) * 60;

    return ReaderSession.restore({
      id: data.id,
      readerId: data.user_id,
      bookId: data.book_id,
      status: "active",
      position: ReadingPosition.create({
        location: String(data.current_page || 0),
        page: data.current_page || undefined,
        progress: data.percentage || 0,
        updatedAt: new Date(
          data.last_read_at || data.started_at || new Date().toISOString(),
        ),
      }),
      bookmarks: BookmarkCollection.create(),
      highlights: HighlightCollection.create(),
      startedAt: new Date(data.started_at || new Date().toISOString()),
      lastResumedAt: new Date(
        data.last_read_at || data.started_at || new Date().toISOString(),
      ),
      totalDurationSeconds,
    });
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("reading_sessions")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete reader session: ${error.message}`);
    }
  }
}
