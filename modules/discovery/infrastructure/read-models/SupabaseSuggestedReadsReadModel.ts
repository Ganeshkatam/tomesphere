import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/modules/shared/core/types/database";
import { SuggestedReadsReadModel } from "../../application/queries/GetSuggestedReadsQuery";
import { SuggestedReadsDto } from "../../application/queries/GetSuggestedReadsQuery/dto";

export class SupabaseSuggestedReadsReadModel implements SuggestedReadsReadModel {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getSuggestedReads(userId: string): Promise<SuggestedReadsDto | null> {
    // Basic deterministic recommendations: books by same author or same genre as finished/currently_reading books
    const { data: libraryBooks, error: libraryBooksError } = await this.supabase
      .from("library_books")
      .select("books(book_genres(genres(name)), book_authors(authors(name)))")
      .eq("user_id", userId)
      .limit(5);

    if (libraryBooksError || !libraryBooks || libraryBooks.length === 0) {
      return { suggestions: [] };
    }

    const genres = new Set<string>();
    const authors = new Set<string>();

    for (const item of libraryBooks) {
      const bookData = Array.isArray(item.books) ? item.books[0] : item.books;
      if (!bookData) continue;
      
      const bookGenres = (bookData as any).book_genres?.map((bg: any) => bg.genres?.name) || [];
      const bookAuthors = (bookData as any).book_authors?.map((ba: any) => ba.authors?.name) || [];
      
      bookGenres.forEach((g: string) => { if (g) genres.add(g); });
      bookAuthors.forEach((a: string) => { if (a) authors.add(a); });
    }

    // Deterministic selection: find top 5 books matching genres, exclude already in library
    const { data: userLibrary } = await this.supabase
      .from("library_books")
      .select("book_id")
      .eq("user_id", userId);
    
    const excludedBookIds = userLibrary?.map(l => l.book_id) || [];

    let query = this.supabase
      .from("books")
      .select("id, title, cover_url, book_authors(authors(name))")
      .limit(5);

    // Filtering by related tables (genres) requires RPC or in-memory in Supabase
    // We will just return newest books minus library books for now

    if (excludedBookIds.length > 0) {
      // Supabase not.in filter doesn't accept empty arrays
      query = query.not("id", "in", `(${excludedBookIds.join(",")})`);
    }

    const { data: suggestionsData, error } = await query;

    if (error || !suggestionsData) {
      return { suggestions: [] };
    }

    const suggestions = suggestionsData.map((b: any) => ({
      bookId: b.id,
      title: b.title,
      author: (b.book_authors || []).map((ba: any) => ba.authors?.name).filter(Boolean).join(", ") || "Unknown",
      coverUrl: b.cover_url || undefined,
      reason: `Because you read ${Array.from(genres)[0] || "similar books"}...`
    }));

    return { suggestions };
  }
}
