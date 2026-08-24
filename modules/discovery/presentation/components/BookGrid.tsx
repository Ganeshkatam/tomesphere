"use client";

import Link from "next/link";
import BookCard from "@/modules/books/components/BookCard";
import { EmptyState } from "@/shared/ui/EmptyState";
import { BookSummaryDto } from "../../application/dto/BookSummaryDto";
import { addBookToLibraryAction } from "../actions/discovery";
import { BookOpen, ArrowRight } from "lucide-react";

interface BookGridProps {
  items: readonly BookSummaryDto[];
  priority?: boolean;
}

export function BookGrid({ items, priority = false }: BookGridProps) {
  if (!items || items.length === 0) {
    return (
      <EmptyState
        icon={<BookOpen size={28} className="text-indigo-500" />}
        title="No Books Found in this Category"
        description="There are currently no items matching this category filter. Browse our full archive to discover verified digital editions."
        action={
          <Link
            href="/discover"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <span>Explore All Archives</span>
            <ArrowRight size={14} />
          </Link>
        }
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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 min-w-0 animate-in fade-in duration-300">
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
