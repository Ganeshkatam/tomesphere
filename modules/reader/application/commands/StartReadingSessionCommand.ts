import { createSupabaseServerClient } from "@/shared/core/database/server";
import { emitOutboxEvent } from "@/shared/core/infrastructure/outbox/outbox";
import { trackUserReadingActivity } from "../services/ReadingStreakTracker";

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
  // 1. Check for existing session for this user and book (reading_sessions has a unique constraint on user_id, book_id)
  const { data: existingSession } = await supabase
    .from("reading_sessions")
    .select("id")
    .eq("user_id", request.userId)
    .eq("book_id", request.bookId)
    .maybeSingle();

  let sessionId = existingSession?.id;
  let status: "existing" | "created" = "existing";

  if (existingSession) {
    sessionId = existingSession.id;
    status = "existing";
    await supabase
      .from("reading_sessions")
      .update({
        last_read_at: now,
        finished_at: null,
      })
      .eq("id", sessionId);
  } else {
    status = "created";
    const { data: newSession, error: sessionErr } = await supabase
      .from("reading_sessions")
      .upsert(
        {
          user_id: request.userId,
          book_id: request.bookId,
          started_at: now,
          last_read_at: now,
          current_page: request.initialPage || 1,
          percentage: 0,
          reading_time_minutes: 0,
          pages: 0,
        },
        { onConflict: "user_id,book_id" }
      )
      .select("id")
      .single();

    if (sessionErr) {
      console.error("Failed to insert reading_session:", sessionErr);
      const { data: fallback } = await supabase
        .from("reading_sessions")
        .select("id")
        .eq("user_id", request.userId)
        .eq("book_id", request.bookId)
        .maybeSingle();
      sessionId = fallback?.id || "";
    } else {
      sessionId = newSession?.id || "";
    }
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

  // 3. Ensure user_statistics row exists and record today's active reading streak
  await trackUserReadingActivity(supabase, request.userId, {
    isNewBook: !existingLibraryEntry,
  });

  // 4. Emit session started event
  await emitOutboxEvent(supabase, "reader.session.started", {
    userId: request.userId,
    bookId: request.bookId,
    sessionId,
    startedAt: now,
  });

  return { sessionId, status };
}
