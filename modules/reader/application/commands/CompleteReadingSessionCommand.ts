import { createSupabaseServerClient } from "@/shared/core/database/server";
import { emitOutboxEvent } from "@/shared/core/infrastructure/outbox/outbox";
import { trackUserReadingActivity } from "../services/ReadingStreakTracker";

export interface CompleteReadingSessionRequest {
  userId: string;
  bookId: string;
  sessionId?: string;
  durationSeconds: number;
  pagesRead: number;
  currentPage?: number;
}

/**
 * Records session activity into `reading_sessions` and updates derived `user_statistics`.
 * Calculates streak updates and reading time deltas idempotently.
 */
export async function executeCompleteReadingSession(
  request: CompleteReadingSessionRequest,
): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const now = new Date().toISOString();
  const today = now.slice(0, 10);
  const minutes = Math.max(1, Math.round(request.durationSeconds / 60));

  // 1. Update the reading session record
  if (request.sessionId) {
    await supabase
      .from("reading_sessions")
      .update({
        finished_at: now,
        last_read_at: now,
        reading_time_minutes: minutes,
        pages: request.pagesRead,
        ...(request.currentPage ? { current_page: request.currentPage } : {}),
      })
      .eq("id", request.sessionId);
  } else {
    // Fallback: update most recent active session for this book/user
    const { data: latestSession } = await supabase
      .from("reading_sessions")
      .select("id")
      .eq("user_id", request.userId)
      .eq("book_id", request.bookId)
      .is("finished_at", null)
      .order("started_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestSession) {
      await supabase
        .from("reading_sessions")
        .update({
          finished_at: now,
          last_read_at: now,
          reading_time_minutes: minutes,
          pages: request.pagesRead,
          ...(request.currentPage ? { current_page: request.currentPage } : {}),
        })
        .eq("id", latestSession.id);
    }
  }

  // 2. Update user_statistics with session deltas and streak calculation
  await trackUserReadingActivity(supabase, request.userId, {
    durationSeconds: request.durationSeconds,
    pagesRead: request.pagesRead,
  });

  // 3. Emit session ended event
  await emitOutboxEvent(supabase, "reader.session.ended", {
    userId: request.userId,
    bookId: request.bookId,
    durationSeconds: request.durationSeconds,
    pagesRead: request.pagesRead,
  });
}
