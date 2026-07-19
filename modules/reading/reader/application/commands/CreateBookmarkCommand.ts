import { LocationAnchor } from "@/modules/shared/core/events/types";
import { emitOutboxEvent } from "@/modules/shared/core/infrastructure/outbox/outbox";
import { BookmarkRepository } from "../../domain/repositories/BookmarkRepository";
import { createSupabaseServerClient } from "@/modules/shared/core/database/server";

export interface CreateBookmarkRequest {
  userId: string;
  bookId: string;
  anchor: LocationAnchor;
  label?: string;
}

export async function executeCreateBookmark(
  repository: BookmarkRepository,
  request: CreateBookmarkRequest,
): Promise<{ id: string }> {
  const bookmark = await repository.createBookmark(
    request.userId, 
    request.bookId, 
    request.anchor.value, 
    request.label
  );

  const supabase = await createSupabaseServerClient();
  await emitOutboxEvent(supabase, "reader:bookmark_created", {
    userId: request.userId,
    bookId: request.bookId,
    bookmarkId: bookmark.id,
    anchor: request.anchor,
  });

  return { id: bookmark.id };
}
