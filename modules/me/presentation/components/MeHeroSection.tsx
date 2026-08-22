"use client";

import React, { useState, useEffect, useRef, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Info, Flame, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import BookCard from "@/modules/books/components/BookCard";
import DefaultBookCover from "@/modules/books/components/DefaultBookCover";
import type { DiscoveryOverviewPageDto } from "@/modules/discovery/application/facades/DiscoveryFacade";

interface MeHeroSectionProps {
  promise: Promise<DiscoveryOverviewPageDto>;
}

export default function MeHeroSection({ promise }: MeHeroSectionProps) {
  const result = use(promise);
  const trendingBooks = result?.trending?.books || [];
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const total = Math.min(trendingBooks.length, 10);

  // Uninterrupted continuous auto-scroll timer for the hero billboard only
  useEffect(() => {
    if (total <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 5500);

    return () => clearInterval(timer);
  }, [total]);

  if (trendingBooks.length === 0) {
    return null;
  }

  const spotlightBook = trendingBooks[activeIndex] || trendingBooks[0];

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="space-y-4 sm:space-y-5">

      {/* Billboard Spotlight Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 border border-slate-800/80 shadow-2xl text-white">

        {/* Ambient Backdrop Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent z-10 pointer-events-none" />
        {spotlightBook.coverUrl && (
          <div className="absolute right-0 top-0 w-full sm:w-2/3 h-full opacity-20 dark:opacity-30 blur-3xl pointer-events-none overflow-hidden transition-all duration-700">
            <Image
              src={spotlightBook.coverUrl}
              alt=""
              fill
              className="object-cover"
              sizes="60vw"
              priority
              loading="eager"
            />
          </div>
        )}

        <div className="relative z-20 p-6 sm:p-7 lg:p-9 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-12">

          {/* Left Metadata & CTAs */}
          <div className="flex-1 flex flex-col justify-between max-w-2xl lg:max-w-3xl">
            <div>
              {/* Badge */}
              <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider shadow-xs">
                  <Flame size={14} className="text-red-500 fill-red-500" />
                  <span># {activeIndex + 1} Trending in Digital Archives</span>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white tracking-tight leading-tight mb-2 drop-shadow-md line-clamp-2 transition-all duration-300">
                {spotlightBook.title}
              </h2>

              <p className="text-sm sm:text-base text-indigo-300 font-medium mb-3">
                by {spotlightBook.authors?.map((a: any) => (typeof a === "string" ? a : a?.name)).filter(Boolean).join(", ") || "TomeSphere Library"}
              </p>

              {spotlightBook.genres && spotlightBook.genres.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap mb-3.5">
                  {spotlightBook.genres.slice(0, 3).map((g: any, i: number) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-lg bg-slate-800/80 text-slate-300 text-[11px] font-semibold border border-slate-700/80 shadow-xs"
                    >
                      {typeof g === "string" ? g : g.name}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-xs sm:text-sm text-slate-300 font-serif line-clamp-2 sm:line-clamp-3 leading-relaxed max-w-2xl">
                Immerse yourself in this timeless literary masterpiece from our curated global public domain archives.
              </p>
            </div>

            {/* Action Buttons & Indicator Dots */}
            <div className="pt-5 space-y-3.5">
              <div className="flex items-center gap-3.5 flex-wrap">
                <Link
                  href={`/read/${spotlightBook.id}`}
                  className="h-11 sm:h-12 px-6 sm:px-7 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Play size={18} className="fill-slate-950 text-slate-950 translate-x-0.5" />
                  <span>Start Reading</span>
                </Link>
                <Link
                  href={`/book/${spotlightBook.id}`}
                  className="h-11 sm:h-12 px-5 sm:px-6 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-white font-bold text-sm sm:text-base border border-slate-700/80 backdrop-blur-md flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Info size={18} />
                  <span>Book Details</span>
                </Link>
              </div>

              {/* Progress Slide Indicator Strip */}
              <div className="flex items-center gap-1.5 pt-1">
                {trendingBooks.slice(0, 10).map((_: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${activeIndex === i
                      ? "w-7 bg-red-500 shadow-xs"
                      : "w-2.5 bg-slate-700 hover:bg-slate-500"
                      }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Spotlight Cover */}
          <div className="flex-shrink-0 relative group self-center">
            <div className="w-[160px] min-[400px]:w-[185px] sm:w-[210px] md:w-[235px] lg:w-[260px] aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative border border-slate-700/80 transform md:group-hover:scale-105 transition-transform duration-300">
              {spotlightBook.coverUrl ? (
                <Image
                  src={spotlightBook.coverUrl}
                  alt={spotlightBook.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 210px, 260px"
                  priority
                  loading="eager"
                />
              ) : (
                <DefaultBookCover
                  title={spotlightBook.title}
                  authors={spotlightBook.authors}
                  genre={spotlightBook.genres?.[0]?.name || spotlightBook.genres?.[0]}
                />
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Trending Books Carousel Row (Static, no auto-scrolling) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame size={18} className="text-red-500 fill-red-500" />
            <h3 className="text-base sm:text-lg font-display font-bold text-slate-900 dark:text-white tracking-tight">
              Top Trending in Digital Archives
            </h3>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scroll("left")}
              aria-label="Previous trending book"
              className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-xs"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Next trending book"
              className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-xs"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel Row */}
        <div
          ref={scrollRef}
          className="flex items-start gap-4 sm:gap-5 overflow-x-auto pt-3 pb-4 px-1.5 no-scrollbar scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {trendingBooks.slice(0, 10).map((book: any, idx: number) => {
            const isSelected = activeIndex === idx;
            const rank = idx + 1;

            return (
              <div
                key={`trending-shelf-${book.id || idx}-${idx}`}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                onClick={() => setActiveIndex(idx)}
                className={`w-[130px] min-[400px]:w-[145px] sm:w-[170px] md:w-[190px] lg:w-[205px] xl:w-[215px] shrink-0 snap-start flex flex-col relative transition-all duration-300 cursor-pointer hover:z-40 ${isSelected ? "opacity-100" : "opacity-90 hover:opacity-100"
                  }`}
              >
                {/* Clean Rank Badge on top-left corner */}
                <div
                  className={`absolute top-2.5 left-2.5 z-20 px-2 py-0.5 rounded-lg text-xs font-black shadow-md ${isSelected
                    ? "bg-red-500 text-white"
                    : "bg-slate-900/90 text-slate-200 border border-slate-700/80"
                    }`}
                >
                  #{rank}
                </div>

                <BookCard book={book} priority={idx < 5} />
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
