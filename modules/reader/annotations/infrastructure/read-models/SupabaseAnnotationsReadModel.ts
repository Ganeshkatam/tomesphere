import { SupabaseClient } from "@supabase/supabase-js";
import { AnnotationsReadModel } from "../../application/ports/read-models/AnnotationsReadModel";
import { AnnotationsPageDto } from "../../application/dto/response/AnnotationsPageDto";

export class SupabaseAnnotationsReadModel implements AnnotationsReadModel {
  constructor(private supabase: SupabaseClient) {}

  async getAnnotationsPage(
    userId: string,
    limit: number,
    cursor: string | null
  ): Promise<AnnotationsPageDto> {
    let query = this.supabase
      .from("annotations")
      .select(`
        id,
        book_id,
        highlight_id,
        location_anchor,
        body_markdown,
        created_at,
        updated_at,
        books ( title ),
        highlights ( selected_text )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit + 1);

    if (cursor) {
      query = query.lt("created_at", cursor);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch annotations: ${error.message}`);
    }

    if (!data) {
      return { items: [], nextCursor: null };
    }

    const hasMore = data.length > limit;
    const items = hasMore ? data.slice(0, limit) : data;
    
    let nextCursor: string | null = null;
    if (hasMore && items.length > 0) {
      nextCursor = items[items.length - 1].created_at;
    }

    const dtos = items.map((row: any) => ({
      id: row.id,
      bookId: row.book_id,
      bookTitle: row.books?.title,
      bodyMarkdown: row.body_markdown,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      
      highlightId: row.highlight_id,
      // If highlights is an array (e.g. one-to-many from the DB perspective but we only expect one), safely extract it
      highlightText: Array.isArray(row.highlights) 
        ? row.highlights[0]?.selected_text || null 
        : row.highlights?.selected_text || null,
      locationAnchor: row.location_anchor,
    }));

    return {
      items: dtos,
      nextCursor,
    };
  }
}
