import Link from "next/link";
import { BookSummaryDto } from "../../application/dto/BookSummaryDto";

interface BookCardProps {
  book: BookSummaryDto;
  priority?: boolean;
}

export function BookCard({ book, priority = false }: BookCardProps) {
  // Deterministic fallback for covers
  const coverUrl = book.coverUrl || "/covers/default.png";

  return (
    <Link href={`/book/${book.slug || book.id}`} className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded-md">
      <div className="flex flex-col gap-3">
        {/* Cover Container */}
        <div className="relative w-full aspect-[2/3] bg-surface-variant/20 rounded shadow-sm overflow-hidden transition-all duration-200 ease-in-out group-hover:-translate-y-[2px] group-hover:shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverUrl}
            alt={`Cover of ${book.title}`}
            className="w-full h-full object-cover"
            loading={priority ? "eager" : "lazy"}
          />
        </div>
        
        {/* Metadata */}
        <div className="flex flex-col gap-0.5 px-0.5">
          <h3 className="font-serif text-title-md text-on-surface line-clamp-2 transition-colors duration-200 group-hover:text-primary">
            {book.title}
          </h3>
          <p className="text-body-md text-on-surface-variant line-clamp-1">
            {book.authors?.length > 0
              ? book.authors.map(a => a.name).join(", ")
              : "Unknown Author"}
          </p>
        </div>
      </div>
    </Link>
  );
}
