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
    <div className="w-full flex flex-col gap-12 pb-24">
      <DiscoveryHero />

      <div className="flex flex-col gap-16">
        {data.featured?.items?.length > 0 && (
          <DiscoverySection
            title="Featured"
            description="Our hand-picked selection for you."
            actionHref="/discover/featured"
          >
            <FeaturedBooks items={data.featured.items.slice(0, 6)} />
          </DiscoverySection>
        )}

        {data.trending?.books?.length > 0 && (
          <DiscoverySection
            title="Trending Books"
            description="What everyone is reading right now."
            actionHref="/discover/trending"
          >
            <BookGrid items={data.trending.books.slice(0, 6)} priority={true} />
          </DiscoverySection>
        )}

        {data.subjects?.items?.length > 0 && (
          <DiscoverySection
            title="Explore by subject"
          >
            <SubjectGrid items={data.subjects.items.slice(0, 12)} />
          </DiscoverySection>
        )}

        {data.newArrivals?.items?.length > 0 && (
          <DiscoverySection
            title="New Arrivals"
            description="Fresh off the press and newly added."
            actionHref="/discover/new"
          >
            <BookGrid items={data.newArrivals.items.slice(0, 6)} />
          </DiscoverySection>
        )}

        {data.collections?.items?.length > 0 && (
          <DiscoverySection
            title="Collections"
            description="Curated paths through the catalogue."
            actionHref="/discover/collections"
          >
            <CollectionGrid items={data.collections.items.slice(0, 4)} />
          </DiscoverySection>
        )}

        {data.authors?.items?.length > 0 && (
          <DiscoverySection
            title="Authors"
            actionHref="/discover/authors"
          >
            <AuthorGrid items={data.authors.items.slice(0, 6)} />
          </DiscoverySection>
        )}
      </div>
    </div>
  );
}
