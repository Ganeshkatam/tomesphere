import { createSupabaseServerClient } from "@/shared/core/database/server";

export async function incrementBookViewCount(bookId: string): Promise<number | null> {
  if (!bookId) return null;

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.rpc("increment_book_view_count", {
      p_book_id: bookId,
    });

    if (error) {
      console.warn(`[incrementBookViewCount] Failed to increment view for book ${bookId}:`, error.message);
      return null;
    }

    return typeof data === "number" ? data : null;
  } catch (err) {
    console.warn(`[incrementBookViewCount] Unexpected error for book ${bookId}:`, err);
    return null;
  }
}
