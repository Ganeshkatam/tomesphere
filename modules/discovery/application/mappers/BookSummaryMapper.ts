import { BookSummaryDto } from "../dto/BookSummaryDto";

export class BookSummaryMapper {
  /**
   * Maps a raw Supabase read-model row directly to BookSummaryDto.
   * This provides a strict anti-corruption boundary so that unexpected database
   * columns (like pdf_url, created_at, internal scores) cannot leak into the presentation tier.
   */
  static toDto(row: any): BookSummaryDto {
    const sortedBookAuthors = [...(row.book_authors || [])].sort(
      (a: any, b: any) => (a.position || 0) - (b.position || 0)
    );

    const authors = sortedBookAuthors
      .map((ba: any) => ba.authors)
      .filter(Boolean)
      .map((a: any) => ({
        id: a.id,
        slug: a.slug || a.id,
        name: a.name,
      }));

    const genres = (row.book_genres || [])
      .map((bg: any) => bg.genres)
      .filter(Boolean)
      .map((g: any) => ({
        id: g.id,
        name: g.name,
      }));

    const rawCover = row.coverUrl || row.cover_url;
    
    // We parse publication year from a date string if available
    let publicationYear: number | null = null;
    const releaseDate = row.publishedDate || row.release_date;
    if (releaseDate) {
      const year = new Date(releaseDate).getFullYear();
      if (!isNaN(year)) {
        publicationYear = year;
      }
    }

    return {
      id: row.id,
      // If slug doesn't exist yet, we fallback to id to fulfill the contract,
      // but ideally this is generated/persisted at the database level.
      slug: row.slug || row.id,
      title: row.title,
      authors,
      genres,
      coverUrl: rawCover ? rawCover.replace(/ /g, "%20") : null,
      language: row.languages?.name || row.language || null,
      publicationYear,
    };
  }
}
