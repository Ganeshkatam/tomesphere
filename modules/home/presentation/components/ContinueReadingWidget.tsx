import { ContinueReadingDto } from "@/modules/library/application/queries/GetContinueReadingQuery/dto";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import Image from "next/image";

interface ContinueReadingWidgetProps {
  result: ContinueReadingDto | null;
}

export function ContinueReadingWidget({ result }: ContinueReadingWidgetProps) {
  if (!result) {
    return (
      <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
        <p className="font-semibold">Unable to load continue reading.</p>
        <p className="text-sm opacity-80">{"Error"}</p>
      </div>
    );
  }

  const data = result;

  return (
    <section id="continue" className="mb-10">
      <h2 className="text-xl font-display font-bold text-[var(--text-primary)] mb-4">
        Continue Reading
      </h2>

      {!data ? (
        <div className="flex flex-col items-center justify-center p-8 rounded-3xl bg-[var(--surface-raised)] border border-[var(--border-default)] text-center">
          <div className="w-16 h-16 rounded-full bg-[var(--surface-base)] flex items-center justify-center mb-4 text-slate-500">
            <BookOpen size={32} />
          </div>
          <h3 className="font-semibold text-[var(--text-primary)] mb-1">
            You don't have any books in progress.
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
            Find your next great adventure in our catalog and start reading today.
          </p>
          <Link
            href="/discover"
            className="px-6 py-2.5 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-colors"
          >
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 relative overflow-hidden group">
          {/* Decorative background element */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700 pointer-events-none" />

          <div className="w-24 h-36 sm:w-32 sm:h-48 shrink-0 rounded-lg overflow-hidden relative shadow-2xl">
            {data.coverUrl ? (
              <Image src={data.coverUrl} alt={data.title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-600">
                <BookOpen size={32} />
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center flex-1 relative z-10">
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2 leading-tight">
              {data.title}
            </h3>
            <p className="text-indigo-200 mb-6 font-medium">{data.author}</p>

            <div className="mb-6">
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-slate-300">Progress</span>
                <span className="text-indigo-400">{data.progressPercentage}%</span>
              </div>
              <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${data.progressPercentage}%` }}
                />
              </div>
            </div>

            <Link
              href={`/read/${data.bookId}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-indigo-950 font-bold hover:bg-indigo-50 transition-colors w-fit shadow-lg shadow-black/20"
            >
              Resume Reading
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
