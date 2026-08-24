import Link from "next/link";
import {
  Sparkles,
  TrendingUp,
  Clock,
  BookOpen,
  Users,
  Compass,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { getDiscoveryFacade } from "@/modules/discovery/application/facades";
import { DiscoverySection } from "@/modules/discovery/presentation/components/DiscoverySection";
import { FeaturedBooks } from "@/modules/discovery/presentation/components/FeaturedBooks";
import { BookCarousel } from "@/modules/discovery/presentation/components/BookCarousel";
import { CollectionGrid } from "@/modules/discovery/presentation/components/CollectionGrid";
import { AuthorGrid } from "@/modules/discovery/presentation/components/AuthorGrid";
import { SubjectGrid } from "@/modules/discovery/presentation/components/SubjectGrid";
import { DiscoveryHero } from "@/modules/discovery/presentation/components/DiscoveryHero";
import { DiscoverThemeHub } from "@/modules/discovery/presentation/components/DiscoverThemeHub";
import { DiscoverPlatformFeatures } from "@/modules/discovery/presentation/components/DiscoverPlatformFeatures";

export const dynamic = "force-dynamic";

const CATEGORY_TABS = [
  { id: "overview", label: "All Archives", href: "/discover", icon: Compass, isActive: true },
  { id: "featured", label: "Editor's Picks", href: "/discover/featured", icon: Sparkles },
  { id: "trending", label: "Popular Now", href: "/discover/trending", icon: TrendingUp },
  { id: "new", label: "Recently Added", href: "/discover/new", icon: Clock },
  { id: "collections", label: "Collections", href: "/discover/collections", icon: BookOpen },
  { id: "authors", label: "Authors", href: "/discover/authors", icon: Users },
];

export default async function DiscoverOverviewPage() {
  const facade = await getDiscoveryFacade();
  const data = await facade.getOverview();

  return (
    <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 sm:py-8 lg:py-10 space-y-10 sm:space-y-14 animate-in fade-in duration-300">
      {/* 1. Breadcrumb & Status Pill */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 font-medium">
          <Link
            href="/"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Home
          </Link>
          <ChevronRight size={12} className="text-slate-400" />
          <span className="text-slate-800 dark:text-slate-200 font-bold">
            Discover
          </span>
        </nav>

        <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold shadow-2xs">
          <ShieldCheck size={13} className="text-emerald-500" />
          <span>Verified Digital Editions</span>
        </div>
      </div>

      {/* 2. Hero Search & Topic Hub Header */}
      <div>
        <DiscoveryHero />
      </div>

      {/* 3. Category Navigation Sub-Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between pb-1">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Browse Catalogue
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            Filter by curation track
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-slate-200/80 dark:border-slate-800/80">
          {CATEGORY_TABS.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = tab.isActive;

            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                <TabIcon size={14} className={isActive ? "text-white" : "text-slate-400"} />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 4. Main Catalogue Sections */}
      <div className="flex flex-col gap-12 sm:gap-16 pt-2">
        {/* Featured Masterpieces */}
        {data.featured?.items?.length > 0 && (
          <DiscoverySection
            title="Featured Masterpieces"
            description="Curated highlights and hand-picked treasures from the archive."
            actionHref="/discover/featured"
            actionLabel="View all picks"
          >
            <FeaturedBooks items={data.featured.items} />
          </DiscoverySection>
        )}

        {/* Curated Knowledge Disciplines */}
        <DiscoverySection
          title="Curated Knowledge Disciplines"
          description="Explore foundational manuscripts organized by scientific and humanities disciplines."
        >
          <DiscoverThemeHub />
        </DiscoverySection>

        {/* Trending Volumes */}
        {data.trending?.books?.length > 0 && (
          <DiscoverySection
            title="Trending Volumes"
            description="Most active and frequently read works across the digital catalogue."
            actionHref="/discover/trending"
            actionLabel="View trending rank"
          >
            <BookCarousel items={data.trending.books} priority={true} />
          </DiscoverySection>
        )}

        {/* New Additions */}
        {data.newArrivals?.items?.length > 0 && (
          <DiscoverySection
            title="New Additions"
            description="Freshly catalogued and preserved public domain editions."
            actionHref="/discover/new"
            actionLabel="View recent additions"
          >
            <BookCarousel items={data.newArrivals.items} />
          </DiscoverySection>
        )}

        {/* Subject Domains */}
        {data.subjects?.items?.length > 0 && (
          <DiscoverySection
            title="Explore by Knowledge Domain"
            description="Dive into specific disciplines, humanities, and sciences."
          >
            <SubjectGrid items={data.subjects.items.slice(0, 12)} />
          </DiscoverySection>
        )}

        {/* Curated Collections */}
        {data.collections?.items?.length > 0 && (
          <DiscoverySection
            title="Curated Archival Collections"
            description="Thematic anthologies and structured reading paths."
            actionHref="/discover/collections"
            actionLabel="Explore collections"
          >
            <CollectionGrid items={data.collections.items.slice(0, 4)} />
          </DiscoverySection>
        )}

        {/* Authors */}
        {data.authors?.items?.length > 0 && (
          <DiscoverySection
            title="Prominent Authors & Thinkers"
            description="Discover the prolific minds whose writings shaped history."
            actionHref="/discover/authors"
            actionLabel="Browse all authors"
          >
            <AuthorGrid items={data.authors.items.slice(0, 12)} />
          </DiscoverySection>
        )}

        {/* Platform Reading Pillars & Features Hub */}
        <div className="pt-2">
          <DiscoverPlatformFeatures />
        </div>
      </div>
    </div>
  );
}
