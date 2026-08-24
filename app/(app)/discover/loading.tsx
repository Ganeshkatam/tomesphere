export default function DiscoverLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-8 animate-in fade-in duration-150">
      {/* 1. Breadcrumb Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-12 h-3.5 bg-slate-200 dark:bg-slate-800 rounded-md animate-pulse" />
          <div className="w-3 h-3 bg-slate-200 dark:bg-slate-800 rounded-xs animate-pulse" />
          <div className="w-16 h-3.5 bg-slate-200 dark:bg-slate-800 rounded-md animate-pulse" />
          <div className="w-3 h-3 bg-slate-200 dark:bg-slate-800 rounded-xs animate-pulse" />
          <div className="w-24 h-3.5 bg-slate-300 dark:bg-slate-700 rounded-md animate-pulse" />
        </div>
        <div className="hidden sm:block w-36 h-6 bg-slate-200 dark:bg-slate-800/80 rounded-full animate-pulse" />
      </div>

      {/* 2. Category Nav Tabs Skeleton */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200/80 dark:border-slate-800/80">
        {[
          "w-24",
          "w-28",
          "w-28",
          "w-32",
          "w-28",
          "w-24",
        ].map((width, idx) => (
          <div
            key={idx}
            className={`h-9 ${width} rounded-xl bg-slate-200/80 dark:bg-slate-800/80 shrink-0 animate-pulse`}
          />
        ))}
      </div>

      {/* 3. Hero Header Card Skeleton */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3 max-w-2xl w-full">
            <div className="w-44 h-5 bg-indigo-100 dark:bg-indigo-950/60 rounded-full animate-pulse" />
            <div className="w-3/4 sm:w-1/2 h-8 sm:h-9 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
            <div className="w-full sm:w-5/6 h-4 bg-slate-100 dark:bg-slate-800/70 rounded-md animate-pulse" />
          </div>
          <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
            <div className="w-32 h-7 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
            <div className="w-20 h-3 bg-slate-100 dark:bg-slate-800/60 rounded-md animate-pulse" />
          </div>
        </div>
      </div>

      {/* 4. Book Grid Skeleton (2 to 6 columns matching BookGrid) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 pt-2">
        {Array.from({ length: 12 }).map((_, idx) => (
          <div
            key={idx}
            className="w-full rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col animate-pulse"
          >
            {/* Aspect 2/3 cover skeleton */}
            <div className="relative aspect-[2/3] w-full bg-slate-200 dark:bg-slate-800" />

            {/* Bottom details skeleton */}
            <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between gap-3">
              <div className="space-y-1.5">
                <div className="w-full h-3.5 bg-slate-200 dark:bg-slate-700/80 rounded-md" />
                <div className="w-2/3 h-3 bg-slate-100 dark:bg-slate-800 rounded-md" />
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                <div className="w-12 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-sm" />
                <div className="w-8 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-sm" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
