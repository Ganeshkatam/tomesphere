"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  onDemand?: boolean;
  isDarkSurface?: boolean;
}

export default function BookShelfRow({
  title,
  description,
  viewAllHref,
  items,
  viewAllTitle = "View All",
  countLabel = "Explore Collection",
  headerBadge,
  onDemand = true,
  isDarkSurface = false,
}: BookShelfRowProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(0);

  // On-demand scroll detection
  useEffect(() => {
    if (!onDemand || isRevealed) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      const deltaY = currentScrollY - lastScrollY.current;
      const deltaTime = currentTime - lastScrollTime.current;

      if (deltaTime > 0 && deltaY > 0) {
        const velocity = deltaY / deltaTime;
        const rect = sectionRef.current?.getBoundingClientRect();

        // Reveal on demand when approaching the viewport on downward scroll
        if (
          rect &&
          rect.top < window.innerHeight + 300 &&
          velocity > 0.01 &&
          velocity < 2.0
        ) {
          setIsRevealed(true);
        }
      }

      lastScrollY.current = currentScrollY;
      lastScrollTime.current = currentTime;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Also run initial check in case already near viewport
    const rect = sectionRef.current?.getBoundingClientRect();
    if (rect && rect.top < window.innerHeight + 100) {
      setIsRevealed(true);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [onDemand, isRevealed]);

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    if (!isRevealed) return;
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
  }, [items, isRevealed]);

  if (!items || items.length === 0) return null;

  const displayBooks = items.slice(0, 10);

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
    <section
      ref={sectionRef}
      className={`max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 w-full group/shelf relative transition-all duration-700 ease-out ${
        isRevealed
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8 pointer-events-none min-h-[100px]"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          {headerBadge && <div className="mb-2">{headerBadge}</div>}
          <h2
            className={`text-2xl sm:text-3xl font-display font-bold ${
              isDarkSurface ? "text-white" : "text-[var(--text-primary)]"
            }`}
          >
            {title}
          </h2>
          <p
            className={`text-sm mt-1.5 ${
              isDarkSurface ? "text-slate-400" : "text-[var(--text-secondary)]"
            }`}
          >
            {description}
          </p>
        </div>

        {/* Action Bar: Minimalist Round Arrow Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label={`Scroll ${title} backwards`}
            className={`w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700/60 bg-white dark:bg-slate-900/60 flex items-center justify-center transition-all cursor-pointer shadow-xs ${
              canScrollLeft
                ? "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500 active:scale-95"
                : "text-slate-300 dark:text-slate-600 opacity-40 cursor-not-allowed"
            }`}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label={`Scroll ${title} forwards`}
            className={`w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700/60 bg-white dark:bg-slate-900/60 flex items-center justify-center transition-all cursor-pointer shadow-xs ${
              canScrollRight
                ? "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500 active:scale-95"
                : "text-slate-300 dark:text-slate-600 opacity-40 cursor-not-allowed"
            }`}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Bookshelf Scroll Container */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto py-2 px-1 no-scrollbar scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {displayBooks.map((item) => (
            <div
              key={item.id}
              className="w-[130px] min-[400px]:w-[145px] sm:w-[170px] md:w-[190px] lg:w-[205px] xl:w-[215px] shrink-0 snap-start flex flex-col relative hover:z-40 transition-all duration-300"
            >
              <FeaturedItemCard item={item} />
            </div>
          ))}
          <div className="w-[130px] min-[400px]:w-[145px] sm:w-[170px] md:w-[190px] lg:w-[205px] xl:w-[215px] shrink-0 snap-start flex flex-col">
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
