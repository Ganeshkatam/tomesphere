"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Plus, BookOpen, Clock, Check, Info, Star } from "lucide-react";
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
}

interface BookCardProps {
  book: BookCardModel;
  onAddToList?: (
    status: "want_to_read" | "currently_reading" | "finished",
  ) => void;
  priority?: boolean;
}

export default function BookCard({ book, onAddToList, priority = false }: BookCardProps) {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [alignment, setAlignment] = useState<"center" | "left" | "right">("center");
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const authorNames = useMemo(() => {
    if (!book.authors || book.authors.length === 0) return "TomeSphere Library";
    const names = book.authors
      .map((a: any) => (typeof a === "string" ? a : a?.name))
      .filter(Boolean);
    return names.length > 0 ? names.join(", ") : "TomeSphere Library";
  }, [book.authors]);

  const displayDescription = useMemo(() => {
    return generateSimpleDescription(book.title, authorNames);
  }, [book.title, authorNames]);

  const year = book.publicationYear || (book.publishedDate
    ? new Date(book.publishedDate).getFullYear()
    : "2025");

  const genreName = useMemo(() => {
    const firstGenre = book.genres?.[0];
    if (!firstGenre) return "Digital Archive";
    const name = typeof firstGenre === "string" ? firstGenre : (firstGenre as any)?.name;
    return name || "Digital Archive";
  }, [book.genres]);
  const language = book.language || "English";

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);

    if (cardRef.current && typeof window !== "undefined") {
      const rect = cardRef.current.getBoundingClientRect();
      const popupWidth = Math.min(window.innerWidth * 0.94, window.innerWidth >= 768 ? 340 : 320);
      const halfPopup = popupWidth / 2;
      const cardCenter = rect.left + rect.width / 2;
      const edgePadding = 24;

      if (cardCenter - halfPopup < edgePadding) {
        setAlignment("left");
      } else if (cardCenter + halfPopup > window.innerWidth - edgePadding) {
        setAlignment("right");
      } else {
        setAlignment("center");
      }
    }

    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 450); // 450ms deliberate hover intent delay
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHovered(false);
    setShowMenu(false);
  };

  const handleCardClick = () => {
    router.push(`/book/${book.id}`);
  };

  return (
    <div
      ref={cardRef}
      className={`relative w-full h-full select-none ${isHovered ? "z-50" : "z-10"}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 1. Base Card with Visible Details (Smart Viewport Adaptive) */}
      <div
        onClick={handleCardClick}
        className="w-full h-full rounded-xl sm:rounded-2xl overflow-hidden bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 shadow-xs hover:shadow-xl cursor-pointer flex flex-col transition-all duration-300 group"
      >
        {/* Cover Aspect [2/3] */}
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
          {!imageLoaded && book.coverUrl && !hasError && (
            <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse z-0" />
          )}

          {book.coverUrl && !hasError ? (
            <Image
              src={book.coverUrl}
              alt={book.title}
              fill
              sizes="(max-width: 480px) 40vw, (max-width: 768px) 30vw, 220px"
              priority={priority}
              unoptimized={true}
              className={`object-cover transition-transform duration-500 ${
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
            <div className="absolute top-1.5 sm:top-2.5 right-1.5 sm:right-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-1.5 sm:px-2 py-0.5 rounded sm:rounded-md text-[9px] sm:text-[10px] font-extrabold shadow-lg flex items-center gap-0.5 sm:gap-1 z-10">
              <Star size={9} fill="currentColor" />
              <span>Featured</span>
            </div>
          )}
        </div>

        {/* Base Details Section (Visible Below Cover) */}
        <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between bg-white dark:bg-slate-900/90">
          <div>
            <h4 className="text-[11px] sm:text-xs md:text-sm font-bold text-slate-900 dark:text-white line-clamp-1 truncate leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {book.title}
            </h4>
            <p className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-400 truncate mt-0.5 font-medium">
              by {authorNames}
            </p>
          </div>
          <p className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate mt-1">
            {genreName} • {year}
          </p>
        </div>
      </div>

      {/* 2. Hotstar / Netflix Floating Expanded Preview Card on Hover (Theme-Adaptive Smart Edge-Aware) */}
      {isHovered && (
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-[min(94vw,290px)] sm:w-[320px] md:w-[340px] max-w-[calc(100vw-1.5rem)] z-50 rounded-2xl overflow-hidden bg-white dark:bg-[#111217] border border-slate-200 dark:border-slate-700/90 shadow-[0_25px_60px_rgba(0,0,0,0.18)] dark:shadow-[0_35px_80px_rgba(0,0,0,0.98)] animate-in fade-in zoom-in-95 duration-200 flex flex-col ${
            alignment === "left"
              ? "left-0 translate-x-0"
              : alignment === "right"
                ? "right-0 left-auto translate-x-0"
                : "left-1/2 -translate-x-1/2"
          }`}
          style={{
            transformOrigin:
              alignment === "left"
                ? "left center"
                : alignment === "right"
                  ? "right center"
                  : "center center",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Cover Image Header (Sleek, compact & clear) */}
          <div
            onClick={handleCardClick}
            className="relative h-44 min-[400px]:h-48 sm:h-52 md:h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-950 cursor-pointer group/preview"
          >
            {book.coverUrl && !hasError ? (
              <Image
                src={book.coverUrl}
                alt={book.title}
                fill
                sizes="340px"
                unoptimized={true}
                className="object-cover group-hover/preview:scale-105 transition-transform duration-500"
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
              <div className="absolute top-2.5 right-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-2 py-0.5 rounded text-[9px] font-black shadow-md flex items-center gap-0.5 z-20">
                <Star size={9} fill="currentColor" />
                <span>Featured</span>
              </div>
            )}
          </div>

          {/* Card Body Controls (Compact, clean & sharp) */}
          <div className="p-3 sm:p-3.5 space-y-2.5 bg-white dark:bg-[#111217]">
            {/* Title & Author */}
            <div>
              <h3
                onClick={handleCardClick}
                className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-tight hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer line-clamp-1 truncate"
              >
                {book.title}
              </h3>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium truncate mt-0.5">
                by {authorNames}
              </p>
            </div>
            
            {/* Primary Action Buttons: ▶ Read Now + (+) Shelf + (i) Overview */}
            <div className="flex items-center gap-1.5 pt-0.5">
              <Link
                href={`/read/${book.id}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-200 dark:text-slate-950 font-extrabold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Play size={13} className="fill-white dark:fill-slate-950" />
                <span>Read Now</span>
              </Link>

              {/* Add to Shelf Menu Button */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 dark:bg-white/10 dark:hover:bg-white/20 dark:border-white/10 dark:text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs active:scale-95"
                  title="Add to library shelf"
                >
                  <Plus size={14} />
                </button>

                {showMenu && (
                  <div className="absolute right-0 bottom-full mb-2 w-44 sm:w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in duration-150">
                    <button
                      onClick={() => {
                        onAddToList?.("want_to_read");
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-2.5 w-full text-left px-3.5 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <BookOpen size={13} className="text-indigo-500 dark:text-indigo-400" />
                      <span>Want to Read</span>
                    </button>
                    <button
                      onClick={() => {
                        onAddToList?.("currently_reading");
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-2.5 w-full text-left px-3.5 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Clock size={13} className="text-amber-500 dark:text-amber-400" />
                      <span>Currently Reading</span>
                    </button>
                    <button
                      onClick={() => {
                        onAddToList?.("finished");
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-2.5 w-full text-left px-3.5 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Check size={13} className="text-emerald-500 dark:text-emerald-400" />
                      <span>Finished</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Book Details Info Button */}
              <Link
                href={`/book/${book.id}`}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 dark:bg-white/10 dark:hover:bg-white/20 dark:border-white/10 dark:text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs active:scale-95"
                title="Book Overview"
              >
                <Info size={14} />
              </Link>
            </div>

            {/* Metadata Row */}
            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex-wrap">
              <span className="text-slate-900 dark:text-white font-bold">{year}</span>
              <span>•</span>
              <span className="px-1 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 text-[9px] font-bold">
                Public Domain
              </span>
              <span>•</span>
              <span className="truncate">{genreName}</span>
            </div>

            {/* Synopsis Description */}
            <p className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-300 font-serif line-clamp-2 leading-relaxed">
              {displayDescription}
            </p>

          </div>
        </div>
      )}
    </div>
  );
}
