import { CurrentReadingDto } from "@/modules/library/application/queries/GetCurrentReadingQuery/dto";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, ChevronRight } from "lucide-react";

interface CurrentReadingWidgetProps {
  result: CurrentReadingDto | null;
  excludeBookId?: string; // To exclude the book shown in ContinueReading
}

export function CurrentReadingWidget({ result, excludeBookId }: CurrentReadingWidgetProps) {
  if (!result) {
    return (
      <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
        <p className="font-semibold">Unable to load currently reading.</p>
        <p className="text-sm opacity-80">{"Error"}</p>
      </div>
    );
  }

  const allBooks = result?.books || [];
  const books = allBooks.filter((b) => b.bookId !== excludeBookId).slice(0, 4);

  return (
    <div className="flex flex-col p-6 rounded-3xl bg-[var(--surface-raised)] border border-[var(--border-default)] h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
            <BookOpen size={20} />
          </div>
          <h3 className="font-semibold text-[var(--text-primary)]">Currently Reading</h3>
        </div>
        <Link href="/library" className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1">
          View All <ChevronRight size={16} />
        </Link>
      </div>

      {books.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
          <p className="text-sm text-[var(--text-secondary)] mb-4">No other books in progress.</p>
          <Link
            href="/discover"
            className="px-4 py-2 rounded-full border border-[var(--border-default)] hover:border-[var(--border-hover)] text-sm font-medium transition-colors"
          >
            Find a Book
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {books.map((book) => (
            <Link
              key={book.bookId}
              href={`/read/${book.bookId}`}
              className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors group border border-transparent hover:border-white/10"
            >
              <div className="w-12 h-16 shrink-0 rounded-md overflow-hidden relative bg-slate-800">
                {book.coverUrl && (
                  <Image src={book.coverUrl} alt={book.title} fill className="object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-[var(--text-primary)] truncate group-hover:text-blue-400 transition-colors">
                  {book.title}
                </h4>
                <p className="text-xs text-[var(--text-secondary)] truncate mb-2">{book.author}</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${book.progressPercentage}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 w-6 text-right">
                    {book.progressPercentage}%
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
