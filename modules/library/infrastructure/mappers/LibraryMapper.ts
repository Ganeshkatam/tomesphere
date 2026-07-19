import { Tables } from "@/shared/core/types/supabase";
import { LibraryBook } from "../../domain/entities/LibraryBook";
import { ReadingStateValue } from "../../domain/value-objects";

type LibraryBookRow = Tables<"library_books">;

export class LibraryMapper {
  static toDomain(
    row: LibraryBookRow,
    isFavorite: boolean = false,
  ): LibraryBook {
    return LibraryBook.fromPersistence(
      row.id,
      row.user_id,
      row.book_id as string,
      row.status as ReadingStateValue,
      0, // Default progress for now
      null, // No started_at in library_books
      null, // No finished_at in library_books
      row.updated_at ? new Date(row.updated_at) : new Date(),
      isFavorite,
    );
  }

  static toPersistence(entity: LibraryBook): LibraryBookRow {
    return {
      user_id: entity.userId.value,
      book_id: entity.bookId,
      status: (entity.state.value === "abandoned"
        ? "finished"
        : entity.state.value) as Tables<"library_books">["status"], // Map abandoned to finished for DB
      queue_order: null, // Default
      updated_at: entity.updatedAt.toISOString(),
      id: entity.id, // Supposed to be auto-generated or ignored in upsert if using compound key
      added_at: new Date().toISOString(), // Let DB handle this usually
    };
  }
}
