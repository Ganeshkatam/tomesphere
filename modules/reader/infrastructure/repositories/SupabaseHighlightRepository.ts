import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";
import { HighlightRepository } from "../../domain/repositories/HighlightRepository";
import { HighlightDto } from "../../application/dto/response/HighlightDto";

export class SupabaseHighlightRepository implements HighlightRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getHighlights(userId: string, bookId: string): Promise<HighlightDto[]> {
    const { data, error } = await this.supabase
      .from("reader_highlights")
      .select("*")
      .match({ user_id: userId, book_id: bookId });

    if (error || !data) return [];

    return data.map((row: any) => ({
      id: row.id,
      bookId: row.book_id,
      text: row.selected_text,
      location: JSON.stringify(row.location_anchor), // Convert to string as per HighlightDto
      chapter: null,
      color: row.color || "yellow",
      note: null,
      createdAt: row.created_at || new Date().toISOString(),
      updatedAt: row.created_at || new Date().toISOString(), // No updated_at on this table
    }));
  }

  async createHighlight(userId: string, bookId: string, location: string, selectedText: string, color?: string): Promise<HighlightDto> {
    const { data, error } = await this.supabase
      .from("reader_highlights")
      .insert({
        user_id: userId,
        book_id: bookId,
        location_anchor: JSON.parse(location),
        selected_text: selectedText,
        color: color || null,
      })
      .select("*")
      .single();

    if (error || !data) {
      throw new Error(`Failed to create highlight: ${error?.message}`);
    }

    return {
      id: data.id,
      bookId: data.book_id,
      text: data.selected_text,
      location: JSON.stringify(data.location_anchor),
      chapter: null,
      color: data.color || "yellow",
      note: null,
      createdAt: data.created_at || new Date().toISOString(),
      updatedAt: data.created_at || new Date().toISOString(),
    };
  }

  async deleteHighlight(id: string, userId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from("reader_highlights")
      .delete()
      .match({ id, user_id: userId });

    return !error;
  }
}
