import { getDiscoveryFacade } from "@/modules/discovery/application/facades";
import { DiscoveryHero } from "@/modules/discovery/presentation/components/DiscoveryHero";
import { DiscoverySection } from "@/modules/discovery/presentation/components/DiscoverySection";
import { FeaturedBooks } from "@/modules/discovery/presentation/components/FeaturedBooks";
import { BookGrid } from "@/modules/discovery/presentation/components/BookGrid";
import { CollectionGrid } from "@/modules/discovery/presentation/components/CollectionGrid";
import { AuthorGrid } from "@/modules/discovery/presentation/components/AuthorGrid";
import { SubjectGrid } from "@/modules/discovery/presentation/components/SubjectGrid";

export const dynamic = "force-dynamic";

export default async function DiscoverOverviewPage() {
  const facade = await getDiscoveryFacade();
  const data = await facade.getOverview();

  return (
    <div className="min-h-screen bg-[var(--surface-canvas)] py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16 animate-in fade-in duration-300">
        {/* Discovery Hero Search & Trending Pills */}
        <DiscoveryHero />

        {/* Main Catalogue Sections */}
        <div className="flex flex-col gap-12 sm:gap-16">
          {data.featured?.items?.length > 0 && (
            <DiscoverySection
              title="Featured Masterpieces"
              description="Curated highlights and hand-picked treasures from the archive."
              actionHref="/discover/featured"
            >
              <FeaturedBooks items={data.featured.items.slice(0, 6)} />
            </DiscoverySection>
          )}

          {data.trending?.books?.length > 0 && (
            <DiscoverySection
              title="Trending Volumes"
              description="Most active and frequently read works across the digital catalogue."
              actionHref="/discover/trending"
            >
              <BookGrid items={data.trending.books.slice(0, 6)} priority={true} />
            </DiscoverySection>
          )}

          {data.subjects?.items?.length > 0 && (
            <DiscoverySection
              title="Explore by Knowledge Domain"
              description="Dive into specific disciplines, humanities, and sciences."
            >
              <SubjectGrid items={data.subjects.items.slice(0, 12)} />
            </DiscoverySection>
          )}

          {data.newArrivals?.items?.length > 0 && (
            <DiscoverySection
              title="New Additions"
              description="Freshly catalogued and preserved public domain editions."
              actionHref="/discover/new"
            >
              <BookGrid items={data.newArrivals.items.slice(0, 6)} />
            </DiscoverySection>
          )}

          {data.collections?.items?.length > 0 && (
            <DiscoverySection
              title="Curated Archival Collections"
              description="Thematic anthologies and structured reading paths."
              actionHref="/discover/collections"
            >
              <CollectionGrid items={data.collections.items.slice(0, 4)} />
            </DiscoverySection>
          )}

          {data.authors?.items?.length > 0 && (
            <DiscoverySection
              title="Prominent Authors & Thinkers"
              description="Discover the prolific minds whose writings shaped history."
              actionHref="/discover/authors"
            >
              <AuthorGrid items={data.authors.items.slice(0, 6)} />
            </DiscoverySection>
          )}
        </div>
      </div>
    </div>
  );
}
