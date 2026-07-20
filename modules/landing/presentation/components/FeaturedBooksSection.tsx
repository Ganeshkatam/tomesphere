import { ArrowRight } from "lucide-react";
import FeaturedItemCard from "./FeaturedItemCard";

interface FeaturedBooksSectionProps {
  items: any[];
}

export default function FeaturedBooksSection({
  items,
}: FeaturedBooksSectionProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16 w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-display font-bold text-[var(--text-primary)]">
            Featured Books
          </h2>
          <p className="text-[var(--text-secondary)] mt-2">
            Editor-picked selections for you.
          </p>
        </div>
        <a
          href="/discover/featured"
          className="text-sm font-semibold text-primary hover:text-primary-light transition-colors flex items-center gap-1"
        >
          View all <ArrowRight size={16} />
        </a>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {items.slice(0, 6).map((item) => (
          <FeaturedItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
