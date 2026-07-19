import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";
import { LibraryReadModel } from "../../application/ports/read-models/LibraryReadModel";
import { LibraryCollectionItemDto } from "../../application/dto/response/LibraryEntryDto";

export class SupabaseLibraryReadModel implements LibraryReadModel {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getLibraryBooks(userId: string): Promise<LibraryCollectionItemDto[]> {
    const { data, error } = await this.supabase
      .from("library_books")
      .select(`
        *,
        books:book_id (*, book_authors(authors(*)), book_genres(genres(*)), book_subjects(subjects(*)))
      `)
      .eq("user_id", userId)
      .order("added_at", { ascending: false });

    if (error) {
      console.error("SupabaseLibraryReadModel.getLibraryBooks error:", error);
      return [];
    }

    if (!data) return [];

    return data.map((row: any) => this.mapToDto(row));
  }

  async getLibraryBook(userId: string, bookId: string): Promise<LibraryCollectionItemDto | null> {
    const { data, error } = await this.supabase
      .from("library_books")
      .select(`
        *,
        books:book_id (*, book_authors(authors(*)), book_genres(genres(*)), book_subjects(subjects(*)))
      `)
      .match({ user_id: userId, book_id: bookId })
      .single();

    if (error || !data) {
      return null;
    }

    return this.mapToDto(data);
  }

  private mapToDto(row: any): LibraryCollectionItemDto {
    const book = row.books;
    
    return {
      book: {
        id: book.id,
        title: book.title,
        authors: (book.book_authors || []).map((ba: any) => ba.authors).filter(Boolean),
        genres: (book.book_genres || []).map((bg: any) => bg.genres).filter(Boolean),
        subjects: (book.book_subjects || []).map((bs: any) => bs.subjects).filter(Boolean),
        coverUrl: book.cover_image_url || book.cover_url || null,
        description: book.description || null,
        isbn: book.isbn || null,
        pageCount: book.page_count || book.pages || null,
        averageRating: 0,
        isTextbook: book.is_textbook || false,
        language: book.language || null,
        publishedDate: book.published_date || null,
        isFeatured: book.is_featured || false,
        pdfUrl: book.pdf_url || null,
        createdAt: book.created_at || null,
      },
      library: {
        userId: row.user_id,
        bookId: row.book_id,
        state: row.status || "want_to_read",
        progress: 0,
        startedAt: row.added_at || undefined,
        isFavorite: false,
      },
    };
  }
}
