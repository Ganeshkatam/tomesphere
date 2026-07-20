import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";

export interface BookDetailDto {
  id: string;
  title: string;
  authors: string[];
  coverUrl: string | null;
  description: string | null;
  genres: string[];
  publishedDate: string | null;
  pageCount: number | null;
  isTextbook: boolean;
  subjects: string[];
  files: {
    id: string;
    format: string;
    storagePath: string;
    isPrimary: boolean;
  }[];
}

export class BookReadModel {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getBookDetails(id: string): Promise<BookDetailDto | null> {
    const { data, error } = await this.supabase
      .from("books")
      .select(
        `
        *,
        book_authors ( authors ( name ) ),
        book_genres ( genres ( name ) ),
        book_subjects ( subjects ( name ) ),
        book_files ( id, format, storage_path, is_primary )
      `,
      )
      .eq("id", id)
      .single();

    if (error || !data) return null;

    const raw = data as any;
    return {
      id: raw.id,
      title: raw.title,
      authors:
        raw.book_authors?.map((ba: any) => ba.authors?.name).filter(Boolean) ||
        [],
      coverUrl: raw.cover_url,
      description: raw.description,
      genres:
        raw.book_genres?.map((bg: any) => bg.genres?.name).filter(Boolean) ||
        [],
      publishedDate: raw.release_date,
      pageCount: raw.pages,
      isTextbook: raw.is_textbook || false,
      subjects:
        raw.book_subjects
          ?.map((bs: any) => bs.subjects?.name)
          .filter(Boolean) || [],
      files: (raw.book_files || []).map((f: any) => ({
        id: f.id,
        format: f.format,
        storagePath: f.storage_path,
        isPrimary: f.is_primary,
      })),
    };
  }
}
