import { createSupabaseServerClient } from "@/shared/core/database/server";
import { emitOutboxEvent } from "@/shared/core/infrastructure/outbox/outbox";

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
  const { data: stats } = await supabase
    .from("user_statistics")
    .select("*")
    .eq("user_id", request.userId)
    .maybeSingle();

  if (stats) {
    const prevDate = stats.last_read_date ? new Date(stats.last_read_date) : null;
    const currentDate = new Date(today);
    let newStreak = stats.current_streak || 1;

    if (prevDate) {
      const diffDays = Math.floor(
        (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
    }

    const totalSeconds = (stats.seconds_read || 0) + request.durationSeconds;
    const longestStreak = Math.max(stats.longest_streak || 1, newStreak);

    await supabase
      .from("user_statistics")
      .update({
        seconds_read: totalSeconds,
        minutes_read: Math.floor(totalSeconds / 60),
        pages_read: (stats.pages_read || 0) + request.pagesRead,
        current_streak: newStreak,
        longest_streak: longestStreak,
        last_read_date: today,
        updated_at: now,
      })
      .eq("user_id", request.userId);
  } else {
    await supabase.from("user_statistics").insert({
      user_id: request.userId,
      books_started: 1,
      books_completed: 0,
      seconds_read: request.durationSeconds,
      minutes_read: minutes,
      pages_read: request.pagesRead,
      current_streak: 1,
      longest_streak: 1,
      last_read_date: today,
      updated_at: now,
    });
  }

  // 3. Emit session ended event
  await emitOutboxEvent(supabase, "reader.session.ended", {
    userId: request.userId,
    bookId: request.bookId,
    durationSeconds: request.durationSeconds,
    pagesRead: request.pagesRead,
  });
}
