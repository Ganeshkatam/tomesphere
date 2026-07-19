import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/modules/shared/core/types/database";
import { CurrentReadingReadModel } from "../../application/queries/GetCurrentReadingQuery";
import { CurrentReadingDto } from "../../application/queries/GetCurrentReadingQuery/dto";

export class SupabaseCurrentReadingReadModel implements CurrentReadingReadModel {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getCurrentReading(userId: string): Promise<CurrentReadingDto | null> {
    const { data, error } = await this.supabase
      .from("library_books")
      .select("book_id, updated_at, books(title, cover_url, book_authors(authors(name)))")
      .eq("user_id", userId)
      .eq("status", "currently_reading")
      .order("updated_at", { ascending: false })
      .limit(5); // Fetch top 5 currently reading

    if (error || !data || data.length === 0) {
      return { books: [] };
    }

    const books = data.map((item) => {
      const bookData = Array.isArray(item.books) ? item.books[0] : item.books;
      return {
        bookId: item.book_id,
        title: bookData?.title || "Unknown Title",
        author: (bookData as any)?.book_authors?.map((ba: any) => ba.authors?.name).filter(Boolean).join(", ") || "Unknown Author",
        coverUrl: bookData?.cover_url || undefined,
        progressPercentage: 0,
      };
    });

    return { books };
  }
}
