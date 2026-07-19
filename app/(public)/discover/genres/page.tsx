import { executeGetDiscoveryOverviewQuery } from "@/modules/discovery/application/queries/GetDiscoveryOverview";
import Link from "next/link";

export default async function GenresPage() {
  const overview = await executeGetDiscoveryOverviewQuery();
  const genres = overview.genres || [];

  return (
    <div className="w-full pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-[var(--text-primary)]">Browse by Genre</h1>
        <p className="text-[var(--text-secondary)] mt-2">Explore specific subjects.</p>
      </div>

      {genres.length === 0 ? (
        <div className="p-12 text-center bg-[var(--surface-raised)] rounded-2xl border border-[var(--border-default)]">
          <p className="text-[var(--text-secondary)]">No genres available right now.</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {genres.map(genre => (
            <Link key={genre} href={`/discover/genres/${genre.toLowerCase().replace(/\s+/g, '-')}`} className="px-6 py-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-default)] hover:border-primary transition-colors text-[var(--text-primary)] font-medium">
              {genre}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
