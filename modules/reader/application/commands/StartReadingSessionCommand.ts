import { createSupabaseServerClient } from "@/shared/core/database/server";
import { emitOutboxEvent } from "@/shared/core/infrastructure/outbox/outbox";

export interface StartReadingSessionRequest {
  userId: string;
  bookId: string;
  initialPage?: number;
}

export interface StartReadingSessionResponse {
  sessionId: string;
  status: "existing" | "created";
}

/**
 * Initializes a reader session idempotently:
 * 1. Checks for an active uncompleted session within the last 4 hours.
 * 2. If none, creates a new record in `reading_sessions`.
 * 3. Manages explicit lifecycle transition in `library_books`:
 *    - Not present -> creates `currently_reading`
 *    - `want_to_read` -> transitions to `currently_reading`
 *    - `finished` -> preserves `finished`
 * 4. Ensures `user_statistics` record is initialized.
 */
export async function executeStartReadingSession(
  request: StartReadingSessionRequest,
): Promise<StartReadingSessionResponse> {
  const supabase = await createSupabaseServerClient();
  const now = new Date().toISOString();
  const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString();

  // 1. Check for existing active session (idempotency against refreshes, multiple tabs)
  const { data: existingSession } = await supabase
    .from("reading_sessions")
    .select("id")
    .eq("user_id", request.userId)
    .eq("book_id", request.bookId)
    .is("finished_at", null)
    .gte("started_at", fourHoursAgo)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let sessionId = existingSession?.id;
  let status: "existing" | "created" = "existing";

  if (!sessionId) {
    status = "created";
    const { data: newSession, error: sessionErr } = await supabase
      .from("reading_sessions")
      .insert({
        user_id: request.userId,
        book_id: request.bookId,
        started_at: now,
        last_read_at: now,
        current_page: request.initialPage || 1,
        percentage: 0,
        reading_time_minutes: 0,
        pages: 0,
      })
      .select("id")
      .single();

    if (sessionErr) {
      console.error("Failed to insert reading_session:", sessionErr);
    }
    sessionId = newSession?.id || "";
  }

  // 2. Manage library_books lifecycle transition
  const { data: existingLibraryEntry } = await supabase
    .from("library_books")
    .select("id, status")
    .eq("user_id", request.userId)
    .eq("book_id", request.bookId)
    .maybeSingle();

  if (!existingLibraryEntry) {
    // Book not in library -> register as currently_reading
    await supabase.from("library_books").insert({
      user_id: request.userId,
      book_id: request.bookId,
      status: "currently_reading",
      added_at: now,
      updated_at: now,
    });
  } else if (existingLibraryEntry.status === "want_to_read") {
    // Transition want_to_read -> currently_reading
    await supabase
      .from("library_books")
      .update({
        status: "currently_reading",
        updated_at: now,
      })
      .eq("id", existingLibraryEntry.id);
  }

  // 3. Ensure user_statistics row exists
  const { data: existingStats } = await supabase
    .from("user_statistics")
    .select("user_id, books_started")
    .eq("user_id", request.userId)
    .maybeSingle();

  if (!existingStats) {
    await supabase.from("user_statistics").insert({
      user_id: request.userId,
      books_started: 1,
      books_completed: 0,
      pages_read: 0,
      minutes_read: 0,
      seconds_read: 0,
      current_streak: 1,
      longest_streak: 1,
      last_read_date: now.slice(0, 10),
      updated_at: now,
    });
  } else if (!existingLibraryEntry) {
    // If this was a new book, increment books_started
    await supabase
      .from("user_statistics")
      .update({
        books_started: (existingStats.books_started || 0) + 1,
        updated_at: now,
      })
      .eq("user_id", request.userId);
  }

  // 4. Emit session started event
  await emitOutboxEvent(supabase, "reader.session.started", {
    userId: request.userId,
    bookId: request.bookId,
    sessionId,
    startedAt: now,
  });

  return { sessionId, status };
}
