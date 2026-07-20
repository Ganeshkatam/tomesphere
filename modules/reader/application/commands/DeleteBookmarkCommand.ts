import { createSupabaseServerClient } from "@/shared/core/database/server";

export interface DeleteBookmarkRequest {
  userId: string;
  bookmarkId: string;
}

export async function executeDeleteBookmark(
  request: DeleteBookmarkRequest,
): Promise<void> {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .match({ id: request.bookmarkId, user_id: request.userId });

  if (error) {
    console.error("Failed to delete bookmark:", error);
    throw new Error("Failed to delete bookmark");
  }
}
