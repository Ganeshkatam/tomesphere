import { Book } from "@/modules/books/domain/entities/Book";
import { BookDto } from "../dto/response/BookDto";
import { BookDetailDto } from "../dto/response/BookDetailDto";

export class BookMapper {
  /**
   * Maps a Book entity to a lean BookDto for lists and grids.
   */
  static toDto(book: any): BookDto {
    // Using any or fixing Book entity next
    const rawCover = book.coverUrl || book.cover_url;

    // Safely extract from nested relations or fallback to empty arrays
    const authors = (book.book_authors || [])
      .map((ba: any) => ba.authors)
      .filter(Boolean);
    const genres = (book.book_genres || [])
      .map((bg: any) => bg.genres)
      .filter(Boolean);
    const subjects = (book.book_subjects || [])
      .map((bs: any) => bs.subjects)
      .filter(Boolean);

    return {
      id: book.bookId?.value || book.id,
      title: book.title,
      authors,
      genres,
      subjects,
      coverUrl: rawCover ? rawCover.replace(/ /g, "%20") : null,
      isTextbook: book.isTextbook || false,
      language: book.language || null,
      publishedDate: book.publishedDate || book.release_date || null,
      isFeatured: book.isFeatured || book.is_featured || false,
      files: book.files
        ? book.files.map((f: any) => ({
            id: f.id,
            format: f.format,
            storagePath: f.storagePath || f.storage_path,
            isPrimary: f.isPrimary || f.is_primary,
          }))
        : [],
      createdAt: book.createdAt || book.created_at || null,
    };
  }

  /**
   * Maps a Book entity to a detailed BookDetailDto for the book detail view.
   */
  static toDetailDto(book: Book): BookDetailDto {
    const rawCover = book.coverUrl;

    // For domain entities, we might need to handle this differently if Book entity was updated,
    // but assuming book properties are any for now or updated to arrays.
    return {
      id: book.bookId.value,
      title: book.title,
      authors: (book as any).authors || [],
      genres: (book as any).genres || [],
      subjects: (book as any).subjects || [],
      coverUrl: rawCover ? rawCover.replace(/ /g, "%20") : null,
      description: book.description,
      publishedDate: book.publishedDate,
      pageCount: book.pageCount,
      isTextbook: book.isTextbook,
      isPublicDomain: book.isPublicDomain(),
      files: book.files.map((f) => ({
        id: f.id,
        format: f.format,
        storagePath: f.storagePath,
        isPrimary: f.isPrimary,
      })),
    };
  }
}
