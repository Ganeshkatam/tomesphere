"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
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
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      const deltaY = currentScrollY - lastScrollY.current;
      const deltaTime = currentTime - lastScrollTime.current;

      if (deltaTime > 0 && deltaY > 0) {
        const velocity = deltaY / deltaTime; // px per ms

        // Slow scroll pace: downward, positive velocity below 1.5 px/ms after starting to browse
        if (currentScrollY > 200 && velocity > 0.01 && velocity < 1.5) {
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

  if (!items || items.length === 0) return null;

  const displayBooks = items.slice(0, 10);

  return (
    <section
      className={`max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16 w-full transition-all duration-700 ease-out ${
        isRevealed
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8 pointer-events-none"
      } ${className}`}
      aria-label="Curator's Deep Reads Spotlight"
    >
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles size={13} />
            <span>Mindful Pace Discovery</span>
          </div>
          <h2 className="text-3xl font-display font-bold text-[var(--text-primary)]">
            Curator&apos;s Deep Reading Spotlight
          </h2>
          <p className="text-[var(--text-secondary)] mt-1">
            Hand-picked selections tailored for sustained focus and intellectual depth.
          </p>
        </div>
        <a
          href="/discover"
          className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline transition-colors flex items-center gap-1"
        >
          View all <ArrowRight size={16} />
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {displayBooks.map((item) => (
          <FeaturedItemCard key={item.id} item={item} />
        ))}
        <ViewAllCard
          href="/discover"
          title="All Curated Spotlight"
          countLabel="Deep Reads"
        />
      </div>
    </section>
  );
}
