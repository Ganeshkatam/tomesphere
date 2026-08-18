import { DiscoverySearch } from "./DiscoverySearch";

export function DiscoveryHero() {
  return (
    <section className="relative w-full py-16 md:py-24 flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Extremely subtle background treatment */}
      <div className="absolute inset-0 pointer-events-none flex justify-center">
        <div className="w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] opacity-70 -translate-y-1/2" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-3xl px-4">
        <h1 className="font-serif text-display-sm md:text-display-md text-on-surface mb-4 tracking-tight">
          Find something worth reading.
        </h1>
        <p className="text-body-lg text-on-surface-variant max-w-xl mb-10">
          Explore books, authors, subjects and collections across the TomeSphere
          catalogue.
        </p>

        <DiscoverySearch />
        
        {/* We can potentially add trending searches here later as mentioned by user */}
        <div className="mt-8 text-label-md text-on-surface-variant/70 flex gap-2 flex-wrap justify-center">
          <span>Trending searches:</span>
          <a href="/search?q=History" className="hover:text-primary transition-colors">History</a>
          <span className="opacity-50">&middot;</span>
          <a href="/search?q=Figure Drawing" className="hover:text-primary transition-colors">Figure Drawing</a>
          <span className="opacity-50">&middot;</span>
          <a href="/search?q=Philosophy" className="hover:text-primary transition-colors">Philosophy</a>
          <span className="opacity-50">&middot;</span>
          <a href="/search?q=Mathematics" className="hover:text-primary transition-colors">Mathematics</a>
        </div>
      </div>
    </section>
  );
}
