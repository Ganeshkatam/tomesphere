import { createSupabaseServerClient } from "@/shared/core/database/server";

export interface DeleteNoteRequest {
  userId: string;
  noteId: string;
}

export async function executeDeleteNote(
  request: DeleteNoteRequest,
): Promise<void> {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("annotations")
    .delete()
    .match({ id: request.noteId, user_id: request.userId });

  if (error) {
    console.error("Failed to delete note in annotations:", error);
    throw new Error("Failed to delete note");
  }

  try {
    await supabase
      .from("notes")
      .delete()
      .match({ id: request.noteId, user_id: request.userId });
  } catch (notesDeleteErr) {
    console.warn("Could not sync note deletion to notes table:", notesDeleteErr);
  }
}
