import { createSupabaseServerClient } from "@/shared/core/database/server";

export interface RelatedBookDto {
  id: string;
  title: string;
  slug?: string;
  coverUrl: string | null;
  authors: { name: string }[];
  genres: { name: string }[];
  publishedDate?: string | null;
  publicationYear?: number | null;
  isFeatured?: boolean;
}

export async function getRelatedBooks(
  bookId: string,
  limit: number = 8
): Promise<RelatedBookDto[]> {
  const supabase = await createSupabaseServerClient();

  // 1. Get ordered genres for this specific book
  const { data: bookGenreRows } = await supabase
    .from("book_genres")
    .select("genre_id, genres(name)")
    .eq("book_id", bookId);

  if (!bookGenreRows || bookGenreRows.length === 0) {
    return [];
  }

  // Filter out broad catch-all categories if specific genres exist
  const specificGenreRows = bookGenreRows.filter(
    (bg: any) => bg.genres?.name && !["General", "Education"].includes(bg.genres.name)
  );

  const targetGenres = specificGenreRows.length > 0 ? specificGenreRows : bookGenreRows;
  const primaryGenreId = targetGenres[0]?.genre_id;
  const allTargetGenreIds = targetGenres.map((row: any) => row.genre_id);

  // 2. Query books matching the primary genre first, or target genres
  const { data: relatedRows, error } = await supabase
    .from("book_genres")
    .select(
      `
      genre_id,
      book_id,
      books (
        id,
        title,
        cover_url,
        release_date,
        is_featured,
        book_authors ( authors ( name ) ),
        book_genres ( genres ( name ) )
      )
    `
    )
    .in("genre_id", allTargetGenreIds)
    .neq("book_id", bookId)
    .limit(limit * 3);

  if (error || !relatedRows) {
    return [];
  }

  // 3. Deduplicate and prioritize books matching the primary genre
  const seenIds = new Set<string>();
  const primaryMatches: RelatedBookDto[] = [];
  const secondaryMatches: RelatedBookDto[] = [];

  for (const row of relatedRows) {
    const b = (row as any).books;
    if (!b || seenIds.has(b.id)) continue;
    seenIds.add(b.id);

    const authors = (b.book_authors || [])
      .map((ba: any) => ({ name: ba.authors?.name || "" }))
      .filter((a: any) => a.name);

    const genres = (b.book_genres || [])
      .map((bg: any) => ({ name: bg.genres?.name || "" }))
      .filter((g: any) => g.name);

    const pubDate = b.release_date || null;
    const publicationYear = pubDate ? new Date(pubDate).getFullYear() : null;

    const dto: RelatedBookDto = {
      id: b.id,
      title: b.title,
      coverUrl: b.cover_url || null,
      authors,
      genres,
      publishedDate: pubDate,
      publicationYear,
      isFeatured: b.is_featured || false,
    };

    if (row.genre_id === primaryGenreId) {
      primaryMatches.push(dto);
    } else {
      secondaryMatches.push(dto);
    }
  }

  return [...primaryMatches, ...secondaryMatches].slice(0, limit);
}
