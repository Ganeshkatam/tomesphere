import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface GenreBrowserSectionProps {
  genres: string[];
}

export default function GenreBrowserSection({
  genres,
}: GenreBrowserSectionProps) {
  if (!genres || genres.length === 0) return null;

  return (
    <section className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16 w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-display font-bold text-[var(--text-primary)]">
            Browse by Genre
          </h2>
          <p className="text-[var(--text-secondary)] mt-2">
            Explore specific subjects.
          </p>
        </div>
        <Link
          href="/discover"
          className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline transition-colors flex items-center gap-1"
        >
          View all <ArrowRight size={16} />
        </Link>
      </div>
      <div className="flex flex-wrap gap-3">
        {genres.map((genre) => (
          <Link
            key={genre}
            href={`/discover/search?genre=${encodeURIComponent(genre)}`}
            className="px-5 py-2.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-default)] hover:border-indigo-500 hover:text-indigo-500 transition-colors text-[var(--text-primary)] text-sm font-medium shadow-xs"
          >
            {genre}
          </Link>
        ))}
      </div>
    </section>
  );
}
