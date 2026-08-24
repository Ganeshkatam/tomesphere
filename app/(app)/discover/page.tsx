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
  ShieldAlert,
  Code,
  Calculator,
  Activity,
  HeartHandshake,
  UserCheck,
  Palette,
  GraduationCap,
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
  const [overviewData, fullCatalog] = await Promise.all([
    facade.getOverview(),
    facade.getNewArrivals({ limit: 50, page: 1 }),
  ]);

  const allItems = fullCatalog.items || [];

  // Categorize books into dedicated curated sections
  const securityBooks = allItems.filter((b) =>
    (b.genres || []).some((g) => g.name.toLowerCase().includes("security") || g.name.toLowerCase().includes("cyber")) ||
    b.title.toLowerCase().includes("hacker") ||
    b.title.toLowerCase().includes("security")
  );

  const programmingBooks = allItems.filter((b) =>
    (b.genres || []).some((g) => g.name.toLowerCase().includes("programming") || g.name.toLowerCase().includes("computer science")) ||
    b.title.toLowerCase().includes("python") ||
    b.title.toLowerCase().includes("java") ||
    b.title.toLowerCase().includes("javascript")
  );

  const mathematicsBooks = allItems.filter((b) =>
    (b.genres || []).some((g) => g.name.toLowerCase().includes("mathematics") || g.name.toLowerCase().includes("math")) ||
    b.title.toLowerCase().includes("maths") ||
    b.title.toLowerCase().includes("vedic")
  );

  const yogaHealthBooks = allItems.filter((b) =>
    (b.genres || []).some((g) => g.name.toLowerCase().includes("yoga") || g.name.toLowerCase().includes("health")) ||
    b.title.toLowerCase().includes("yoga") ||
    b.title.toLowerCase().includes("asanas")
  );

  const philosophyBooks = allItems.filter((b) =>
    (b.genres || []).some((g) => g.name.toLowerCase().includes("motivation") || g.name.toLowerCase().includes("spirituality") || g.name.toLowerCase().includes("fiction")) ||
    b.title.toLowerCase().includes("ferrari") ||
    b.title.toLowerCase().includes("silence")
  );

  const biographyBooks = allItems.filter((b) =>
    (b.genres || []).some((g) => g.name.toLowerCase().includes("biography") || g.name.toLowerCase().includes("history")) ||
    b.title.toLowerCase().includes("wings of fire") ||
    b.title.toLowerCase().includes("autobiography")
  );

  const artDesignBooks = allItems.filter((b) =>
    (b.genres || []).some((g) => g.name.toLowerCase().includes("art") || g.name.toLowerCase().includes("drawing")) ||
    b.title.toLowerCase().includes("figure drawing") ||
    b.title.toLowerCase().includes("design")
  );

  const educationalTextbooks = allItems.filter((b) =>
    (b.genres || []).some((g) => g.name.toLowerCase().includes("education") || g.name.toLowerCase().includes("science")) ||
    b.title.toLowerCase().includes("science") ||
    b.title.toLowerCase().includes("fundamentals")
  );

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

      {/* 4. The 10 Rich Book Sections & Curated Shelves */}
      <div className="flex flex-col gap-14 sm:gap-18 pt-2">
        {/* Section 1: Featured Masterpieces */}
        {overviewData.featured?.items?.length > 0 && (
          <DiscoverySection
            title="Featured Masterpieces"
            description="Curated highlights and hand-picked treasures from the archive."
            actionHref="/discover/featured"
            actionLabel="View all picks"
          >
            <FeaturedBooks items={overviewData.featured.items} />
          </DiscoverySection>
        )}

        {/* Section 2: Trending Volumes (High Velocity & Engagement) */}
        {overviewData.trending?.books?.length > 0 && (
          <DiscoverySection
            title="Trending Volumes"
            description="Most active and frequently read works across the digital catalogue."
            actionHref="/discover/trending"
            actionLabel="View trending rank"
          >
            <BookCarousel items={overviewData.trending.books} priority={true} />
          </DiscoverySection>
        )}

        {/* Section 3: Cybersecurity & Offensive Defense */}
        {securityBooks.length > 0 && (
          <DiscoverySection
            title="Cybersecurity & Offensive Defense"
            description="Practical penetration testing handbooks, vulnerability analysis, and network security foundations."
            actionHref="/search?q=Cybersecurity"
            actionLabel="Explore security"
          >
            <BookCarousel items={securityBooks} />
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
        {yogaHealthBooks.length > 0 && (
          <DiscoverySection
            title="Yoga, Asanas & Holistic Health"
            description="Definitive posture manuals, alignment mechanics, daily breathwork, and transformative mind-body wellness."
            actionHref="/search?q=Yoga"
            actionLabel="View yoga guides"
          >
            <BookCarousel items={yogaHealthBooks} />
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

        {/* Section 9: Visual Arts & Creative Design */}
        {artDesignBooks.length > 0 && (
          <DiscoverySection
            title="Visual Arts & Creative Design"
            description="Mastery of human anatomy, structural gesture drawing, creative invention, and classical illustration."
            actionHref="/search?q=Art"
            actionLabel="Explore art books"
          >
            <BookCarousel items={artDesignBooks} />
          </DiscoverySection>
        )}

        {/* Section 10: Foundational Educational Textbooks */}
        {educationalTextbooks.length > 0 && (
          <DiscoverySection
            title="Foundational Educational Textbooks"
            description="Secondary physical sciences, curriculum mathematics, and foundational academic learning."
            actionHref="/search?q=Science"
            actionLabel="Explore textbooks"
          >
            <BookCarousel items={educationalTextbooks} />
          </DiscoverySection>
        )}

        {/* Section 11: Recently Added Ingestions */}
        {overviewData.newArrivals?.items?.length > 0 && (
          <DiscoverySection
            title="Recently Cataloged Editions"
            description="Freshly catalogued and preserved public domain editions."
            actionHref="/discover/new"
            actionLabel="View recent additions"
          >
            <BookCarousel items={overviewData.newArrivals.items} />
          </DiscoverySection>
        )}

        {/* Subject Domains */}
        {overviewData.subjects?.items?.length > 0 && (
          <DiscoverySection
            title="Explore by Knowledge Domain"
            description="Dive into specific disciplines, humanities, and sciences."
          >
            <SubjectGrid items={overviewData.subjects.items.slice(0, 12)} />
          </DiscoverySection>
        )}

        {/* Curated Archival Collections */}
        {overviewData.collections?.items?.length > 0 && (
          <DiscoverySection
            title="Curated Archival Collections"
            description="Thematic anthologies and structured reading paths."
            actionHref="/discover/collections"
            actionLabel="Explore collections"
          >
            <CollectionGrid items={overviewData.collections.items.slice(0, 4)} />
          </DiscoverySection>
        )}

        {/* Authors */}
        {overviewData.authors?.items?.length > 0 && (
          <DiscoverySection
            title="Prominent Authors & Thinkers"
            description="Discover the prolific minds whose writings shaped history."
            actionHref="/discover/authors"
            actionLabel="Browse all authors"
          >
            <AuthorGrid items={overviewData.authors.items.slice(0, 12)} />
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
