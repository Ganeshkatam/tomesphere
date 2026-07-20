import { SearchProjectionRepository } from "../repositories/SearchProjectionRepository";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";

export class SearchIndexer {
  constructor(
    private readonly repository: SearchProjectionRepository,
    private readonly supabase: SupabaseClient<Database>, // Need to fetch raw data to build projection
  ) {}

  async buildAndUpsert(
    bookId: string,
    reason: "CREATE" | "UPDATE" | "DELETE" | "REBUILD" = "REBUILD",
  ): Promise<void> {
    const startTime = Date.now();

    // 1. Fetch raw data from Catalog tables (Books, Authors, Genres, Subjects)
    const { data: book, error } = await this.supabase
      .from("books")
      .select(
        `
        *,
        book_authors (
          authors ( name )
        ),
        book_genres (
          genres ( name, slug )
        ),
        book_subjects (
          subjects ( name, slug )
        )
      `,
      )
      .eq("id", bookId)
      .single();

    if (error || !book) {
      console.warn(
        `[SearchProjectionBuilder] Book ${bookId} not found or error:`,
        error,
      );
      return;
    }

    // 2. Map relational data into flat projection arrays
    const authors =
      book.book_authors?.map((ba: any) => ba.authors?.name).filter(Boolean) ||
      [];
    const genres =
      book.book_genres?.map((bg: any) => bg.genres?.name).filter(Boolean) || [];
    const subjects =
      book.book_subjects?.map((bs: any) => bs.subjects?.name).filter(Boolean) ||
      [];

    // Generate a basic slug if one isn't natively available
    const slug =
      book.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") || book.id;

    // 3. Upsert via Repository
    await this.repository.upsert({
      book_id: book.id,
      slug: slug,
      title: book.title,
      subtitle: (book as any).subtitle || undefined,
      description: book.description || undefined,
      authors: authors,
      genres: genres,
      subjects: subjects,
      language: "en",
      publication_year: book.release_date
        ? new Date(book.release_date).getFullYear()
        : undefined,
      is_public: true, // Assuming true for now, adapt based on actual domain rules later
      popularity_score: (book as any).popularity_score || 0,
      download_count: book.download_count || 0,
      view_count: book.view_count || 0,
      average_rating: (book as any).average_rating || 0,
      rating_count: (book as any).rating_count || 0,
      source_updated_at: book.updated_at || book.created_at || undefined,
      indexed_by: "system-indexer",
      last_index_reason: reason,
      last_index_duration_ms: Date.now() - startTime,
      last_projection_version: 1, // V1 base version, can be incremented for future schema evolutions
    });

    console.log(
      `[SearchIndexer] Successfully upserted projection for book ${bookId} in ${Date.now() - startTime}ms`,
    );
  }

  async remove(bookId: string): Promise<void> {
    await this.repository.remove(bookId);
    console.log(
      `[SearchIndexer] Successfully removed projection for book ${bookId}`,
    );
  }
}
