import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";

export interface SearchDocumentData {
  book_id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  authors: string[];
  genres: string[];
  subjects: string[];
  language: string;
  publication_year?: number;
  is_public: boolean;
  popularity_score: number;
  download_count: number;
  view_count: number;
  average_rating: number;
  rating_count: number;
  source_updated_at?: string;
  indexed_by?: string;
  last_index_reason: "CREATE" | "UPDATE" | "DELETE" | "REBUILD";
  last_index_duration_ms: number;
  last_projection_version: number;
}

export class SearchProjectionRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async upsert(document: SearchDocumentData): Promise<void> {
    const { error } = await this.supabase
      .from("discovery_search_documents" as any)
      .upsert(
        {
          ...document,
          // The fts_tokens tsvector will ideally be calculated on the DB side via a trigger
          projection_version: document.last_projection_version,
          indexed_at: new Date().toISOString(),
        },
        {
          onConflict: "book_id",
        },
      );

    if (error) {
      throw new Error(`Failed to upsert search projection: ${error.message}`);
    }
  }

  async remove(bookId: string): Promise<void> {
    const { error } = await this.supabase
      .from("discovery_search_documents")
      .delete()
      .eq("book_id", bookId);

    if (error) {
      throw new Error(`Failed to remove search projection: ${error.message}`);
    }
  }
}
