import { getDiscoveryFacade } from "@/modules/discovery/application/facades";
import { BookGrid } from "@/modules/discovery/presentation/components/BookGrid";
import { CollectionGrid } from "@/modules/discovery/presentation/components/CollectionGrid";
import { AuthorGrid } from "@/modules/discovery/presentation/components/AuthorGrid";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

function SectionHeader({ title, href }: { title: string; href?: string }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-display font-bold text-[var(--text-primary)]">
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="text-sm font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
        >
          View All <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}

export default async function DiscoverOverviewPage() {
  const facade = await getDiscoveryFacade();
  const data = await facade.getOverview();

  return (
    <div className="w-full flex flex-col gap-16 pb-16">
      <div>
        <h1 className="text-3xl font-display font-bold text-[var(--text-primary)] mb-2">
          Discover
        </h1>
        <p className="text-[var(--text-secondary)]">
          Explore our vast library of books, curated collections, and more.
        </p>
      </div>

      <section>
        <SectionHeader title="Trending Books" href="/discover/trending" />
        <BookGrid items={data.trending.books.slice(0, 6)} />
      </section>

      <section>
        <SectionHeader title="Featured" href="/discover/featured" />
        <BookGrid items={data.featured.items.slice(0, 6)} />
      </section>

      <section>
        <SectionHeader title="New Arrivals" href="/discover/new" />
        <BookGrid items={data.newArrivals.items.slice(0, 6)} />
      </section>

      <section>
        <SectionHeader title="Curated Collections" href="/discover/collections" />
        <CollectionGrid items={data.collections.items.slice(0, 6)} />
      </section>

      <section>
        <SectionHeader title="Popular Authors" href="/discover/authors" />
        <AuthorGrid items={data.authors.items.slice(0, 6)} />
      </section>

    </div>
  );
}
