import { AuthorCard } from "./AuthorCard";

interface AuthorGridProps {
  items: any[];
}

export function AuthorGrid({ items }: AuthorGridProps) {
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-[var(--border-default)] rounded-2xl">
        <p className="text-[var(--text-secondary)]">No items found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {items.map((item, i) => (
        <div
          key={item.id || item.slug || item || i}
          className="animate-fade-in-up"
          style={{ animationDelay: i * 50 + "ms" }}
        >
          <AuthorCard data={item} />
        </div>
      ))}
    </div>
  );
}
