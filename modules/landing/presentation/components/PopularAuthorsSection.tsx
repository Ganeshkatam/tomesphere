import { ArrowRight } from "lucide-react";

interface PopularAuthorsSectionProps {
  authors: string[];
}

export default function PopularAuthorsSection({
  authors,
}: PopularAuthorsSectionProps) {
  if (!authors || authors.length === 0) return null;

  return (
    <section className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16 w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-display font-bold text-[var(--text-primary)]">
            Popular Authors
          </h2>
          <p className="text-[var(--text-secondary)] mt-2">
            Discover prolific writers in our catalog.
          </p>
        </div>
        <a
          href="/discover/authors"
          className="text-sm font-semibold text-primary hover:text-primary-light transition-colors flex items-center gap-1"
        >
          View all <ArrowRight size={16} />
        </a>
      </div>
      <div className="flex flex-wrap gap-3">
        {authors.map((author) => (
          <a
            key={author}
            href={`/discover/authors/${author.toLowerCase().replace(/\s+/g, "-")}`}
            className="px-6 py-3 rounded-full bg-[var(--surface-raised)] border border-[var(--border-default)] hover:border-primary transition-colors text-[var(--text-primary)] font-medium"
          >
            {author}
          </a>
        ))}
      </div>
    </section>
  );
}
