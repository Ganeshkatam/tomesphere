import { createSupabaseServerClient } from "@/modules/shared/core/database/server";
import { SupabaseDiscoveryReadModel } from "@/modules/discovery/infrastructure/read-models/SupabaseDiscoveryReadModel";
import { searchBooks } from "@/modules/discovery/application/queries/SearchBooks/handler";
import SearchClient from "./SearchClient";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : undefined;
  const genre = typeof params.genre === "string" ? params.genre : undefined;
  const page = typeof params.page === "string" ? parseInt(params.page, 10) : 1;

  const supabase = await createSupabaseServerClient();
  const repository = new SupabaseDiscoveryReadModel(supabase);
  
  const results = await searchBooks(repository, { term: q, genre, page });

  return <SearchClient key={q || "empty"} initialResults={results} query={q || ""} />;
}
