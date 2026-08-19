"use client";

import React, { useState, useEffect, useRef } from "react";
import BookShelfRow from "./BookShelfRow";

interface SlowScrollBooksSectionProps {
  curatedBooks?: any[];
  classicsBooks?: any[];
  philosophyBooks?: any[];
  scienceBooks?: any[];
  historyBooks?: any[];
  newBooks?: any[];
  trendingBooks?: any[];
  className?: string;
}

export default function SlowScrollBooksSection({
  curatedBooks = [],
  classicsBooks = [],
  philosophyBooks = [],
  scienceBooks = [],
  historyBooks = [],
  newBooks = [],
  trendingBooks = [],
  className = "",
}: SlowScrollBooksSectionProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
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
        const rect = sectionRef.current?.getBoundingClientRect();

        // Reveal on-demand when user scrolls down towards the bottom zone at a normal browsing pace
        if (
          rect &&
          rect.top < window.innerHeight + 400 &&
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

    // Initial viewport check
    const rect = sectionRef.current?.getBoundingClientRect();
    if (rect && rect.top < window.innerHeight + 100) {
      setIsRevealed(true);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`w-full flex flex-col gap-24 transition-all duration-1000 ease-out ${
        isRevealed
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-12 pointer-events-none min-h-[150px]"
      } ${className}`}
      aria-label="On-Demand Scroll Book Shelves"
    >
      {/* On-Demand Shelf 1: Curator's Deep Reading Spotlight */}
      <BookShelfRow
        title="Curator's Deep Reading Spotlight"
        description="Hand-picked selections tailored for sustained focus and intellectual depth."
        viewAllHref="/discover"
        viewAllTitle="All Curated Spotlight"
        countLabel="Curator's Cut"
        items={curatedBooks}
        onDemand={false}
      />

      {/* On-Demand Shelf 2: Timeless Classics & Literary Heritage */}
      <BookShelfRow
        title="Timeless Classics & Heritage"
        description="Essential world literature and enduring masterpieces across centuries."
        viewAllHref="/discover"
        viewAllTitle="All Classic Literature"
        countLabel="Classic Archive"
        items={classicsBooks}
        onDemand={false}
      />

      {/* On-Demand Shelf 3: Philosophy, Ethics & Human Thought */}
      <BookShelfRow
        title="Philosophy & Great Ideas"
        description="Foundational philosophical dialogues, ethical inquiries, and epistemology."
        viewAllHref="/discover"
        viewAllTitle="All Philosophy Works"
        countLabel="Philosophical Corpus"
        items={philosophyBooks}
        onDemand={false}
      />

      {/* On-Demand Shelf 4: Science, Technology & Mathematics */}
      <BookShelfRow
        title="Science & Mathematics"
        description="Groundbreaking scientific treatises, computing foundations, and mathematical sciences."
        viewAllHref="/discover"
        viewAllTitle="All Science & Math"
        countLabel="STEM Corpus"
        items={scienceBooks}
        onDemand={false}
      />

      {/* On-Demand Shelf 5: World History & Historical Records */}
      <BookShelfRow
        title="World History & Civilization"
        description="Historical chronicles, pivotal moments, and ancient records across world civilizations."
        viewAllHref="/discover"
        viewAllTitle="All History Works"
        countLabel="Historical Archive"
        items={historyBooks.length > 0 ? historyBooks : curatedBooks}
        onDemand={false}
      />

      {/* Optional Ingested / Trending if provided */}
      {newBooks.length > 0 && (
        <BookShelfRow
          title="Recent Digital Acquisitions"
          description="The newest catalog additions and digitally preserved public domain editions."
          viewAllHref="/discover/new"
          viewAllTitle="All New Acquisitions"
          countLabel="Fresh Catalog"
          items={newBooks}
          onDemand={false}
        />
      )}

      {trendingBooks.length > 0 && (
        <BookShelfRow
          title="Top Rated & Reader Favorites"
          description="The most frequently engaged books and community recommended titles."
          viewAllHref="/discover/trending"
          viewAllTitle="All Reader Favorites"
          countLabel="Community Favorites"
          items={trendingBooks}
          onDemand={false}
        />
      )}
    </div>
  );
}
