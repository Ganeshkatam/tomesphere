"use client";

import Link from "next/link";
import Image from "next/image";
import { BookSummaryDto } from "../../application/dto/BookSummaryDto";
import DefaultBookCover from "@/modules/books/components/DefaultBookCover";

interface BookCardProps {
  book: BookSummaryDto;
  priority?: boolean;
}

export function BookCard({ book, priority = false }: BookCardProps) {
  const authorNames =
    book.authors && book.authors.length > 0
      ? book.authors.map((a) => a.name).join(", ")
      : "Public Domain";

  return (
    <Link
      href={`/book/${book.slug || book.id}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-2xl"
    >
      <div className="flex flex-col gap-3">
        {/* Cover Container */}
        <div className="relative w-full aspect-[2/3] bg-slate-100 dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden border border-slate-200/60 dark:border-slate-800 transition-all duration-300 ease-out group-hover:-translate-y-1.5 group-hover:shadow-xl group-hover:border-indigo-300 dark:group-hover:border-indigo-700/60">
          {book.coverUrl ? (
            <Image
              src={book.coverUrl.replace(/ /g, "%20")}
              alt={`Cover of ${book.title}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              priority={priority}
            />
          ) : (
            <DefaultBookCover title={book.title} authors={book.authors} />
          )}

          {book.publicationYear && (
            <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-mono font-bold text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
              {book.publicationYear}
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="flex flex-col gap-1 px-1">
          <h3 className="font-display font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 transition-colors duration-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
            {book.title}
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-1 font-medium">
            {authorNames}
          </p>
        </div>
      </div>
    </Link>
  );
}
