"use client";

import { LandingViewModel } from "@/modules/landing/application/facades/LandingPageFacade";
import HeroSection from "./HeroSection";
import FeaturedBooksSection from "./FeaturedBooksSection";
import TrendingBooksSection from "./TrendingBooksSection";
import RecentlyAddedSection from "./RecentlyAddedSection";
import ClassicsBooksSection from "./ClassicsBooksSection";
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
    curatedBooks = [],
    featuredCollections = [],
    genres = [],
    authors = [],
  } = overview || {};

  return (
    <div className="min-h-screen bg-gradient-page relative w-full max-w-full mx-auto overflow-x-hidden">
      <HeroSection searchSuggestions={featuredBooks} />

      <div className="w-full relative z-20 flex flex-col gap-24 py-16">
        {/* Core Book Sections (10 items + View All Card) */}
        <FeaturedBooksSection items={featuredBooks} />
        <TrendingBooksSection items={trendingBooks} />
        <ClassicsBooksSection items={classicsBooks.length > 0 ? classicsBooks : featuredBooks} />
        <RecentlyAddedSection items={newBooks} />

        {/* Exploratory & Categorical Sections */}
        <FeaturedCollectionsSection collections={featuredCollections} />
        <GenreBrowserSection genres={genres} />
        <PopularAuthorsSection authors={authors} />
        <AnnouncementSection announcements={announcements} />

        {/* On-Demand Slow Scroll Discovery Section Rendered on the Bottom */}
        <SlowScrollBooksSection items={curatedBooks.length > 0 ? curatedBooks : featuredBooks} />

      </div>
    </div>
  );
}
