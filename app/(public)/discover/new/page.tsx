import { executeGetDiscoveryOverviewQuery } from "@/modules/discovery/application/queries/GetDiscoveryOverview";
import BookCard from "@/modules/reading/books/components/BookCard";

export default async function NewArrivalsPage() {
  const overview = await executeGetDiscoveryOverviewQuery();
  const newBooks = overview.newBooks || [];

  return (
    <div className="w-full pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-[var(--text-primary)]">New Arrivals</h1>
        <p className="text-[var(--text-secondary)] mt-2">The newest additions to our library.</p>
      </div>
      
      {newBooks.length === 0 ? (
        <div className="p-12 text-center bg-[var(--surface-raised)] rounded-2xl border border-[var(--border-default)]">
          <p className="text-[var(--text-secondary)]">No new books available right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {newBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
