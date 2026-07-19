import { executeGetDiscoveryOverviewQuery } from "@/modules/discovery/application/queries/GetDiscoveryOverview";
import BookCard from "@/modules/reading/books/components/BookCard";

export default async function FeaturedPage() {
  const overview = await executeGetDiscoveryOverviewQuery();
  const featuredBooks = overview.featuredBooks || [];

  return (
    <div className="w-full pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-[var(--text-primary)]">Featured Books</h1>
        <p className="text-[var(--text-secondary)] mt-2">Editor-picked selections for you.</p>
      </div>
      
      {featuredBooks.length === 0 ? (
        <div className="p-12 text-center bg-[var(--surface-raised)] rounded-2xl border border-[var(--border-default)]">
          <p className="text-[var(--text-secondary)]">No featured books available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {featuredBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
