"use client";

import HeroSection from "./HeroSection";
import FeaturedBooksSection from "./FeaturedBooksSection";
import TrendingBooksSection from "./TrendingBooksSection";
import RecentlyAddedSection from "./RecentlyAddedSection";
import FeaturedCollectionsSection from "./FeaturedCollectionsSection";
import GenreBrowserSection from "./GenreBrowserSection";
import SubjectsExplorerSection from "./SubjectsExplorerSection";
import PopularAuthorsSection from "./PopularAuthorsSection";

export interface LandingClientProps {
  model?: any;
  overview?: any;
}

export default function LandingClient({ model, overview }: LandingClientProps) {
  // Correctly unwrap LandingViewModel { landing: { overview, statistics, announcements } }
  const landingData = model?.landing || model || {};
  const overviewData = landingData.overview || model?.overview || overview || landingData;

  const {
    featuredBooks = [],
    trendingBooks = [],
    newBooks = [],
    featuredCollections = [],
    genres = [],
    subjects = [],
    authors = [],
  } = overviewData;

  return (
    <div className="min-h-screen bg-gradient-page relative w-full max-w-full mx-auto overflow-x-hidden">
      {/* 1. Grand Independent Hero */}
      <HeroSection searchSuggestions={featuredBooks} />

      {/* 2. Pure Literary Catalog Shelves & Browsers */}
      <div className="w-full relative z-20 flex flex-col gap-20 pt-8 pb-20">
        {/* Curated Catalog Shelves */}
        <FeaturedBooksSection items={featuredBooks} />
        <TrendingBooksSection items={trendingBooks} />
        <RecentlyAddedSection items={newBooks} />

        {/* Curated Literary Collections */}
        <FeaturedCollectionsSection collections={featuredCollections} />

        {/* Discovery Disciplines & Taxonomies */}
        <GenreBrowserSection genres={genres} />
        <SubjectsExplorerSection subjects={subjects} />
        <PopularAuthorsSection authors={authors} />
      </div>
    </div>
  );
}
