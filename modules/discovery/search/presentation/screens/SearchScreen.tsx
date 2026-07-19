import { searchBooks } from "@/modules/discovery/search/presentation/actions/search";
import SearchClient from "@/modules/discovery/search/presentation/components/SearchClient";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; genre?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || "";
  const genre = params.genre || "";
  const page = Math.max(1, parseInt(params.page || "1", 10));

  const result = await searchBooks(query, genre, page);

  const books = result.success ? result.data.books : [];
  const count = result.success ? result.data.count : 0;
  const hasMore = result.success ? result.data.hasMore : false;

  return (
    <SearchClient
      initialBooks={books}
      initialCount={count}
      initialQuery={query}
      initialGenre={genre}
      initialPage={page}
      hasMore={hasMore}
    />
  );
}
