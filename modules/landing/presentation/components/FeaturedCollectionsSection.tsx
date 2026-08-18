import { ArrowRight, Layers } from "lucide-react";
import Link from "next/link";

interface FeaturedCollectionsSectionProps {
  collections: any[];
}

export default function FeaturedCollectionsSection({
  collections,
}: FeaturedCollectionsSectionProps) {
  if (!collections || collections.length === 0) return null;

  return (
    <section className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16 w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-display font-bold text-[var(--text-primary)]">
            Featured Collections
          </h2>
          <p className="text-[var(--text-secondary)] mt-2">
            Curated reading lists to explore.
          </p>
        </div>
        <Link
          href="/discover/collections"
          className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline transition-colors flex items-center gap-1"
        >
          View all <ArrowRight size={16} />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {collections.slice(0, 3).map((collection, i) => (
          <Link
            key={collection.id || i}
            href="/discover/collections"
            className="group relative p-6 bg-[var(--surface-raised)] hover:bg-[var(--surface-overlay)] rounded-2xl border border-[var(--border-default)] hover:border-indigo-500/50 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <Layers size={20} />
              </div>
              <span className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                {collection.bookCount ? `${collection.bookCount} Books` : "Curated List"}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-indigo-500 transition-colors mb-1">
                {collection.title || collection.name || "Curated Collection"}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
                {collection.description || "A curated collection of selected books for your library."}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
