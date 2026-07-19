import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";
import { LibraryWriteRepository } from "../../domain/repositories/LibraryWriteRepository";

export class SupabaseLibraryWriteRepository implements LibraryWriteRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  async addBookToLibrary(userId: string, bookId: string, state: string): Promise<void> {
    const { error } = await this.supabase
      .from("library_books")
      .upsert({
        user_id: userId,
        book_id: bookId,
        status: state as any,
        added_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id, book_id" });

    if (error) {
      console.error("SupabaseLibraryWriteRepository.addBookToLibrary error:", error);
      throw new Error("Failed to add book to library");
    }
  }

  async removeBookFromLibrary(userId: string, bookId: string): Promise<void> {
    const { error } = await this.supabase
      .from("library_books")
      .delete()
      .match({ user_id: userId, book_id: bookId });

    if (error) {
      console.error("SupabaseLibraryWriteRepository.removeBookFromLibrary error:", error);
      throw new Error("Failed to remove book from library");
    }
  }
}
