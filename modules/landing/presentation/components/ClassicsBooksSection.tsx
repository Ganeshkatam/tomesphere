import { ArrowRight } from "lucide-react";
import FeaturedItemCard from "./FeaturedItemCard";
import ViewAllCard from "./ViewAllCard";

interface ClassicsBooksSectionProps {
  items?: any[];
}

export default function ClassicsBooksSection({
  items,
}: ClassicsBooksSectionProps) {
  if (!items || items.length === 0) return null;

  const displayBooks = items.slice(0, 10);

  return (
    <section className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16 w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-display font-bold text-[var(--text-primary)]">
            Timeless Classics
          </h2>
          <p className="text-[var(--text-secondary)] mt-2">
            Essential literature and foundational works across history.
          </p>
        </div>
        <a
          href="/discover"
          className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline transition-colors flex items-center gap-1"
        >
          View all <ArrowRight size={16} />
        </a>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {displayBooks.map((item) => (
          <FeaturedItemCard key={item.id} item={item} />
        ))}
        <ViewAllCard
          href="/discover"
          title="All Classics"
          countLabel="Timeless Heritage"
        />
      </div>
    </section>
  );
}
