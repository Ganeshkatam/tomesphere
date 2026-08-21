import { BookCard } from "./BookCard";
import { EmptyState } from "@/shared/ui/EmptyState";
import { BookSummaryDto } from "../../application/dto/BookSummaryDto";

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

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-4 sm:gap-6 min-w-0">
      {items.map((item, index) => (
        <BookCard 
          key={item.id || item.slug} 
          book={item} 
          priority={priority && index < 3} // Only eagerly load first few if this grid is high priority
        />
      ))}
    </div>
  );
}
