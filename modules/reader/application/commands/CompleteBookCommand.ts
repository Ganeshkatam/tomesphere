import { createSupabaseServerClient } from "@/shared/core/database/server";
import { emitOutboxEvent } from "@/shared/core/infrastructure/outbox/outbox";

export interface CompleteBookRequest {
  userId: string;
  bookId: string;
}

export async function executeCompleteBookCommand(
  request: CompleteBookRequest,
): Promise<void> {
  const supabase = await createSupabaseServerClient();

  // We emit the book completed event.
  // The PostgreSQL trigger will ensure idempotency and domain uniqueness 
  // via user_book_completions and user_statistics_event_log.
  await emitOutboxEvent(supabase, "reader.book.completed", {
    userId: request.userId,
    bookId: request.bookId,
  });
}
