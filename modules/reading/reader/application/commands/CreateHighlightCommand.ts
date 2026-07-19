import { SelectionAnchor } from "@/modules/shared/core/events/types";
import { emitOutboxEvent } from "@/modules/shared/core/infrastructure/outbox/outbox";
import { HighlightRepository } from "../../domain/repositories/HighlightRepository";
import { createSupabaseServerClient } from "@/modules/shared/core/database/server";

export interface CreateHighlightRequest {
  userId: string;
  bookId: string;
  selectionAnchor: SelectionAnchor;
  selectedText: string;
  color?: string;
}

export async function executeCreateHighlight(
  repository: HighlightRepository,
  request: CreateHighlightRequest,
): Promise<{ id: string }> {
  // 1. Insert the highlight
  const highlight = await repository.createHighlight(
    request.userId,
    request.bookId,
    JSON.stringify(request.selectionAnchor),
    request.selectedText,
    request.color || "yellow"
  );

  const supabase = await createSupabaseServerClient();
  
  // 2. Emit highlight_created event
  await emitOutboxEvent(supabase, "reader:highlight_created", {
    userId: request.userId,
    bookId: request.bookId,
    highlightId: highlight.id,
    selectionAnchor: request.selectionAnchor,
    selectedText: request.selectedText,
    color: request.color || "yellow",
  });

  return { id: highlight.id };
}
