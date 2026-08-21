import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";
import { CurrentReadingReadModel } from "../../application/queries/GetCurrentReadingQuery";
import { CurrentReadingDto } from "../../application/queries/GetCurrentReadingQuery/dto";
import { CanonicalBookProgressProjection } from "../../application/projections/CanonicalBookProgressProjection";

export class SupabaseCurrentReadingReadModel implements CurrentReadingReadModel {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getCurrentReading(userId: string): Promise<CurrentReadingDto | null> {
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
      .limit(6);

    if (error || !data || data.length === 0) {
      return { books: [] };
    }

    const bookIds = data.map((d) => d.book_id);

    const [{ data: progressData }, { data: sessionData }] = await Promise.all([
      this.supabase
        .from("reading_progress")
        .select("book_id, location_anchor, last_read_at")
        .eq("user_id", userId)
        .in("book_id", bookIds),
      this.supabase
        .from("reading_sessions")
        .select("book_id, percentage, current_page, last_read_at")
        .eq("user_id", userId)
        .in("book_id", bookIds)
        .order("last_read_at", { ascending: false }),
    ]);

    const progressMap = new Map<string, any>();
    if (progressData) {
      progressData.forEach((p) => progressMap.set(p.book_id, p));
    }

    const sessionMap = new Map<string, any>();
    if (sessionData) {
      sessionData.forEach((s) => {
        if (!sessionMap.has(s.book_id)) {
          sessionMap.set(s.book_id, s);
        }
      });
    }

    const books = data.map((item) => {
      const bookData = Array.isArray(item.books) ? item.books[0] : item.books;
      const prog = progressMap.get(item.book_id);
      const sess = sessionMap.get(item.book_id);

      const canonicalProgress = CanonicalBookProgressProjection.project({
        libraryStatus: item.status,
        locationAnchor: prog?.location_anchor as any,
        totalPages: (bookData as any)?.pages,
        sessionPercentage: sess?.percentage ? Number(sess.percentage) : null,
        sessionCurrentPage: sess?.current_page,
        lastReadAt: prog?.last_read_at || sess?.last_read_at || item.updated_at,
      });

      const authorNames = ((bookData as any)?.book_authors || [])
        .map((ba: any) => ba.authors?.name)
        .filter(Boolean)
        .join(", ") || "Unknown Author";

      return {
        bookId: item.book_id,
        title: (bookData as any)?.title || "Unknown Title",
        author: authorNames,
        coverUrl: (bookData as any)?.cover_url
          ? (bookData as any).cover_url.replace(/ /g, "%20")
          : undefined,
        progressPercentage: canonicalProgress.progressPercentage,
        currentPage: canonicalProgress.currentPage,
        totalPages: canonicalProgress.totalPages,
      };
    });

    return { books };
  }
}
