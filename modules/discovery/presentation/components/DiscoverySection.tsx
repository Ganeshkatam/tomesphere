"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";

interface DiscoverySectionProps {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  children: React.ReactNode;
}

export function DiscoverySection({
  title,
  description,
  actionHref,
  actionLabel = "See all",
  children,
}: DiscoverySectionProps) {
  return (
    <section className="w-full flex flex-col gap-5 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div className="space-y-1">
          <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {title}
          </h2>
          {description && (
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-3xl">
              {description}
            </p>
          )}
        </div>

        {actionHref && (
          <Link
            href={actionHref}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-bold transition-all group shrink-0 self-start sm:self-auto"
          >
            <span>{actionLabel}</span>
            <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>

      <div className="w-full min-w-0">{children}</div>
    </section>
  );
}
