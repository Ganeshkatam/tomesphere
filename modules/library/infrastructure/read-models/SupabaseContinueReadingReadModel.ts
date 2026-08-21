import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";
import { ContinueReadingReadModel } from "../../application/queries/GetContinueReadingQuery";
import { ContinueReadingDto } from "../../application/queries/GetContinueReadingQuery/dto";
import { CanonicalBookProgressProjection } from "../../application/projections/CanonicalBookProgressProjection";

export class SupabaseContinueReadingReadModel implements ContinueReadingReadModel {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getContinueReading(userId: string): Promise<ContinueReadingDto | null> {
    const { data, error } = await this.supabase
      .from("library_books")
      .select(
        `
        book_id,
        updated_at,
        status,
        books (
          id,
          title,
          cover_url,
          pages,
          book_authors (
            authors (
              name
            )
          )
        )
      `,
      )
      .eq("user_id", userId)
      .eq("status", "currently_reading")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data || !data.books) return null;

    const book = Array.isArray(data.books) ? data.books[0] : data.books;
    if (!book) return null;

    const [{ data: prog }, { data: sess }] = await Promise.all([
      this.supabase
        .from("reading_progress")
        .select("location_anchor, last_read_at")
        .eq("user_id", userId)
        .eq("book_id", data.book_id)
        .maybeSingle(),
      this.supabase
        .from("reading_sessions")
        .select("percentage, current_page, last_read_at")
        .eq("user_id", userId)
        .eq("book_id", data.book_id)
        .order("last_read_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    const authors = ((book as any)?.book_authors || [])
      .map((ba: any) => ba.authors?.name)
      .filter(Boolean)
      .join(", ") || "Unknown Author";

    const canonicalProgress = CanonicalBookProgressProjection.project({
      libraryStatus: data.status,
      locationAnchor: prog?.location_anchor as any,
      totalPages: (book as any)?.pages,
      sessionPercentage: sess?.percentage ? Number(sess.percentage) : null,
      sessionCurrentPage: sess?.current_page,
      lastReadAt: prog?.last_read_at || sess?.last_read_at || data.updated_at,
    });

    return {
      bookId: data.book_id,
      title: (book as any)?.title || "Unknown Title",
      author: authors,
      coverUrl: (book as any)?.cover_url ? (book as any).cover_url.replace(/ /g, "%20") : undefined,
      progressPercentage: canonicalProgress.progressPercentage,
      currentPage: canonicalProgress.currentPage,
      totalPages: canonicalProgress.totalPages,
      lastReadAt: canonicalProgress.lastReadAt || data.updated_at || new Date().toISOString(),
    };
  }
}
