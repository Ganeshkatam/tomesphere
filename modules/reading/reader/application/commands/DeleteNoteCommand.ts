

import { createSupabaseServerClient } from "@/modules/shared/core/database/server";

export interface DeleteNoteRequest {
  userId: string;
  noteId: string;
}

export async function executeDeleteNote(
  request: DeleteNoteRequest,
): Promise<void> {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("reader_notes")
    .delete()
    .match({ id: request.noteId, user_id: request.userId });

  if (error) {
    console.error("Failed to delete note:", error);
    throw new Error("Failed to delete note");
  }
}
