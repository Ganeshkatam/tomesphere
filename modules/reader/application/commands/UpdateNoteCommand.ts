import { createSupabaseServerClient } from "@/shared/core/database/server";

export interface UpdateNoteRequest {
  userId: string;
  noteId: string;
  bodyMarkdown: string;
}

export async function executeUpdateNote(
  request: UpdateNoteRequest,
): Promise<void> {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("annotations")
    .update({
      body_markdown: request.bodyMarkdown,
      // updated_at is handled by Postgres trigger
    })
    .match({ id: request.noteId, user_id: request.userId });

  if (error) {
    console.error("Failed to update note in annotations:", error);
    throw new Error("Failed to update note");
  }

  try {
    await supabase
      .from("notes")
      .update({
        content: request.bodyMarkdown,
      })
      .match({ id: request.noteId, user_id: request.userId });
  } catch (notesUpdateErr) {
    console.warn("Could not sync note update to notes table:", notesUpdateErr);
  }
}
