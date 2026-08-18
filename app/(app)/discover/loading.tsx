import { DiscoveryHero } from "@/modules/discovery/presentation/components/DiscoveryHero";

export default function DiscoverLoading() {
  return (
    <div className="w-full flex flex-col gap-12 pb-24">
      <DiscoveryHero />
      
      {/* Skeletons for sections */}
      <div className="flex flex-col gap-16">
        {[1, 2, 3].map((sectionIndex) => (
          <section key={sectionIndex} className="w-full flex flex-col gap-6 py-8">
            <header className="flex items-end justify-between border-b border-outline-variant/30 pb-4">
              <div className="w-48 h-8 bg-surface-variant/50 rounded animate-pulse" />
            </header>
            
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="w-full aspect-[2/3] bg-surface-variant/30 rounded animate-pulse" />
                  <div className="w-3/4 h-5 bg-surface-variant/40 rounded animate-pulse" />
                  <div className="w-1/2 h-4 bg-surface-variant/20 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
