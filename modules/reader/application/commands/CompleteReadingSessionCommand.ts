import { createSupabaseServerClient } from "@/shared/core/database/server";
import { emitOutboxEvent } from "@/shared/core/infrastructure/outbox/outbox";

export interface CompleteReadingSessionRequest {
  userId: string;
  bookId: string;
  durationSeconds: number; // The observed reading timer tracked by the client
  pagesRead: number; // Normalized pages counted by the session layer
}

export async function executeCompleteReadingSession(
  request: CompleteReadingSessionRequest,
): Promise<void> {
  const supabase = await createSupabaseServerClient();

  // We emit the session ended event. The Analytics projections (built in Phase 10C)
  // and user statistics triggers will pick this up and aggregate it.
  await emitOutboxEvent(supabase, "reader.session.ended", {
    userId: request.userId,
    bookId: request.bookId,
    durationSeconds: request.durationSeconds,
    pagesRead: request.pagesRead,
  });
}
