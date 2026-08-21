import { createSupabaseServerClient } from "@/shared/core/database/server";
import { RelatedBookDto } from "../GetRelatedBooks/handler";

export interface AuthorBooksDto {
  authorName: string;
  books: RelatedBookDto[];
}

export async function getBooksByAuthor(
  bookId: string,
  limit: number = 8
): Promise<AuthorBooksDto | null> {
  const supabase = await createSupabaseServerClient();

  // 1. Get author IDs and primary author name for this book
  const { data: bookAuthorRows } = await supabase
    .from("book_authors")
    .select("author_id, authors(name)")
    .eq("book_id", bookId);

  if (!bookAuthorRows || bookAuthorRows.length === 0) {
    return null;
  }

  const authorIds = bookAuthorRows.map((ba: any) => ba.author_id);
  const firstAuthor: any = bookAuthorRows[0]?.authors;
  const primaryAuthorName =
    (Array.isArray(firstAuthor) ? firstAuthor[0]?.name : firstAuthor?.name) || "Author";

  // 2. Fetch other books by these author(s)
  const { data: relatedRows, error } = await supabase
    .from("book_authors")
    .select(
      `
      author_id,
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
    .in("author_id", authorIds)
    .neq("book_id", bookId)
    .limit(limit * 2);

  if (error || !relatedRows || relatedRows.length === 0) {
    return {
      authorName: primaryAuthorName,
      books: [],
    };
  }

  // 3. Deduplicate books
  const seenIds = new Set<string>();
  const books: RelatedBookDto[] = [];

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

    books.push({
      id: b.id,
      title: b.title,
      coverUrl: b.cover_url || null,
      authors,
      genres,
      publishedDate: pubDate,
      publicationYear,
      isFeatured: b.is_featured || false,
    });

    if (books.length >= limit) break;
  }

  return {
    authorName: primaryAuthorName,
    books,
  };
}
