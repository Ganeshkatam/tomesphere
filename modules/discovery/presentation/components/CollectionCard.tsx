"use client";

import Link from "next/link";
import { CollectionSummaryDto } from "../../application/dto/CollectionSummaryDto";
import { Layers, ArrowRight } from "lucide-react";

interface CollectionCardProps {
  collection: CollectionSummaryDto;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <Link
      href={`/search?q=${encodeURIComponent(collection.title)}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-3xl"
    >
      <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700/80">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Layers size={16} />
          </div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Curated Collection
          </span>
        </div>

        <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white mb-2 transition-colors duration-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
          {collection.title}
        </h3>

        {collection.description && (
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-6 font-medium leading-relaxed">
            {collection.description}
          </p>
        )}

        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
          <span>{collection.bookCount || 0} Volumes included</span>
          <span className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
            <span>Explore</span>
            <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}
