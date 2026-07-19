import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";
import { BookmarkRepository } from "../../domain/repositories/BookmarkRepository";
import { BookmarkDto } from "../../application/dto/response/BookmarkDto";

export class SupabaseBookmarkRepository implements BookmarkRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getBookmarks(userId: string, bookId: string): Promise<BookmarkDto[]> {
    const { data, error } = await this.supabase
      .from("bookmarks")
      .select("*")
      .match({ user_id: userId, book_id: bookId })
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data.map((row: any) => ({
      id: row.id,
      bookId: row.book_id,
      location: String(row.page_number), // using page_number as location
      chapter: null,
      name: row.label || null,
      orderIndex: row.page_number,
      createdAt: row.created_at || new Date().toISOString(),
    }));
  }

  async createBookmark(userId: string, bookId: string, location: string, name?: string): Promise<BookmarkDto> {
    const pageNumber = parseInt(location, 10) || 0;
    
    const { data, error } = await this.supabase
      .from("bookmarks")
      .insert({
        user_id: userId,
        book_id: bookId,
        page_number: pageNumber,
        label: name || null,
      })
      .select("*")
      .single();

    if (error || !data) {
      throw new Error(`Failed to create bookmark: ${error?.message}`);
    }

    return {
      id: data.id,
      bookId: data.book_id,
      location: String(data.page_number),
      chapter: null,
      name: data.label || null,
      orderIndex: data.page_number,
      createdAt: data.created_at || new Date().toISOString(),
    };
  }

  async deleteBookmark(id: string, userId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from("bookmarks")
      .delete()
      .match({ id, user_id: userId });

    return !error;
  }
}
