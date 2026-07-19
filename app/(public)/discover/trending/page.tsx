import Navbar from "@/modules/shared/navigation/components/Navbar";
import Footer from "@/modules/shared/navigation/components/Footer";
import { TrendingClient } from "./TrendingClient";
import { getTrendingBooks } from "@/modules/discovery/application/queries/GetTrendingBooks/handler";
import { SupabaseDiscoveryReadModel } from "@/modules/discovery/infrastructure/read-models/SupabaseDiscoveryReadModel";
import { createSupabaseServerClient } from "@/modules/shared/core/database/server";

export const metadata = {
  title: "Trending Books Right Now | TomeSphere",
  description: "Discover the most popular and trending books across the TomeSphere community.",
};

export default async function TrendingPage() {
  const supabase = await createSupabaseServerClient();
  const repository = new SupabaseDiscoveryReadModel(supabase);

  const initialPeriod = "weekly";
  const result = await getTrendingBooks(repository, {
    period: initialPeriod,
    limit: 20,
    page: 1,
  });

  return (
    <main className="w-full mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          Trending Now
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-400">
          Discover what the TomeSphere community is reading, loving, and recommending.
        </p>
      </div>

      <TrendingClient 
        initialBooks={result.books} 
        initialPeriod={initialPeriod}
      />
    </main>
  );
}
