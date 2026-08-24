"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import BookCard from "@/modules/books/components/BookCard";
import { BookSummaryDto } from "../../application/dto/BookSummaryDto";
import { EmptyState } from "@/shared/ui/EmptyState";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addBookToLibraryAction } from "../actions/discovery";

interface BookCarouselProps {
  items: readonly BookSummaryDto[];
  priority?: boolean;
}

export function BookCarousel({ items, priority = false }: BookCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const rafRef = useRef<number | null>(null);

  const checkScrollability = useCallback(() => {
    if (!scrollRef.current) return;
    
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }
    
    rafRef.current = requestAnimationFrame(() => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      
      const nextCanLeft = scrollLeft > 10;
      const nextCanRight = scrollLeft + clientWidth < scrollWidth - 10;
      
      setCanScrollLeft(prev => prev !== nextCanLeft ? nextCanLeft : prev);
      setCanScrollRight(prev => prev !== nextCanRight ? nextCanRight : prev);
      
      rafRef.current = null;
    });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkScrollability();
    el.addEventListener("scroll", checkScrollability, { passive: true });
    window.addEventListener("resize", checkScrollability);

    return () => {
      el.removeEventListener("scroll", checkScrollability);
      window.removeEventListener("resize", checkScrollability);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [checkScrollability, items]);

  if (!items || items.length === 0) {
    return null;
  }

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollAmount = container.clientWidth * 0.75;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleAddToList = async (
    bookId: string,
    status: "want_to_read" | "currently_reading" | "finished",
  ) => {
    try {
      await addBookToLibraryAction(bookId, status);
    } catch (error) {
      console.error("Failed to add book to library:", error);
    }
  };

  return (
    <div className="relative group/carousel w-full min-w-0">
      {/* Left Navigation Arrow */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="absolute -left-3 sm:-left-5 top-[38%] -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 shadow-xl flex items-center justify-center z-20 hover:scale-110 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition-all cursor-pointer backdrop-blur-xs"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* Right Navigation Arrow */}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="absolute -right-3 sm:-right-5 top-[38%] -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 shadow-xl flex items-center justify-center z-20 hover:scale-110 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition-all cursor-pointer backdrop-blur-xs"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* Smooth Horizontal Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 px-1 min-w-0 no-scrollbar"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {items.map((item, index) => (
          <div
            key={item.id || item.slug || `carousel-book-${index}`}
            className="w-[160px] sm:w-[185px] md:w-[205px] lg:w-[220px] shrink-0 snap-start"
          >
            <BookCard
              book={{
                id: item.id,
                slug: item.slug,
                title: item.title,
                authors: item.authors || [],
                genres: item.genres || [],
                coverUrl: item.coverUrl
                  ? item.coverUrl.replace(/ /g, "%20")
                  : null,
                language: item.language,
                publicationYear: item.publicationYear,
              }}
              priority={priority && index < 4}
              onAddToList={(status) => handleAddToList(item.id, status)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookCarousel;
