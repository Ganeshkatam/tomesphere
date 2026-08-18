import { Search } from "lucide-react";

export function DiscoverySearch() {
  return (
    <form
      action="/search"
      method="get"
      className="relative flex items-center w-full max-w-2xl"
    >
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-on-surface-variant" />
      </div>
      <input
        type="search"
        name="q"
        placeholder="Search books, authors, subjects..."
        className="w-full bg-surface-variant/50 border border-outline/20 text-on-surface text-body-lg rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-surface transition-all placeholder:text-on-surface-variant/70"
      />
      <button type="submit" className="sr-only">
        Search
      </button>
    </form>
  );
}
