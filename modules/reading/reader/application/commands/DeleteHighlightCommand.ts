

import { createSupabaseServerClient } from "@/modules/shared/core/database/server";

export interface DeleteHighlightRequest {
  userId: string;
  highlightId: string;
}

export async function executeDeleteHighlight(
  request: DeleteHighlightRequest,
): Promise<void> {
  const supabase = await createSupabaseServerClient();

  // 1. Delete the highlight (Notes attached will have their highlight_id SET NULL automatically by Postgres)
  const { error } = await supabase
    .from("reader_highlights")
    .delete()
    .match({ id: request.highlightId, user_id: request.userId });

  if (error) {
    console.error("Failed to delete highlight:", error);
    throw new Error("Failed to delete highlight");
  }
}
