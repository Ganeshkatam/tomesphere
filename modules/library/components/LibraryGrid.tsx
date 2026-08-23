"use client";

import BookCard from "@/modules/books/components/BookCard";
import { LibraryBookDto } from "../application/dto/response/LibraryBookDto";
import { useLibraryStore } from "../store/library-store";

interface LibraryGridProps {
  books: LibraryBookDto[];
}

export default function LibraryGrid({ books }: LibraryGridProps) {
  const { toggleSelection, selection } = useLibraryStore();

  if (books.length === 0) {
    return null; // Empty state handled by parent
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-8">
      {books.map((item, idx) => {
        const isSelected = selection.includes(item.bookId);

        return (
          <div key={item.bookId} className="relative h-full group">
            {/* Selection indicator could go here for bulk actions */}
            <div
              className={`h-full transition-transform ${isSelected ? "scale-95 ring-2 ring-primary rounded-xl" : ""}`}
            >
              <BookCard
                priority={idx < 6}
                book={{
                  id: item.bookId,
                  title: item.title,
                  authors: item.authors || [],
                  coverUrl: item.coverUrl,
                  progress: item.progress,
                  currentPage: item.currentPage,
                  totalPages: item.totalPages,
                  status: item.status,
                }}
              />
            </div>

            {/* Context Menu trigger would be absolute positioned here or handled inside BookCard */}
          </div>
        );
      })}
    </div>
  );
}
