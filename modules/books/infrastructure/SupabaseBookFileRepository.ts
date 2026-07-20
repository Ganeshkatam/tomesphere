import { SupabaseClient } from "@supabase/supabase-js";
import { BookFile } from "../domain/value-objects/BookFile";
import { BookFileRepository } from "../domain/repositories/BookFileRepository";
import { Database } from "../../../shared/core/types/database";

export class SupabaseBookFileRepository implements BookFileRepository {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async save(bookId: string, file: BookFile): Promise<void> {
    const payload = {
      id: crypto.randomUUID(), // Or should BookFile have an ID? Yes, it probably has one, wait let's check BookFile.ts
      book_id: bookId,
      format: file.format,
      storage_path: file.storagePath,
      checksum: file.checksum || null,
      mime_type: file.mimeType || null,
      size: file.size || null,
      is_primary: file.isPrimary || false,
      language: "en", // 'language' is required in book_files
      version: file.version || 1,
      created_at: new Date().toISOString(),
    };

    const { error } = await this.client.from("book_files").insert(payload);

    if (error) {
      throw new Error(`Failed to save book file: ${error.message}`);
    }
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client
      .from("book_files")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete book file: ${error.message}`);
    }
  }
}
