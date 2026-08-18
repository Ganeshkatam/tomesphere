import Image from "next/image";
import { BookDetailDto } from "@/modules/library/application/dto/response/BookDetailDto";
import { generateSimpleDescription } from "@/modules/storage/services/pdf-description-generator";

interface BookDetailHeroProps {
  book: BookDetailDto;
}

export function BookDetailHero({ book }: BookDetailHeroProps) {
  return (
    <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-start">
      {/* Cover */}
      <div className="w-full max-w-[280px] shrink-0 mx-auto md:mx-0">
        <div className="relative aspect-[2/3] w-full rounded-md overflow-hidden shadow-sm border border-surface-variant/30">
          {book.coverUrl ? (
            <Image
              src={book.coverUrl}
              alt={`Cover of ${book.title}`}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 280px"
            />
          ) : (
            <div className="w-full h-full bg-surface-variant/20 flex flex-col items-center justify-center p-6 text-center">
              <span className="font-serif text-lg text-foreground/70 mb-2">{book.title}</span>
              <span className="text-sm text-foreground/50">
                {book.authors?.map(a => a.name).join(", ")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Metadata & Description */}
      <div className="flex flex-col flex-1 min-w-0 pt-2">
        <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-foreground mb-4 leading-tight">
          {book.title}
        </h1>
        
        <p className="text-xl md:text-2xl text-foreground/70 mb-8 font-light">
          by {book.authors?.map((a) => a.name).join(", ") || "Unknown"}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-3 mb-10">
          {book.genres?.slice(0, 3).map((g) => (
            <span key={g.id} className="px-3 py-1 bg-surface-variant/30 rounded text-sm text-foreground/80 font-medium">
              {g.name}
            </span>
          ))}
          {book.pageCount && (
            <span className="px-3 py-1 bg-surface-variant/30 rounded text-sm text-foreground/80 font-medium">
              {book.pageCount} pages
            </span>
          )}
          {book.publishedDate && (
            <span className="px-3 py-1 bg-surface-variant/30 rounded text-sm text-foreground/80 font-medium">
              {new Date(book.publishedDate).getFullYear()}
            </span>
          )}
        </div>

        {/* Description */}
        <div className="prose prose-slate dark:prose-invert max-w-3xl text-foreground/80 leading-relaxed font-serif text-lg">
          <p>
            {book.description ||
              generateSimpleDescription(
                book.title,
                book.authors?.map((a) => a.name).join(", ") || "Unknown",
              )}
          </p>
        </div>
      </div>
    </div>
  );
}
