import { createSupabaseServerClient } from "@/shared/core/database/server";
import { LocationAnchor } from "@/shared/core/events/types";
import { emitOutboxEvent } from "@/shared/core/infrastructure/outbox/outbox";
import { ReaderPositionRepository } from "../../domain/repositories/ReaderPositionRepository";
import { trackUserReadingActivity } from "../services/ReadingStreakTracker";

interface UpdateReaderPositionRequest {
  userId: string;
  bookId: string;
  locationAnchor: LocationAnchor;
}

/**
 * Lightweight, high-frequency durable reader position update.
 * Strictly manages reading_progress with last-write-wins (LWW) idempotency.
 * Emits an outbox event only when the position actually changes/advances.
 */
export async function executeUpdateReaderPosition(
  repository: ReaderPositionRepository,
  request: UpdateReaderPositionRequest,
): Promise<void> {
  const current = await repository.getPosition(request.userId, request.bookId);

  // If position hasn't changed, skip redundant write and event emission
  if (
    current &&
    current.locationAnchor?.type === request.locationAnchor.type &&
    current.locationAnchor?.value === request.locationAnchor.value
  ) {
    return;
  }

  // 1. Upsert durable position (last write wins)
  await repository.upsertPosition(
    request.userId,
    request.bookId,
    request.locationAnchor,
  );

  // 2. Track reading streak for today
  const supabase = await createSupabaseServerClient();
  await trackUserReadingActivity(supabase, request.userId);

  // 3. Emit position_updated event only when position actually changes
  const now = new Date().toISOString();

  await emitOutboxEvent(supabase, "reader.position.updated", {
    userId: request.userId,
    bookId: request.bookId,
    locationAnchor: request.locationAnchor,
    occurredAt: now,
  });
}
