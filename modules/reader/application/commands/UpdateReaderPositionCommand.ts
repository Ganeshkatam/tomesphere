import { createSupabaseServerClient } from "@/shared/core/database/server";
import { LocationAnchor } from "@/shared/core/events/types";
import { emitOutboxEvent } from "@/shared/core/infrastructure/outbox/outbox";
import { ReaderPositionRepository } from "../../domain/repositories/ReaderPositionRepository";

interface UpdateReaderPositionRequest {
  userId: string;
  bookId: string;
  locationAnchor: LocationAnchor;
}

/**
 * Updates the user's latest reading position and emits a domain event.
 * Uses last-write-wins semantics.
 */
export async function executeUpdateReaderPosition(
  repository: ReaderPositionRepository,
  request: UpdateReaderPositionRequest,
): Promise<void> {
  // 1. Upsert the position (last write wins) via repository
  await repository.upsertPosition(request.userId, request.bookId, request.locationAnchor);

  const supabase = await createSupabaseServerClient();
  const now = new Date().toISOString();

  // 2. Emit position_updated event
  await emitOutboxEvent(supabase, "reader:position_updated", {
    userId: request.userId,
    bookId: request.bookId,
    locationAnchor: request.locationAnchor,
    occurredAt: now,
  });
}
