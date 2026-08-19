"use client";

import { LandingViewModel } from "@/modules/landing/application/facades/LandingPageFacade";
import HeroSection from "./HeroSection";
import FeaturedBooksSection from "./FeaturedBooksSection";
import SlowScrollBooksSection from "./SlowScrollBooksSection";
import FeaturedCollectionsSection from "./FeaturedCollectionsSection";
import GenreBrowserSection from "./GenreBrowserSection";
import PopularAuthorsSection from "./PopularAuthorsSection";
import AnnouncementSection from "./AnnouncementSection";
// import StatisticsSection from "./StatisticsSection";

interface LandingClientProps {
  model: LandingViewModel;
}

export default function LandingClient({ model }: LandingClientProps) {
  const { landing } = model;
  const { overview, announcements, statistics } = landing;

  // Overview provides the curated lists and metadata
  const {
    featuredBooks = [],
    trendingBooks = [],
    newBooks = [],
    classicsBooks = [],
    philosophyBooks = [],
    scienceBooks = [],
    curatedBooks = [],
    featuredCollections = [],
    genres = [],
    authors = [],
  } = overview || {};

  return (
    <div className="min-h-screen bg-gradient-page relative w-full max-w-full mx-auto overflow-x-hidden">
      <HeroSection searchSuggestions={featuredBooks} />

      <div className="w-full relative z-20 flex flex-col gap-24 py-16">
        {/* Above-the-fold Curated Showcase */}
        <FeaturedBooksSection items={featuredBooks} />

        {/* Categorical & Discovery Browsers */}
        <FeaturedCollectionsSection collections={featuredCollections} />
        <GenreBrowserSection genres={genres} />
        <PopularAuthorsSection authors={authors} />
        <AnnouncementSection announcements={announcements} />

        {/* Dedicated On-Demand Scroll Container: Hosts 5+ Specialized Book Shelves */}
        <SlowScrollBooksSection
          curatedBooks={curatedBooks.length > 0 ? curatedBooks : featuredBooks}
          classicsBooks={classicsBooks.length > 0 ? classicsBooks : featuredBooks}
          philosophyBooks={philosophyBooks.length > 0 ? philosophyBooks : trendingBooks}
          scienceBooks={scienceBooks.length > 0 ? scienceBooks : newBooks}
          newBooks={newBooks}
          trendingBooks={trendingBooks}
        />
        {/* <StatisticsSection statistics={statistics} /> */}
      </div>
    </div>
  );
}
