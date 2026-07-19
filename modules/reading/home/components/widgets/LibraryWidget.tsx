import { LibrarySnapshotDto } from "@/modules/reading/library/application/queries/GetLibrarySnapshotQuery/dto";
import Link from "next/link";
import Image from "next/image";
import { Bookmark, ChevronRight } from "lucide-react";

interface LibraryWidgetProps {
  result: LibrarySnapshotDto | null;
}

export function LibraryWidget({ result }: LibraryWidgetProps) {
  if (!result) {
    return (
      <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
        <p className="font-semibold">Unable to load library snapshot.</p>
        <p className="text-sm opacity-80">{"Error"}</p>
      </div>
    );
  }

  const data = result;
  const totalBooks = data ? data.wantToReadCount + data.currentlyReadingCount + data.finishedCount : 0;

  return (
    <div className="flex flex-col p-6 rounded-3xl bg-[var(--surface-raised)] border border-[var(--border-default)] h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Bookmark size={20} />
          </div>
          <h3 className="font-semibold text-[var(--text-primary)]">Library Snapshot</h3>
        </div>
        <Link href="/library" className="text-sm font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
          Open <ChevronRight size={16} />
        </Link>
      </div>

      {totalBooks === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
          <p className="text-sm text-[var(--text-secondary)] mb-4">Your library is empty.</p>
          <Link
            href="/discover"
            className="px-4 py-2 rounded-full border border-[var(--border-default)] hover:border-[var(--border-hover)] text-sm font-medium transition-colors"
          >
            Explore Books
          </Link>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex -space-x-4 mb-6 px-4 py-2">
            {data?.recentCovers.map((cover, i) => (
              <div 
                key={i} 
                className="w-12 h-16 sm:w-16 sm:h-24 rounded-lg overflow-hidden relative shadow-xl border-2 border-[var(--surface-raised)] transform transition-transform hover:-translate-y-2 hover:z-10"
                style={{ zIndex: 4 - i }}
              >
                <Image src={cover} alt="Cover" fill className="object-cover" />
              </div>
            ))}
            {(!data?.recentCovers || data.recentCovers.length === 0) && (
               <div className="w-16 h-24 rounded-lg bg-slate-800 border-2 border-[var(--surface-raised)] flex items-center justify-center text-slate-600">
                 <Bookmark size={24} />
               </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-xl bg-[var(--surface-base)] border border-[var(--border-default)]">
              <p className="text-xl font-display font-bold text-[var(--text-primary)]">{data?.wantToReadCount || 0}</p>
              <p className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-wider">Want</p>
            </div>
            <div className="p-2 rounded-xl bg-[var(--surface-base)] border border-[var(--border-default)]">
              <p className="text-xl font-display font-bold text-[var(--text-primary)]">{data?.currentlyReadingCount || 0}</p>
              <p className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-wider">Reading</p>
            </div>
            <div className="p-2 rounded-xl bg-[var(--surface-base)] border border-[var(--border-default)]">
              <p className="text-xl font-display font-bold text-[var(--text-primary)]">{data?.finishedCount || 0}</p>
              <p className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-wider">Finished</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
