import { createSupabaseServerClient } from "@/shared/core/database/server";
import { BookDetailDto } from "@/modules/library/application/dto/response/BookDetailDto";

export async function getBookDetail(id: string): Promise<BookDetailDto | null> {
  const supabase = await createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from("books")
    .select(
      `
      id,
      title,
      cover_url,
      description,
      release_date,
      pages,
      publisher,
      isbn,
      edition,
      language,
      is_textbook,
      book_authors ( authors ( name ) ),
      book_genres ( genres ( name ) )
      `
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  const raw = data as any;
  
  return {
    id: raw.id,
    title: raw.title,
    coverUrl: raw.cover_url ? raw.cover_url.replace(/ /g, "%20") : null,
    description: raw.description,
    authors: raw.book_authors?.map((ba: any) => ({ name: ba.authors?.name })).filter((a: any) => a.name) || [],
    genres: raw.book_genres?.map((bg: any) => ({ name: bg.genres?.name })).filter((g: any) => g.name) || [],
    subjects: [], // Not consumed by UI
    pageCount: raw.pages,
    publishedDate: raw.release_date,
    publisher: raw.publisher || null,
    isbn: raw.isbn || null,
    edition: raw.edition || null,
    language: raw.language || "English",
    isTextbook: raw.is_textbook || false,
    isPublicDomain: false, // Could compute this from release_date if needed
  };
}
