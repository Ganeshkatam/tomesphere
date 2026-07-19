"use server";

import { createSupabaseServerClient } from "@/shared/core/database/server";
import { SupabaseBookRepository } from "@/modules/books/infrastructure/SupabaseBookRepository";
import { getBook } from "@/modules/books/application/queries/GetBook/handler";
import { BookId } from "@/modules/books/domain/value-objects";
import { ServerActionResult } from "@/lib/actions/action-result";
import { BookDto } from "@/modules/library/application/dto/response/BookDto";

export async function getBookById(bookId: string): Promise<ServerActionResult<BookDto>> {
  try {
    const supabase = await createSupabaseServerClient();
    const repo = new SupabaseBookRepository(supabase);
    const data = await getBook(repo, { bookId: BookId.create(bookId) });
    if (!data) return { success: false, error: { message: "Not found" } };
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: { message: error.message || "An unexpected error occurred" } };
  }
}
