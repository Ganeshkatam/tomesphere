import { searchAction } from "@/modules/discovery/search/presentation/actions/searchActions";
import { SearchFacetSidebar } from "@/modules/discovery/search/presentation/components/SearchFacetSidebar";
import BookCard from "@/modules/books/components/BookCard";
import { SearchRequest } from "@/modules/discovery/search/application/dto/SearchRequestDto";
import { Frown } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Search Catalog - TomeSphere",
  description: "Search for books, authors, genres, and more in the TomeSphere catalog.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const query = typeof resolvedParams.q === "string" ? resolvedParams.q : "";
  const page = typeof resolvedParams.page === "string" ? parseInt(resolvedParams.page, 10) : 1;
  const sort = typeof resolvedParams.sort === "string" ? (resolvedParams.sort as any) : "relevance";

  // In V1, we assume specific filter parameters rather than "facet.xxx" mapping
  // Let's adapt whatever comes in if needed, but for now we expect structured filters
  const request: SearchRequest = {
    query,
    page: isNaN(page) || page < 1 ? 1 : page,
    pageSize: 20,
    sort,
    filters: {}, // To be populated properly by URL parsing in future sprints
  };

  const results = await searchAction(request);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
          Search Results for &quot;{query}&quot;
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          {results.totalCount} result{results.totalCount !== 1 && "s"} found in {results.executionTimeMs}ms
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Facets */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-24">
            <SearchFacetSidebar facets={results.facets} />
          </div>
        </aside>

        {/* Main Results Area */}
        <main className="flex-1 min-w-0">
          {results.results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {results.results.map((book) => (
                <BookCard
                  key={book.id}
                  book={{
                    id: book.id,
                    slug: book.slug || book.id,
                    title: book.title,
                    authors: book.authors ? book.authors.map((a) => ({ name: a })) : [],
                    genres: book.genres ? book.genres.map((g) => ({ name: g })) : [],
                    coverUrl: book.coverUrl ? book.coverUrl.replace(/ /g, "%20") : null,
                    language: book.language,
                    publicationYear: book.publicationYear,
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-[var(--surface-raised)] rounded-full flex items-center justify-center mb-4">
                <Frown className="w-8 h-8 text-[var(--text-tertiary)]" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                No results found
              </h3>
              <p className="text-[var(--text-secondary)] mt-2 max-w-md">
                We couldn&apos;t find any books matching &quot;{query}&quot;. Try checking your spelling or using more general terms.
              </p>
            </div>
          )}

          {/* Pagination Controls */}
          {results.totalPages > 1 && (
            <div className="mt-12 flex justify-center space-x-2">
              {Array.from({ length: Math.min(5, results.totalPages) }).map((_, idx) => {
                const pageNum = idx + 1;
                const params = new URLSearchParams();
                for (const [key, value] of Object.entries(searchParams)) {
                  if (Array.isArray(value)) value.forEach(v => params.append(key, v));
                  else if (value !== undefined) params.append(key, value as string);
                }
                params.set("page", pageNum.toString());

                return (
                  <a
                    key={pageNum}
                    href={`/search?${params.toString()}`}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-semibold transition-colors ${
                      pageNum === request.page
                        ? "bg-indigo-600 text-white"
                        : "bg-[var(--surface-raised)] text-[var(--text-primary)] hover:bg-[var(--surface-overlay)] border border-[var(--border-subtle)]"
                    }`}
                  >
                    {pageNum}
                  </a>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
