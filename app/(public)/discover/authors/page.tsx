import { executeGetDiscoveryOverviewQuery } from "@/modules/discovery/application/queries/GetDiscoveryOverview";
import Link from "next/link";

export default async function AuthorsPage() {
  const overview = await executeGetDiscoveryOverviewQuery();
  const authors = overview.authors || [];

  return (
    <div className="w-full pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-[var(--text-primary)]">Popular Authors</h1>
        <p className="text-[var(--text-secondary)] mt-2">Discover prolific writers in our catalog.</p>
      </div>

      {authors.length === 0 ? (
        <div className="p-12 text-center bg-[var(--surface-raised)] rounded-2xl border border-[var(--border-default)]">
          <p className="text-[var(--text-secondary)]">No authors available right now.</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {authors.map(author => (
            <Link key={author} href={`/discover/authors/${author.toLowerCase().replace(/\s+/g, '-')}`} className="px-6 py-3 rounded-full bg-[var(--surface-raised)] border border-[var(--border-default)] hover:border-primary transition-colors text-[var(--text-primary)] font-medium">
              {author}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
