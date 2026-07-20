import { createSupabaseServerClient } from "@/shared/core/database/server";
import { ReaderNote, AnnotationTarget } from "@/shared/core/events/types";

export interface GetNotesRequest {
  userId: string;
  bookId: string;
}

export async function executeGetNotes(
  request: GetNotesRequest,
): Promise<ReaderNote[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("annotations")
    .select("*")
    .match({ user_id: request.userId, book_id: request.bookId })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch notes:", error);
    throw new Error("Failed to fetch notes");
  }

  if (!data) return [];

  return data.map((row: any) => {
    // Derive the AnnotationTarget from the persisted highlight_id
    const target: AnnotationTarget = row.highlight_id
      ? { type: "highlight", highlightId: row.highlight_id }
      : { type: "location", anchor: row.location_anchor };

    return {
      id: row.id,
      userId: row.user_id,
      bookId: row.book_id,
      target,
      bodyMarkdown: row.body_markdown,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  });
}
