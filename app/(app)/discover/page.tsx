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
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discover Books & Curated Archives",
  description:
    "Explore hand-picked masterpieces, trending volumes, knowledge disciplines, and curated public domain collections.",
  openGraph: {
    title: "Discover Books & Curated Archives",
    description:
      "Explore hand-picked masterpieces, trending volumes, knowledge disciplines, and curated public domain collections.",
    url: "/discover",
  },
};

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
  const [overviewData, authorsData] = await Promise.all([
    facade.getDiscoveryOverview(),
    facade.getAuthors({ limit: 12, page: 1 }),
  ]);

  const {
    featuredBooks = [],
    trendingBooks = [],
    newBooks = [],
    cybersecurityBooks = [],
    programmingBooks = [],
    mathematicsBooks = [],
    yogaBooks = [],
    philosophyBooks = [],
    biographyBooks = [],
    artBooks = [],
    featuredCollections = [],
    subjects = [],
  } = overviewData;

  const authorCards = authorsData.items || [];

  return (
    <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 sm:py-8 lg:py-10 space-y-12 sm:space-y-16 animate-in fade-in duration-300">
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

      {/* 4. The Rich Book Sections & Curated Shelves */}
      <div className="flex flex-col gap-14 sm:gap-18 pt-2">
        {/* Section 1: Featured Masterpieces */}
        {featuredBooks.length > 0 && (
          <DiscoverySection
            title="Featured Masterpieces"
            description="Curated highlights and hand-picked treasures from the archive."
            actionHref="/discover/featured"
            actionLabel="View all picks"
          >
            <FeaturedBooks items={featuredBooks} />
          </DiscoverySection>
        )}

        {/* Section 2: Trending Volumes */}
        {trendingBooks.length > 0 && (
          <DiscoverySection
            title="Trending Volumes"
            description="Most active and frequently read works across the digital catalogue."
            actionHref="/discover/trending"
            actionLabel="View trending rank"
          >
            <BookCarousel items={trendingBooks} priority={true} />
          </DiscoverySection>
        )}

        {/* Section 3: Cybersecurity & Ethical Hacking */}
        {cybersecurityBooks.length > 0 && (
          <DiscoverySection
            title="Cybersecurity & Offensive Defense"
            description="Practical penetration testing handbooks, vulnerability analysis, and network security foundations."
            actionHref="/search?q=Cybersecurity"
            actionLabel="Explore security"
          >
            <BookCarousel items={cybersecurityBooks} />
          </DiscoverySection>
        )}

        {/* Curated Knowledge Disciplines Visual Hub */}
        <DiscoverySection
          title="Curated Knowledge Disciplines"
          description="Explore foundational manuscripts organized by scientific and humanities disciplines."
        >
          <DiscoverThemeHub />
        </DiscoverySection>

        {/* Section 4: Software Engineering & Programming */}
        {programmingBooks.length > 0 && (
          <DiscoverySection
            title="Software Engineering & Programming"
            description="Modern language guides, JVM architecture, scripting paradigms, and beginner-to-advanced software development."
            actionHref="/search?q=Programming"
            actionLabel="View programming"
          >
            <BookCarousel items={programmingBooks} />
          </DiscoverySection>
        )}

        {/* Section 5: Vedic Mathematics & Speed Arithmetic */}
        {mathematicsBooks.length > 0 && (
          <DiscoverySection
            title="Vedic Mathematics & Speed Arithmetic"
            description="Ancient Indian calculation sutras, rapid mental arithmetic shortcuts, and competitive examination mathematics."
            actionHref="/search?q=Mathematics"
            actionLabel="Explore math"
          >
            <BookCarousel items={mathematicsBooks} />
          </DiscoverySection>
        )}

        {/* Section 6: Yoga, Asanas & Holistic Health */}
        {yogaBooks.length > 0 && (
          <DiscoverySection
            title="Yoga, Asanas & Holistic Health"
            description="Definitive posture manuals, alignment mechanics, daily breathwork, and transformative mind-body wellness."
            actionHref="/search?q=Yoga"
            actionLabel="View yoga guides"
          >
            <BookCarousel items={yogaBooks} />
          </DiscoverySection>
        )}

        {/* Section 7: Philosophy & Transformative Wisdom */}
        {philosophyBooks.length > 0 && (
          <DiscoverySection
            title="Philosophy & Transformative Wisdom"
            description="Timeless life philosophies, mindfulness principles, self-discipline, and inspiring literary journeys."
            actionHref="/search?q=Philosophy"
            actionLabel="Explore philosophy"
          >
            <BookCarousel items={philosophyBooks} />
          </DiscoverySection>
        )}

        {/* Section 8: Biographies & Historical Memoirs */}
        {biographyBooks.length > 0 && (
          <DiscoverySection
            title="Biographies & Historical Memoirs"
            description="Inspirational autobiographical records, scientific visionaries, and historical turning points."
            actionHref="/search?q=Biography"
            actionLabel="View memoirs"
          >
            <BookCarousel items={biographyBooks} />
          </DiscoverySection>
        )}

        {/* Section 7: Visual Arts & Creative Design */}
        {artBooks.length > 0 && (
          <DiscoverySection
            title="Visual Arts & Creative Design"
            description="Mastery of human anatomy, structural gesture drawing, creative invention, and classical illustration."
            actionHref="/search?q=Art"
            actionLabel="Explore art books"
          >
            <BookCarousel items={artBooks} />
          </DiscoverySection>
        )}

        {/* Section 11: Recently Added Ingestions */}
        {newBooks.length > 0 && (
          <DiscoverySection
            title="Recently Cataloged Editions"
            description="Freshly catalogued and preserved public domain editions."
            actionHref="/discover/new"
            actionLabel="View recent additions"
          >
            <BookCarousel items={newBooks} />
          </DiscoverySection>
        )}

        {/* Subject Domains */}
        {subjects.length > 0 && (
          <DiscoverySection
            title="Explore by Knowledge Domain"
            description="Dive into specific disciplines, humanities, and sciences."
          >
            <SubjectGrid items={subjects.slice(0, 12)} />
          </DiscoverySection>
        )}

        {/* Curated Archival Collections */}
        {featuredCollections.length > 0 && (
          <DiscoverySection
            title="Curated Archival Collections"
            description="Thematic anthologies and structured reading paths."
            actionHref="/discover/collections"
            actionLabel="Explore collections"
          >
            <CollectionGrid items={featuredCollections.slice(0, 4)} />
          </DiscoverySection>
        )}

        {/* Authors */}
        {authorCards.length > 0 && (
          <DiscoverySection
            title="Prominent Authors & Thinkers"
            description="Discover the prolific minds whose writings shaped history."
            actionHref="/discover/authors"
            actionLabel="Browse all authors"
          >
            <AuthorGrid items={authorCards.slice(0, 12)} />
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
