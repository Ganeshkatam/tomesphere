"use client";

import { useEffect } from "react";
import HeroSection from "./HeroSection";
import FeaturedBooksSection from "./FeaturedBooksSection";
import TrendingBooksSection from "./TrendingBooksSection";
import RecentlyAddedSection from "./RecentlyAddedSection";
import FeaturedCollectionsSection from "./FeaturedCollectionsSection";
import GenreBrowserSection from "./GenreBrowserSection";
import PopularAuthorsSection from "./PopularAuthorsSection";
import AnnouncementSection from "./AnnouncementSection";
import SlowScrollBooksSection from "./SlowScrollBooksSection";

export interface LandingClientProps {
  model?: any;
  overview?: any;
}

export default function LandingClient({ model, overview }: LandingClientProps) {
  useEffect(() => {
    // Smooth initial load reveal
  }, []);

  // Correctly unwrap LandingViewModel { landing: { overview, statistics, announcements } }
  const landingData = model?.landing || model || {};
  const overviewData = landingData.overview || model?.overview || overview || landingData;
  const announcementsData = landingData.announcements || overviewData.announcements || [];

  const {
    featuredBooks = [],
    trendingBooks = [],
    newBooks = [],
    curatedBooks = [],
    classicsBooks = [],
    philosophyBooks = [],
    scienceBooks = [],
    historyBooks = [],
    featuredCollections = [],
    genres = [],
    authors = [],
  } = overviewData;

  return (
    <div className="min-h-screen bg-gradient-page relative w-full max-w-full mx-auto overflow-x-hidden">
      {/* 1. Grand Dark Hero (Completely independent) */}
      <HeroSection searchSuggestions={featuredBooks} />

      {/* 2. Primary Catalog Shelves & Browsers */}
      <div className="w-full relative z-20 flex flex-col gap-20 pt-16 pb-16">
        <FeaturedBooksSection items={featuredBooks} />
        <TrendingBooksSection items={trendingBooks} />
        <RecentlyAddedSection items={newBooks} />

        <FeaturedCollectionsSection collections={featuredCollections} />
        <GenreBrowserSection genres={genres} />
        <PopularAuthorsSection authors={authors} />
        <AnnouncementSection announcements={announcementsData} />

        {/* Dedicated On-Demand Scroll Container: 5 Guaranteed Specialized Shelves */}
        <SlowScrollBooksSection
          curatedBooks={curatedBooks.length > 0 ? curatedBooks : featuredBooks}
          classicsBooks={classicsBooks.length > 0 ? classicsBooks : featuredBooks}
          philosophyBooks={philosophyBooks.length > 0 ? philosophyBooks : trendingBooks}
          scienceBooks={scienceBooks.length > 0 ? scienceBooks : newBooks}
          historyBooks={historyBooks.length > 0 ? historyBooks : curatedBooks}
        />
      </div>
    </div>
  );
}
