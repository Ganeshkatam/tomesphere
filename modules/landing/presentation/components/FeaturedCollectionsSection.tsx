import { ArrowRight } from "lucide-react";

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
        <a
          href="/discover/collections"
          className="text-sm font-semibold text-primary hover:text-primary-light transition-colors flex items-center gap-1"
        >
          View all <ArrowRight size={16} />
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {collections.slice(0, 3).map((collection, i) => (
          <div
            key={i}
            className="h-40 bg-[var(--surface-raised)] rounded-2xl border border-[var(--border-default)] flex items-center justify-center"
          >
            <span className="text-[var(--text-secondary)]">
              Collection Preview
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
