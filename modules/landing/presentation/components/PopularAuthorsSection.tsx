import { ArrowRight, User } from "lucide-react";
import Link from "next/link";

interface PopularAuthorsSectionProps {
  authors: string[];
}

export default function PopularAuthorsSection({
  authors,
}: PopularAuthorsSectionProps) {
  if (!authors || authors.length === 0) return null;

  return (
    <section className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-display font-bold text-[var(--text-primary)]">
            Popular Authors
          </h2>
          <p className="text-[var(--text-secondary)] mt-2">
            Discover prolific writers in our catalog.
          </p>
        </div>
        <Link
          href="/discover/authors"
          className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline transition-colors flex items-center gap-1"
        >
          View all <ArrowRight size={16} />
        </Link>
      </div>
      <div className="flex flex-wrap gap-3">
        {authors.map((author) => (
          <Link
            key={author}
            href={`/search?q=${encodeURIComponent(author)}`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--surface-raised)] border border-[var(--border-default)] hover:border-indigo-500 hover:text-indigo-500 transition-colors text-[var(--text-primary)] text-sm font-medium shadow-xs"
          >
            <div className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <User size={12} />
            </div>
            <span>{author}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
