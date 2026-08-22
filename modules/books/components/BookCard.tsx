"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Plus, BookOpen, Clock, Check, Star } from "lucide-react";
import { generateSimpleDescription } from "@/modules/storage/services/pdf-description-generator";
import DefaultBookCover from "./DefaultBookCover";

export interface BookCardModel {
  readonly id: string;
  readonly slug?: string;
  readonly title: string;
  readonly authors: readonly { readonly name: string }[];
  readonly genres?: readonly { readonly name: string }[];
  readonly coverUrl: string | null;
  readonly language?: string | null;
  readonly publishedDate?: string | null;
  readonly publicationYear?: number | null;
  readonly isFeatured?: boolean;
  readonly progress?: number;
  readonly currentPage?: number;
  readonly totalPages?: number;
  readonly status?:
    | "want_to_read"
    | "currently_reading"
    | "finished"
    | "reading"
    | "abandoned"
    | "none";
}

interface BookCardProps {
  book: BookCardModel;
  onAddToList?: (
    status: "want_to_read" | "currently_reading" | "finished",
  ) => void;
  priority?: boolean;
}

export default function BookCard({
  book,
  onAddToList,
  priority = false,
}: BookCardProps) {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const authorNames = useMemo(() => {
    if (!book.authors || book.authors.length === 0) return "TomeSphere Library";
    const names = book.authors
      .map((a: any) => (typeof a === "string" ? a : a?.name))
      .filter(Boolean);
    return names.length > 0 ? names.join(", ") : "TomeSphere Library";
  }, [book.authors]);

  const year =
    book.publicationYear ||
    (book.publishedDate
      ? new Date(book.publishedDate).getFullYear()
      : "Archive");

  const genreName = useMemo(() => {
    const firstGenre = book.genres?.[0];
    if (!firstGenre) return "Literature";
    const name =
      typeof firstGenre === "string" ? firstGenre : (firstGenre as any)?.name;
    return name || "Literature";
  }, [book.genres]);

  const handleCardClick = () => {
    router.push(`/book/${book.slug || book.id}`);
  };

  return (
    <div className="relative w-full flex flex-col group select-none">
      {/* Book Card Shell */}
      <div
        onClick={handleCardClick}
        className="w-full rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/60 shadow-xs hover:shadow-xl hover:-translate-y-1.5 cursor-pointer flex flex-col transition-all duration-300 [transform:translateZ(0)]"
      >
        {/* Cover Aspect [2/3] with Quick Hover Action Overlay */}
        <div className="relative aspect-[2/3] w-full shrink-0 overflow-hidden rounded-t-2xl bg-slate-100 dark:bg-slate-950">
          {!imageLoaded && book.coverUrl && !hasError && (
            <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse z-0" />
          )}

          {book.coverUrl && !hasError ? (
            <Image
              src={book.coverUrl}
              alt={book.title}
              fill
              sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, 240px"
              priority={priority}
              unoptimized={true}
              className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageLoaded(true);
                setHasError(true);
              }}
            />
          ) : (
            <DefaultBookCover
              title={book.title}
              authors={authorNames}
              genre={genreName}
            />
          )}

          {/* Featured Badge */}
          {book.isFeatured && (
            <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-2 py-0.5 rounded-md text-[9px] font-black shadow-md flex items-center gap-0.5 z-10">
              <Star size={9} fill="currentColor" />
              <span>Featured</span>
            </div>
          )}

          {/* Hover Overlay with Read Button */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3 z-10">
            <Link
              href={`/read/${book.id}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-slate-950 dark:bg-white dark:text-slate-950 hover:bg-indigo-50 font-extrabold text-xs shadow-lg active:scale-95 transition-transform"
            >
              <Play size={12} className="fill-slate-950" />
              <span>
                {book.status === "reading" ||
                book.status === "currently_reading"
                  ? "Resume"
                  : book.status === "finished"
                    ? "Re-read"
                    : "Read"}
              </span>
            </Link>

            {/* Shelf Add Button */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="w-7 h-7 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition-colors cursor-pointer shadow-md active:scale-95"
                title="Add to shelf"
              >
                <Plus size={13} />
              </button>

              {showMenu && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 bottom-full mb-2 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in duration-150 p-1 text-xs"
                >
                  <button
                    type="button"
                    onClick={() => {
                      onAddToList?.("want_to_read");
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 w-full text-left px-2.5 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <BookOpen size={12} className="text-amber-500" />
                    <span>Want to Read</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onAddToList?.("currently_reading");
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 w-full text-left px-2.5 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Clock size={12} className="text-indigo-500" />
                    <span>Currently Reading</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onAddToList?.("finished");
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 w-full text-left px-2.5 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Check size={12} className="text-emerald-500" />
                    <span>Finished</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card Details Section Below Cover */}
        <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between bg-white dark:bg-slate-900">
          <div>
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white line-clamp-1 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {book.title}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
              by {authorNames}
            </p>
          </div>

          <div className="mt-2 space-y-1.5">
            {/* Reading Progress Indicator if present */}
            {typeof book.progress === "number" && book.progress > 0 && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[9px] font-bold text-indigo-600 dark:text-indigo-400">
                  <span>
                    {book.status === "finished"
                      ? "Finished"
                      : book.currentPage && book.totalPages
                        ? `p. ${book.currentPage}/${book.totalPages}`
                        : `${book.progress}%`}
                  </span>
                  <span>{book.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      book.status === "finished"
                        ? "bg-emerald-500"
                        : "bg-indigo-600"
                    }`}
                    style={{ width: `${Math.max(4, book.progress)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Genre & Year */}
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate">
              {genreName} • {year}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
