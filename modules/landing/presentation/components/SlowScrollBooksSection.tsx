"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import FeaturedItemCard from "./FeaturedItemCard";
import ViewAllCard from "./ViewAllCard";

interface SlowScrollBooksSectionProps {
  items?: any[];
  className?: string;
}

export default function SlowScrollBooksSection({
  items = [],
  className = "",
}: SlowScrollBooksSectionProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(0);

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      const deltaY = currentScrollY - lastScrollY.current;
      const deltaTime = currentTime - lastScrollTime.current;

      if (deltaTime > 0 && deltaY > 0) {
        const velocity = deltaY / deltaTime; // px per ms

        const rect = sectionRef.current?.getBoundingClientRect();
        // Trigger on-demand rendering when section is approaching or in viewport and scrolling slowly
        if (
          rect &&
          rect.top < window.innerHeight + 350 &&
          velocity > 0.01 &&
          velocity < 1.6
        ) {
          setIsRevealed(true);
        }
      }

      lastScrollY.current = currentScrollY;
      lastScrollTime.current = currentTime;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
      className={`max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16 w-full transition-all duration-700 ease-out ${
        isRevealed
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8 pointer-events-none min-h-[50px]"
      } ${className}`}
      aria-label="Curator's Deep Reads Spotlight"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles size={13} />
            <span>Mindful Pace Discovery</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-[var(--text-primary)]">
            Curator&apos;s Deep Reading Spotlight
          </h2>
          <p className="text-[var(--text-secondary)] text-sm mt-1.5">
            Hand-picked selections tailored for sustained focus and intellectual depth.
          </p>
        </div>

        {/* Action Bar: Scroll Buttons */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Previous / Next Scroll Buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border-default)] shadow-xs">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Scroll curated spotlight backwards"
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
              aria-label="Scroll curated spotlight forwards"
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                canScrollRight
                  ? "text-[var(--text-primary)] hover:bg-indigo-600 hover:text-white hover:shadow-md hover:shadow-indigo-500/20 active:scale-95"
                  : "text-[var(--text-tertiary)] opacity-40 cursor-not-allowed"
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

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
            href="/discover"
            title="All Curated Spotlight"
            countLabel="Deep Reads"
          />
        </div>
      </div>
    </section>
  );
}
