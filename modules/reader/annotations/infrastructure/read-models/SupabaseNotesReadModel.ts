import { SupabaseClient } from "@supabase/supabase-js";
import { NotesReadModel } from "../../application/ports/read-models/NotesReadModel";
import { NotesPageDto } from "../../application/dto/response/NotesPageDto";

export class SupabaseNotesReadModel implements NotesReadModel {
  constructor(private supabase: SupabaseClient) {}

  async getNotesPage(
    userId: string,
    limit: number,
    cursor: string | null
  ): Promise<NotesPageDto> {
    let query = this.supabase
      .from("notes")
      .select(`
        id,
        book_id,
        title,
        content,
        tags,
        created_at,
        updated_at,
        books ( title )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit + 1);

    if (cursor) {
      query = query.lt("created_at", cursor);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch notes: ${error.message}`);
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
      title: row.title,
      content: row.content,
      tags: row.tags || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at || row.created_at,
    }));

    return {
      items: dtos,
      nextCursor,
    };
  }
}
