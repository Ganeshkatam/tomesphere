"use client";

import Link from "next/link";
import Image from "next/image";
import { BookSummaryDto } from "../../application/dto/BookSummaryDto";
import { Star, BookOpen, ArrowRight, Sparkles, ChevronRight } from "lucide-react";
import DefaultBookCover from "@/modules/books/components/DefaultBookCover";

interface FeaturedBooksProps {
  items: readonly Partial<BookSummaryDto>[];
}

export function FeaturedBooks({ items }: FeaturedBooksProps) {
  if (!items || items.length === 0) {
    return null;
  }

  const [primary, ...secondary] = items as BookSummaryDto[];
  const primaryAuthors = primary.authors?.map((a) => a.name).join(", ") || "Unknown Author";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch w-full min-w-0">
      {/* Primary Spotlight Banner (8 Cols on LG) */}
      <div className="lg:col-span-8 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white border border-indigo-800/40 shadow-xl relative overflow-hidden group">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row gap-6 lg:gap-8 items-start sm:items-center">
          {/* Cover */}
          <div className="relative w-36 sm:w-44 md:w-52 aspect-[2/3] shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10 group-hover:scale-[1.02] transition-transform duration-300">
            {primary.coverUrl ? (
              <Image
                src={primary.coverUrl.replace(/ /g, "%20")}
                alt={primary.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 144px, 208px"
                priority
              />
            ) : (
              <DefaultBookCover title={primary.title} authors={primary.authors} />
            )}
          </div>

          {/* Book Info */}
          <div className="flex-1 flex flex-col justify-between space-y-4 min-w-0">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[11px] font-extrabold uppercase tracking-wider">
                <Sparkles size={12} className="text-amber-400" />
                <span>Featured Selection</span>
              </div>

              <h3 className="font-display text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-snug line-clamp-2">
                {primary.title}
              </h3>

              <p className="text-xs sm:text-sm text-indigo-200 font-medium line-clamp-1">
                by <span className="text-white font-bold">{primaryAuthors}</span>
              </p>

              {(primary.publicationYear || primary.language) && (
                <div className="flex items-center gap-2 text-xs text-indigo-300/80 pt-1 font-semibold">
                  {primary.publicationYear && (
                    <span className="px-2.5 py-0.5 rounded-md bg-white/10 text-white font-mono text-[11px]">
                      {primary.publicationYear}
                    </span>
                  )}
                  {primary.language && <span>{primary.language.toUpperCase()}</span>}
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-3 pt-2">
              <Link
                href={`/read/${primary.id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <BookOpen size={15} />
                <span>Start Reading</span>
              </Link>
              <Link
                href={`/book/${primary.slug || primary.id}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold transition-all border border-white/10 cursor-pointer"
              >
                <span>Book Details</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Featured List (4 Cols on LG) */}
      {secondary.length > 0 && (
        <div className="lg:col-span-4 flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
              <h4 className="font-display font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                Also Hand-Picked
              </h4>
              <span className="text-[11px] font-bold text-slate-400">
                {secondary.slice(0, 3).length} Titles
              </span>
            </div>

            <div className="space-y-3.5">
              {secondary.slice(0, 3).map((book) => {
                const author = book.authors?.map((a) => a.name).join(", ") || "Unknown Author";
                return (
                  <Link
                    key={book.id}
                    href={`/book/${book.slug || book.id}`}
                    className="flex items-center gap-3.5 p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent hover:border-slate-200 dark:hover:border-slate-700/80 transition-all group"
                  >
                    <div className="relative w-12 sm:w-14 aspect-[2/3] shrink-0 rounded-xl overflow-hidden shadow-sm border border-slate-200/60 dark:border-slate-800 group-hover:scale-105 transition-transform">
                      {book.coverUrl ? (
                        <Image
                          src={book.coverUrl.replace(/ /g, "%20")}
                          alt={book.title}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      ) : (
                        <DefaultBookCover title={book.title} authors={book.authors} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {book.title}
                      </h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 font-medium">
                        by {author}
                      </p>
                      {book.publicationYear && (
                        <span className="inline-block mt-1 text-[10px] font-mono font-semibold text-slate-400">
                          {book.publicationYear}
                        </span>
                      )}
                    </div>

                    <ChevronRight size={14} className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>

          <Link
            href="/discover/featured"
            className="inline-flex items-center justify-center gap-1.5 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <span>View All Curated Collections</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      )}
    </div>
  );
}
