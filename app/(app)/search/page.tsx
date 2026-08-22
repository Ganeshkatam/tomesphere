import { searchAction } from "@/modules/discovery/search/presentation/actions/searchActions";
import { SearchFacetSidebar } from "@/modules/discovery/search/presentation/components/SearchFacetSidebar";
import BookCard from "@/modules/books/components/BookCard";
import { SearchRequest } from "@/modules/discovery/search/application/dto/SearchRequestDto";
import {
  Search as SearchIcon,
  SlidersHorizontal,
  BookOpen,
  ArrowUpDown,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { SearchBar } from "@/modules/discovery/search/presentation/components/SearchBar";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Search Digital Archive - TomeSphere",
  description:
    "Explore digitized volumes, textbooks, and public domain editions across the TomeSphere archive.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const query = typeof resolvedParams.q === "string" ? resolvedParams.q : "";
  const page =
    typeof resolvedParams.page === "string"
      ? parseInt(resolvedParams.page, 10)
      : 1;
  const sort =
    typeof resolvedParams.sort === "string"
      ? (resolvedParams.sort as any)
      : "relevance";

  // Parse structured URL facet filters
  const getArrayParam = (key: string): string[] => {
    const val = resolvedParams[key];
    if (!val) return [];
    return Array.isArray(val) ? val : [val];
  };

  const genres = getArrayParam("facet.genres");
  const subjects = getArrayParam("facet.subjects");
  const language = getArrayParam("facet.languages");
  const publicationYear = getArrayParam("facet.publicationYears")
    .map((y) => parseInt(y, 10))
    .filter((y) => !isNaN(y));

  const request: SearchRequest = {
    query,
    page: isNaN(page) || page < 1 ? 1 : page,
    pageSize: 20,
    sort,
    filters: {
      genres,
      subjects,
      language,
      publicationYear,
    },
  };

  const results = await searchAction(request);

  const activeFilterCount =
    genres.length + subjects.length + language.length + publicationYear.length;

  // Only show facets that can actually filter something (more than 1 option, or already selected)
  const usefulFacets = results.facets.filter(
    (f) => f.values && (f.values.length > 1 || f.values.some((v) => v.selected))
  );

  const showSidebar = usefulFacets.length > 0 || activeFilterCount > 0;

  return (
    <div className="min-h-screen bg-[var(--surface-canvas)] py-6 sm:py-10 px-4 sm:px-6 lg:px-8 xl:px-12 w-full">
      <div className="w-full max-w-[1760px] mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-300">
        {/* Search Header Banner */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-extrabold uppercase tracking-wider">
                  <SearchIcon size={12} />
                  <span>Catalogue Search</span>
                </span>
                {results.isTypoFallback && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-[11px] font-bold">
                    <Sparkles size={11} />
                    <span>Fuzzy Match</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {query ? (
                  <>
                    Results for &ldquo;
                    <span className="text-indigo-600 dark:text-indigo-400">
                      {query}
                    </span>
                    &rdquo;
                  </>
                ) : (
                  "Explore All Archive Volumes"
                )}
              </h1>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                {results.totalCount} volume{results.totalCount !== 1 && "s"} found{" "}
                <span className="text-slate-400 dark:text-slate-600 font-mono">
                  ({results.executionTimeMs}ms)
                </span>
              </p>
            </div>

            {/* Quick Sort Options */}
            <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300">
                <ArrowUpDown size={13} className="text-indigo-500" />
                <span>Sort:</span>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl">
                {[
                  { key: "relevance", label: "Relevance" },
                  { key: "popular", label: "Popular" },
                  { key: "newest", label: "Newest" },
                ].map((s) => {
                  const isSelected = (sort || "relevance") === s.key;
                  const params = new URLSearchParams();
                  for (const [k, v] of Object.entries(resolvedParams)) {
                    if (Array.isArray(v))
                      v.forEach((val) => params.append(k, val));
                    else if (v !== undefined) params.append(k, v);
                  }
                  params.set("sort", s.key);
                  params.set("page", "1");

                  return (
                    <Link
                      key={s.key}
                      href={`/search?${params.toString()}`}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      {s.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Dedicated Search Input Bar on Page */}
          <div className="max-w-2xl">
            <SearchBar
              size="lg"
              initialQuery={query}
              placeholder="Search title, author, subject, or keyword..."
            />
          </div>
        </div>

        {/* Main Search Body with Facets Sidebar and Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Facets (3.5 cols on LG) */}
          {showSidebar && (
            <aside className="lg:col-span-3 w-full">
              <div className="sticky top-24">
                <SearchFacetSidebar facets={usefulFacets} />
              </div>
            </aside>
          )}

          {/* Results Grid Area (8.5 cols on LG) */}
          <main className={`${showSidebar ? "lg:col-span-9" : "lg:col-span-12"} w-full min-w-0`}>
            {results.results.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                {results.results.map((book, index) => (
                  <div key={book.id} className="w-full">
                    <BookCard
                      book={{
                        id: book.id,
                        slug: book.slug || book.id,
                        title: book.title,
                        authors: book.authors
                          ? book.authors.map((a) => ({ name: a }))
                          : [],
                        genres: book.genres
                          ? book.genres.map((g) => ({ name: g }))
                          : [],
                        coverUrl: book.coverUrl
                          ? book.coverUrl.replace(/ /g, "%20")
                          : null,
                        language: book.language,
                        publicationYear: book.publicationYear,
                      }}
                      priority={index < 4}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 sm:p-16 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-1">
                  <BookOpen size={28} />
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  No volumes match your search
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
                  We could not find any books matching &ldquo;{query}&rdquo;. Try
                  checking your spelling, removing filters, or browsing by
                  subject.
                </p>
                <div className="pt-2">
                  <Link
                    href="/discover"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all"
                  >
                    <span>Browse All Discover Categories</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Pagination Controls */}
            {results.totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                {Array.from({ length: Math.min(6, results.totalPages) }).map(
                  (_, idx) => {
                    const pageNum = idx + 1;
                    const params = new URLSearchParams();
                    for (const [key, value] of Object.entries(resolvedParams)) {
                      if (Array.isArray(value))
                        value.forEach((v) => params.append(key, v));
                      else if (value !== undefined)
                        params.append(key, value as string);
                    }
                    params.set("page", pageNum.toString());

                    return (
                      <Link
                        key={pageNum}
                        href={`/search?${params.toString()}`}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl text-xs font-bold transition-all ${
                          pageNum === request.page
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                            : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
                        }`}
                      >
                        {pageNum}
                      </Link>
                    );
                  },
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
