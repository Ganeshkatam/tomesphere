import { createSupabaseServerClient } from "@/shared/core/database/server";
import { emitOutboxEvent } from "@/shared/core/infrastructure/outbox/outbox";

export interface CompleteReadingSessionRequest {
  userId: string;
  bookId: string;
  durationSeconds: number; // The observed reading timer tracked by the client
}

export async function executeCompleteReadingSession(
  request: CompleteReadingSessionRequest,
): Promise<void> {
  const supabase = await createSupabaseServerClient();

  // We emit the session ended event. The Analytics projections (built in Phase 10C)
  // will pick this up and aggregate it into progress_daily and analytics_user_daily.
  await emitOutboxEvent(supabase, "reader.session.ended", {
    userId: request.userId,
    bookId: request.bookId,
    durationSeconds: request.durationSeconds,
  });
}
