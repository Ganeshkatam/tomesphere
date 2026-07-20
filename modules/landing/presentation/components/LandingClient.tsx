"use client";

import { LandingViewModel } from "@/modules/landing/application/facades/LandingPageFacade";
import HeroSection from "./HeroSection";
import FeaturedBooksSection from "./FeaturedBooksSection";
import TrendingBooksSection from "./TrendingBooksSection";
import FeaturedCollectionsSection from "./FeaturedCollectionsSection";
import RecentlyAddedSection from "./RecentlyAddedSection";
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
    featuredCollections = [],
    genres = [],
    authors = [],
  } = overview || {};

  return (
    <div className="min-h-screen bg-gradient-page relative w-full max-w-full mx-auto overflow-x-hidden">
      <HeroSection searchSuggestions={featuredBooks} />

      <div className="w-full relative z-20 flex flex-col gap-24 py-16">
        <FeaturedBooksSection items={featuredBooks} />
        <TrendingBooksSection items={trendingBooks} />
        <FeaturedCollectionsSection collections={featuredCollections} />
        <RecentlyAddedSection items={newBooks} />
        <GenreBrowserSection genres={genres} />
        <PopularAuthorsSection authors={authors} />
        <AnnouncementSection announcements={announcements} />
        {/* <StatisticsSection statistics={statistics} /> */}
      </div>
    </div>
  );
}
