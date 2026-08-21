"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookSummaryDto } from "../../application/dto/BookSummaryDto";
import {
  BookOpen,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Info,
  Calendar,
  Layers,
  Star,
} from "lucide-react";
import DefaultBookCover from "@/modules/books/components/DefaultBookCover";
import { generateSimpleDescription } from "@/modules/storage/services/pdf-description-generator";

interface FeaturedBooksProps {
  items: readonly Partial<BookSummaryDto>[];
}

export function FeaturedBooks({ items }: FeaturedBooksProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const validItems = (items || []).filter(
    (item): item is BookSummaryDto => Boolean(item && item.id && item.title),
  );

  // Auto-advance spotlight every 7 seconds
  useEffect(() => {
    if (validItems.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % validItems.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [validItems.length]);

  if (validItems.length === 0) {
    return null;
  }

  const current = validItems[activeIndex];
  const authorNames =
    current.authors && current.authors.length > 0
      ? current.authors.map((a) => a.name).join(", ")
      : "TomeSphere Archive";

  const primaryGenre =
    (current.genres && current.genres.length > 0
      ? typeof current.genres[0] === "string"
        ? current.genres[0]
        : (current.genres[0] as any)?.name
      : null) || "Masterpiece";

  const description = generateSimpleDescription(current.title, authorNames);

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + validItems.length) % validItems.length);
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % validItems.length);
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl transition-all min-h-[360px] sm:min-h-[390px] flex flex-col justify-between p-6 sm:p-8 lg:p-10 text-white">
      {/* Ambient Blurred Backdrop Glow */}
      {current.coverUrl && (
        <div className="absolute right-0 top-0 w-full lg:w-2/3 h-full opacity-20 dark:opacity-25 blur-3xl pointer-events-none overflow-hidden select-none">
          <Image
            src={current.coverUrl.replace(/ /g, "%20")}
            alt=""
            fill
            className="object-cover"
            sizes="50vw"
          />
        </div>
      )}

      {/* Decorative Brand Gradient Shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/95 to-slate-900/80 pointer-events-none" />

      {/* Foreground Spotlight Content */}
      <div className="relative z-10 flex flex-col md:flex-row gap-6 sm:gap-8 lg:gap-12 items-center md:items-start w-full">
        {/* Left: 3D Hardcover Cover Showcase */}
        <div className="w-[170px] sm:w-[200px] md:w-[220px] lg:w-[240px] shrink-0">
          <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 group cursor-pointer">
            {current.coverUrl ? (
              <Image
                src={current.coverUrl.replace(/ /g, "%20")}
                alt={`Cover of ${current.title}`}
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 200px, 240px"
              />
            ) : (
              <DefaultBookCover
                title={current.title}
                authors={authorNames}
                genre={primaryGenre}
              />
            )}
          </div>
        </div>

        {/* Right: Rich Metadata, Title, Description, & Direct Action Buttons */}
        <div className="flex-1 min-w-0 flex flex-col justify-between space-y-4 sm:space-y-5 text-left w-full">
          <div>
            {/* Badges row */}
            <div className="flex items-center gap-2 flex-wrap mb-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[11px] font-extrabold uppercase tracking-wider">
                <Sparkles size={12} className="text-amber-400" />
                <span>Featured Masterpiece</span>
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-white text-[11px] font-bold">
                {primaryGenre}
              </span>

              {current.publicationYear && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 text-[11px] font-mono font-bold">
                  <Calendar size={11} />
                  <span>{current.publicationYear}</span>
                </span>
              )}
            </div>

            {/* Title */}
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight line-clamp-2">
              {current.title}
            </h2>

            {/* Author */}
            <p className="text-sm sm:text-base text-indigo-300 font-semibold mt-1">
              by <span className="text-white font-bold">{authorNames}</span>
            </p>

            {/* Synopsis / Description */}
            <p className="text-xs sm:text-sm text-slate-300 font-serif leading-relaxed line-clamp-3 mt-2.5 max-w-3xl">
              {description}
            </p>
          </div>

          {/* Action CTAs & Slide Indicators */}
          <div className="flex items-center justify-between gap-4 pt-2 flex-wrap">
            <div className="flex items-center gap-3">
              <Link
                href={`/read/${current.id}`}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs sm:text-sm font-extrabold shadow-xl shadow-indigo-600/30 hover:scale-[1.02] transition-all cursor-pointer"
              >
                <BookOpen size={16} />
                <span>Start Reading</span>
              </Link>

              <Link
                href={`/book/${current.slug || current.id}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs sm:text-sm font-bold border border-white/10 hover:border-white/20 transition-all cursor-pointer"
              >
                <Info size={15} />
                <span>Overview</span>
              </Link>
            </div>

            {/* Slide Navigation Controls */}
            {validItems.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Previous featured book"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-1.5 px-2">
                  {validItems.map((_, idx) => (
                    <button
                      key={`dot-${idx}`}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        idx === activeIndex
                          ? "w-6 bg-indigo-500"
                          : "w-2 bg-white/30 hover:bg-white/50"
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next featured book"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeaturedBooks;
