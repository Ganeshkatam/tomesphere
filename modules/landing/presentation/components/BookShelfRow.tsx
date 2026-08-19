"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import FeaturedItemCard from "./FeaturedItemCard";
import ViewAllCard from "./ViewAllCard";

interface BookShelfRowProps {
  title: string;
  description: string;
  viewAllHref: string;
  items: any[];
  viewAllTitle?: string;
  countLabel?: string;
  headerBadge?: React.ReactNode;
}

export default function BookShelfRow({
  title,
  description,
  viewAllHref,
  items,
  viewAllTitle = "View All",
  countLabel = "Explore Collection",
  headerBadge,
}: BookShelfRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  if (!items || items.length === 0) return null;

  const displayBooks = items.slice(0, 10);

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollability();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollability, { passive: true });
      window.addEventListener("resize", checkScrollability, { passive: true });
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScrollability);
      }
      window.removeEventListener("resize", checkScrollability);
    };
  }, [items]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16 w-full group/shelf relative">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          {headerBadge && <div className="mb-2">{headerBadge}</div>}
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-[var(--text-primary)]">
            {title}
          </h2>
          <p className="text-[var(--text-secondary)] text-sm mt-1.5">
            {description}
          </p>
        </div>

        {/* Action Bar: Scroll Buttons + View All */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Previous / Next Scroll Buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border-default)] shadow-xs">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label={`Scroll ${title} backwards`}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                canScrollLeft
                  ? "text-[var(--text-primary)] hover:bg-indigo-600 hover:text-white hover:shadow-md hover:shadow-indigo-500/20 active:scale-95"
                  : "text-[var(--text-tertiary)] opacity-40 cursor-not-allowed"
              }`}
            >
              <ChevronLeft size={18} />
            </button>
            <div className="w-px h-4 bg-[var(--border-default)]" />
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label={`Scroll ${title} forwards`}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                canScrollRight
                  ? "text-[var(--text-primary)] hover:bg-indigo-600 hover:text-white hover:shadow-md hover:shadow-indigo-500/20 active:scale-95"
                  : "text-[var(--text-tertiary)] opacity-40 cursor-not-allowed"
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* View All Link */}
          <Link
            href={viewAllHref}
            className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 px-3 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors flex items-center gap-1.5 shrink-0"
          >
            <span>View all</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Bookshelf Scroll Container */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {displayBooks.map((item) => (
            <div
              key={item.id}
              className="w-[170px] sm:w-[195px] md:w-[210px] shrink-0 snap-start flex flex-col"
            >
              <FeaturedItemCard item={item} />
            </div>
          ))}
          <div className="w-[170px] sm:w-[195px] md:w-[210px] shrink-0 snap-start flex flex-col">
            <ViewAllCard
              href={viewAllHref}
              title={viewAllTitle}
              countLabel={countLabel}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
