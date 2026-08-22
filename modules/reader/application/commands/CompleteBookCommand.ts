import { createSupabaseServerClient } from "@/shared/core/database/server";
import { emitOutboxEvent } from "@/shared/core/infrastructure/outbox/outbox";
import { trackUserReadingActivity } from "../services/ReadingStreakTracker";

export interface CompleteBookRequest {
  userId: string;
  bookId: string;
}

/**
 * Authoritative monotonic completion transition.
 * 1. Checks if book is already marked finished in `library_books` (idempotency against duplicates/races).
 * 2. Sets `library_books.status = 'finished'`.
 * 3. Updates active `reading_sessions` to `percentage = 100`.
 * 4. Increments `user_statistics.books_completed` exactly once.
 */
export async function executeCompleteBookCommand(
  request: CompleteBookRequest,
): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const now = new Date().toISOString();

  // 1. Check existing library state
  const { data: libraryEntry } = await supabase
    .from("library_books")
    .select("id, status")
    .eq("user_id", request.userId)
    .eq("book_id", request.bookId)
    .maybeSingle();

  const isAlreadyFinished = libraryEntry?.status === "finished";

  // 2. Set library_books to finished
  if (libraryEntry) {
    await supabase
      .from("library_books")
      .update({
        status: "finished",
        updated_at: now,
      })
      .eq("id", libraryEntry.id);
  } else {
    await supabase.from("library_books").insert({
      user_id: request.userId,
      book_id: request.bookId,
      status: "finished",
      added_at: now,
      updated_at: now,
    });
  }

  // 3. Mark active reading session complete with 100%
  await supabase
    .from("reading_sessions")
    .update({
      percentage: 100,
      finished_at: now,
      last_read_at: now,
    })
    .eq("user_id", request.userId)
    .eq("book_id", request.bookId)
    .is("finished_at", null);

  // 4. Update user_statistics (only increment if this wasn't already completed)
  if (!isAlreadyFinished) {
    await trackUserReadingActivity(supabase, request.userId, {
      isCompletedBook: true,
    });
  }

  // 5. Emit book completed event
  await emitOutboxEvent(supabase, "reader.book.completed", {
    userId: request.userId,
    bookId: request.bookId,
  });
}
