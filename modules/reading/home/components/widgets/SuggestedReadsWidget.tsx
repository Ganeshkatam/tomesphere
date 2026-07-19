import { SuggestedReadsDto } from "@/modules/discovery/application/queries/GetSuggestedReadsQuery/dto";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ChevronRight, BookOpen } from "lucide-react";

interface SuggestedReadsWidgetProps {
  result: SuggestedReadsDto | null;
}

export function SuggestedReadsWidget({ result }: SuggestedReadsWidgetProps) {
  if (!result) {
    return (
      <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
        <p className="font-semibold">Unable to load suggestions.</p>
        <p className="text-sm opacity-80">{"Error"}</p>
      </div>
    );
  }

  const suggestions = result?.suggestions || [];

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
            <Sparkles size={20} />
          </div>
          <h2 className="text-xl font-display font-bold text-[var(--text-primary)]">Suggested Reads</h2>
        </div>
      </div>

      {suggestions.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 rounded-3xl bg-[var(--surface-raised)] border border-[var(--border-default)] text-center">
          <p className="text-[var(--text-secondary)] mb-4">Start reading a few books and we'll suggest similar titles.</p>
          <Link
            href="/discover"
            className="px-6 py-2.5 rounded-full border border-[var(--border-default)] hover:border-[var(--border-hover)] text-sm font-medium transition-colors"
          >
            Browse Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {suggestions.map((book) => (
            <Link
              key={book.bookId}
              href={`/discover/books/${book.bookId}`}
              className="flex flex-col group"
            >
              <div className="w-full aspect-[2/3] rounded-xl overflow-hidden relative bg-slate-800 mb-3 border border-[var(--border-default)] group-hover:border-purple-500/50 transition-colors">
                {book.coverUrl ? (
                  <Image src={book.coverUrl} alt={book.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">
                    <BookOpen size={32} />
                  </div>
                )}
              </div>
              <h4 className="font-semibold text-sm text-[var(--text-primary)] truncate group-hover:text-purple-400 transition-colors">
                {book.title}
              </h4>
              <p className="text-xs text-[var(--text-secondary)] truncate mb-1">{book.author}</p>
              <p className="text-[10px] text-purple-400/80 font-medium line-clamp-1">{book.reason}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
