import { createSupabaseServerClient } from "@/shared/core/database/server";
import { AnnotationTarget, LocationAnchor } from "@/shared/core/events/types";
import { emitOutboxEvent } from "@/shared/core/infrastructure/outbox/outbox";

export interface CreateNoteRequest {
  userId: string;
  bookId: string;
  target: AnnotationTarget;
  bodyMarkdown: string;
}

export async function executeCreateNote(
  request: CreateNoteRequest,
): Promise<{ id: string }> {
  const supabase = await createSupabaseServerClient();

  // Resolve highlight_id and location_anchor from the AnnotationTarget
  let highlightId: string | null = null;
  let locationAnchor: LocationAnchor;

  if (request.target.type === "highlight") {
    highlightId = request.target.highlightId;

    // Fetch the highlight's anchor and text to store alongside the note
    const { data: highlight } = await supabase
      .from("highlights")
      .select("location_anchor, selected_text")
      .eq("id", highlightId)
      .single();

    // Use the highlight's stored anchor as the note's location
    locationAnchor = highlight?.location_anchor?.start || {
      type: "epubcfi",
      value: "",
    };
  } else {
    locationAnchor = request.target.anchor;
  }

  // 1. Insert into annotations table
  const { data, error } = await supabase
    .from("annotations")
    .insert({
      user_id: request.userId,
      book_id: request.bookId,
      highlight_id: highlightId,
      location_anchor: locationAnchor as any,
      body_markdown: request.bodyMarkdown,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Failed to create note in annotations:", error);
    throw new Error("Failed to create note");
  }

  const noteId = data.id;

  // 2. Also sync into public.notes table for unified workspace visibility
  try {
    let snippet = "";
    if (highlightId) {
      const { data: hData } = await supabase
        .from("highlights")
        .select("selected_text")
        .eq("id", highlightId)
        .single();
      snippet = hData?.selected_text?.trim() || "";
    }

    const title = snippet
      ? snippet.length > 80
        ? snippet.substring(0, 77) + "..."
        : snippet
      : "Book Note";

    await supabase.from("notes").upsert({
      id: noteId,
      user_id: request.userId,
      book_id: request.bookId,
      title,
      content: request.bodyMarkdown,
      tags: ["reader", "highlight"],
    });
  } catch (notesSyncErr) {
    console.warn("Could not sync to notes table:", notesSyncErr);
  }

  // 3. Emit note_created event
  await emitOutboxEvent(supabase, "reader.note.created", {
    userId: request.userId,
    bookId: request.bookId,
    noteId: noteId,
    target: request.target,
  });

  return { id: noteId };
}
