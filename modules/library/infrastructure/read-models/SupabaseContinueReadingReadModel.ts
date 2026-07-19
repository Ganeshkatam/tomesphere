import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";
import { ContinueReadingReadModel } from "../../application/queries/GetContinueReadingQuery";
import { ContinueReadingDto } from "../../application/queries/GetContinueReadingQuery/dto";

export class SupabaseContinueReadingReadModel implements ContinueReadingReadModel {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getContinueReading(userId: string): Promise<ContinueReadingDto | null> {
    const { data, error } = await this.supabase
      .from("library_books")
      .select("book_id, updated_at, books(title, author, cover_url)")
      .eq("user_id", userId)
      .eq("status", "currently_reading")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data || !data.books) return null;

    const book = Array.isArray(data.books) ? data.books[0] : data.books;
    if (!book) return null;

    return {
      bookId: data.book_id,
      title: book.title || "Unknown Title",
      author: book.author || "Unknown Author",
      coverUrl: book.cover_url || undefined,
      progressPercentage: 0,
      lastReadAt: data.updated_at || new Date().toISOString(),
    };
  }
}
