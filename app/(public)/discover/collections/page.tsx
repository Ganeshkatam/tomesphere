import { executeGetDiscoveryOverviewQuery } from "@/modules/discovery/application/queries/GetDiscoveryOverview";

export default async function CollectionsPage() {
  const overview = await executeGetDiscoveryOverviewQuery();
  const featuredCollections = overview.featuredCollections || [];

  return (
    <div className="w-full pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-[var(--text-primary)]">Collections</h1>
        <p className="text-[var(--text-secondary)] mt-2">Curated reading lists to explore.</p>
      </div>

      {featuredCollections.length === 0 ? (
        <div className="p-12 text-center bg-[var(--surface-raised)] rounded-2xl border border-[var(--border-default)]">
          <p className="text-[var(--text-secondary)]">Check back soon for curated collections.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCollections.map((collection, i) => (
            <div key={i} className="h-40 bg-[var(--surface-raised)] rounded-2xl border border-[var(--border-default)] flex items-center justify-center">
              <span className="text-[var(--text-secondary)]">Collection Preview</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
