"use client";

import HeroSection from "./HeroSection";
import StatisticsSection from "./StatisticsSection";
import FeaturedBooksSection from "./FeaturedBooksSection";
import TrendingBooksSection from "./TrendingBooksSection";
import RecentlyAddedSection from "./RecentlyAddedSection";
import PlatformFeaturesSection from "./PlatformFeaturesSection";
import FeaturedCollectionsSection from "./FeaturedCollectionsSection";
import GenreBrowserSection from "./GenreBrowserSection";
import SubjectsExplorerSection from "./SubjectsExplorerSection";
import PopularAuthorsSection from "./PopularAuthorsSection";
import AnnouncementSection from "./AnnouncementSection";
import CallToActionSection from "./CallToActionSection";

export interface LandingClientProps {
  model?: any;
  overview?: any;
}

export default function LandingClient({ model, overview }: LandingClientProps) {
  // Correctly unwrap LandingViewModel { landing: { overview, statistics, announcements } }
  const landingData = model?.landing || model || {};
  const overviewData = landingData.overview || model?.overview || overview || landingData;
  const statisticsData = landingData.statistics || model?.statistics || null;
  const announcementsData = landingData.announcements || overviewData.announcements || [];

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

      {/* 2. Platform Milestones & Statistics */}
      {statisticsData && <StatisticsSection statistics={statisticsData} />}

      {/* 3. Primary Catalog Shelves & Browsers */}
      <div className="w-full relative z-20 flex flex-col gap-20 pt-10 pb-16">
        {/* Curated Catalog Shelves */}
        <FeaturedBooksSection items={featuredBooks} />
        <TrendingBooksSection items={trendingBooks} />
        <RecentlyAddedSection items={newBooks} />

        {/* Platform Capabilities & Reader Experience */}
        <PlatformFeaturesSection />

        {/* Curated Collections */}
        <FeaturedCollectionsSection collections={featuredCollections} />

        {/* Discovery Taxonomies */}
        <GenreBrowserSection genres={genres} />
        <SubjectsExplorerSection subjects={subjects} />
        <PopularAuthorsSection authors={authors} />

        {/* Platform Dispatches & Announcements */}
        <AnnouncementSection announcements={announcementsData} />

        {/* Sanctuary Call To Action */}
        <CallToActionSection />
      </div>
    </div>
  );
}
