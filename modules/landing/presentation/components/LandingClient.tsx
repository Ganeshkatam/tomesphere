"use client";

import { LandingViewModel } from "@/modules/landing/application/facades/LandingPageFacade";
import HeroSection from "./HeroSection";
import FeaturedBooksSection from "./FeaturedBooksSection";
import TrendingBooksSection from "./TrendingBooksSection";
import ClassicsBooksSection from "./ClassicsBooksSection";
import PhilosophyBooksSection from "./PhilosophyBooksSection";
import ScienceBooksSection from "./ScienceBooksSection";
import RecentlyAddedSection from "./RecentlyAddedSection";
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
        {/* 1. Featured Selections */}
        <FeaturedBooksSection items={featuredBooks} />

        {/* 2. Trending Now (On-Demand Scroll Reveal) */}
        <TrendingBooksSection items={trendingBooks} />

        {/* 3. Timeless Classics (On-Demand Scroll Reveal) */}
        <ClassicsBooksSection items={classicsBooks.length > 0 ? classicsBooks : featuredBooks} />

        {/* 4. Philosophy & Great Ideas (On-Demand Scroll Reveal) */}
        <PhilosophyBooksSection items={philosophyBooks.length > 0 ? philosophyBooks : trendingBooks} />

        {/* 5. Science, Tech & Mathematics (On-Demand Scroll Reveal) */}
        <ScienceBooksSection items={scienceBooks.length > 0 ? scienceBooks : newBooks} />

        {/* 6. Recently Added (On-Demand Scroll Reveal) */}
        <RecentlyAddedSection items={newBooks} />

        {/* Exploratory & Categorical Sections */}
        <FeaturedCollectionsSection collections={featuredCollections} />
        <GenreBrowserSection genres={genres} />
        <PopularAuthorsSection authors={authors} />
        <AnnouncementSection announcements={announcements} />

        {/* 7. Bottom On-Demand Curator's Deep Reading Spotlight */}
        <SlowScrollBooksSection items={curatedBooks.length > 0 ? curatedBooks : featuredBooks} />
        {/* <StatisticsSection statistics={statistics} /> */}
      </div>
    </div>
  );
}
