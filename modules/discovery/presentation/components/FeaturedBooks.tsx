import Link from "next/link";
import { BookSummaryDto } from "../../application/dto/BookSummaryDto";
import { BookCard } from "./BookCard";

interface FeaturedBooksProps {
  items: readonly Partial<BookSummaryDto>[];
}

export function FeaturedBooks({ items }: FeaturedBooksProps) {
  if (!items || items.length === 0) {
    return null; // Silently omit if empty as requested
  }

  const [primary, ...secondary] = items as BookSummaryDto[];

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full min-w-0">
      {/* Primary Featured Item */}
      <div className="flex-1 min-w-0">
        <Link href={`/book/${primary.slug || primary.id}`} className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded-md">
          <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
            <div className="relative w-[200px] md:w-[260px] lg:w-[320px] flex-shrink-0 aspect-[2/3] bg-surface-variant/20 rounded shadow-md overflow-hidden transition-all duration-300 ease-in-out group-hover:-translate-y-[2px] group-hover:shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={primary.coverUrl || "/covers/default.png"}
                alt={`Cover of ${primary.title}`}
                className="w-full h-full object-cover"
                loading="eager" // High-priority LCP candidate
              />
            </div>
            
            <div className="flex flex-col gap-2 pt-2 md:pt-6">
              <span className="text-label-md font-medium tracking-widest uppercase text-primary mb-1">
                Featured Selection
              </span>
              <h3 className="font-serif text-headline-md md:text-headline-lg lg:text-display-sm text-on-surface transition-colors duration-200 group-hover:text-primary">
                {primary.title}
              </h3>
              <p className="text-body-lg text-on-surface-variant">
                {primary.authors?.length > 0
                  ? primary.authors.map(a => a.name).join(", ")
                  : "Unknown Author"}
              </p>
              
              {(primary.publicationYear || primary.language) && (
                <p className="text-body-md text-on-surface-variant/70 mt-2">
                  {[primary.language, primary.publicationYear].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>
          </div>
        </Link>
      </div>

      {/* Secondary Items */}
      {secondary.length > 0 && (
        <div className="lg:w-[320px] xl:w-[400px] flex-shrink-0 flex flex-col gap-4 min-w-0">
          <h4 className="font-serif text-title-md text-on-surface border-b border-outline-variant/30 pb-2 mb-2">
            Also featured
          </h4>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            {secondary.map((book) => (
              <Link
                key={book.id || book.slug}
                href={`/book/${book.slug || book.id}`}
                className="group flex gap-4 items-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md p-1 -m-1"
              >
                <div className="relative w-16 md:w-20 flex-shrink-0 aspect-[2/3] bg-surface-variant/20 rounded shadow-sm overflow-hidden transition-transform duration-200 group-hover:-translate-y-px">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={book.coverUrl || "/covers/default.png"}
                    alt={`Cover of ${book.title}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col gap-0.5 pt-1 min-w-0">
                  <h5 className="font-serif text-title-sm text-on-surface line-clamp-2 transition-colors group-hover:text-primary">
                    {book.title}
                  </h5>
                  <p className="text-body-sm text-on-surface-variant line-clamp-1">
                    {book.authors?.length > 0
                      ? book.authors.map(a => a.name).join(", ")
                      : "Unknown"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
