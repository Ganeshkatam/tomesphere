"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DiscoveryOverviewDto } from "@/modules/discovery/application/queries/GetDiscoveryOverview/read-model";
import BookCard from "@/modules/books/components/BookCard";
import {
  FadeIn,
  SlideUp,
  StaggerContainer,
  StaggerItem,
} from "@/shared/ui/motion";
import { Search } from "lucide-react";

interface ExploreClientProps {
  user: any;
  initialData: DiscoveryOverviewDto;
}

export default function ExploreClient({
  user,
  initialData,
}: ExploreClientProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(
        `/search?q=${encodeURIComponent(searchTerm.trim())}`,
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-page pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FadeIn className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            Explore <span className="gradient-text">Knowledge</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Discover your next favorite read from our curated collection,
            featuring diverse subjects and timeless classics.
          </p>
        </FadeIn>

        <SlideUp className="glass-strong rounded-3xl p-6 mb-12 border border-[var(--border-default)] shadow-2xl max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400 transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by title, author, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-[var(--border-default)] rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all placeholder:text-slate-500"
            />
          </form>
        </SlideUp>

        <Section title="Featured" books={initialData.featuredBooks} />
        <Section title="Recently Added" books={initialData.newBooks} />
        <Section title="Trending" books={initialData.trendingBooks} />
      </div>
    </div>
  );
}

const Section = ({ title, books }: { title: string; books: any[] }) => {
  if (!books || books.length === 0) return null;
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-white mb-6 pl-2 border-l-4 border-indigo-500">
        {title}
      </h2>
      <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {books.map((book) => (
          <StaggerItem key={book.id}>
            <div className="h-full transform hover:-translate-y-2 transition-transform duration-300">
              <BookCard book={book} onAddToList={() => {}} />
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
};
