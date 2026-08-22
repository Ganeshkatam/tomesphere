"use client";

import BookCard from "@/modules/books/components/BookCard";
import { EmptyState } from "@/shared/ui/EmptyState";
import { BookSummaryDto } from "../../application/dto/BookSummaryDto";
import { addBookToLibraryAction } from "../actions/discovery";

interface BookGridProps {
  items: readonly BookSummaryDto[];
  priority?: boolean;
}

export function BookGrid({ items, priority = false }: BookGridProps) {
  if (!items || items.length === 0) {
    return (
      <EmptyState
        title="No books found"
        description="There are no books to display right now. Check back soon!"
      />
    );
  }

  const handleAddToList = async (
    bookId: string,
    status: "want_to_read" | "currently_reading" | "finished",
  ) => {
    try {
      await addBookToLibraryAction(bookId, status);
    } catch (error) {
      console.error("Failed to add book to library:", error);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5 min-w-0">
      {items.map((item, index) => (
        <BookCard
          key={item.id || item.slug || `book-${index}`}
          book={{
            id: item.id,
            slug: item.slug,
            title: item.title,
            authors: item.authors || [],
            genres: item.genres || [],
            coverUrl: item.coverUrl ? item.coverUrl.replace(/ /g, "%20") : null,
            language: item.language,
            publicationYear: item.publicationYear,
          }}
          priority={priority && index < 4}
          onAddToList={(status) => handleAddToList(item.id, status)}
        />
      ))}
    </div>
  );
}
