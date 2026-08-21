"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ACCOUNT_NAVIGATION } from "../navigation";

export function AccountLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <div className="w-full h-[calc(100dvh-5rem)] sm:h-[calc(100dvh-5.5rem)] lg:h-[calc(100dvh-6rem)] overflow-hidden flex flex-col">
      <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 h-full flex flex-col min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 h-full flex-1 min-h-0">
          {/* Desktop Left Sidebar Panel */}
          <aside className="hidden lg:block lg:col-span-1 h-full overflow-y-auto pr-1 no-scrollbar flex-shrink-0">
            <div className="p-4 rounded-2xl bg-[var(--surface-default)] border border-[var(--border-default)] space-y-1 shadow-[var(--shadow-sm)]">
              {ACCOUNT_NAVIGATION.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 group ${
                      active
                        ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20"
                        : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:border-slate-200 dark:hover:border-slate-700"
                    }`}
                  >
                    <Icon
                      size={18}
                      className={
                        active
                          ? "text-indigo-700 dark:text-indigo-400"
                          : "text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-white"
                      }
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </aside>

          {/* Mobile Navigation Horizontal Scroll View (Lg viewport hide) */}
          <div className="block lg:hidden overflow-x-auto pb-2 mb-1 flex-shrink-0">
            <div className="flex gap-2 min-w-max">
              {ACCOUNT_NAVIGATION.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                      active
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Icon size={14} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Main Content Container - Fixed Card Shell with Internal Overflow */}
          <main className="lg:col-span-3 xl:col-span-4 h-full flex flex-col min-h-0">
            <div className="animate-in fade-in duration-300 bg-[var(--surface-default)] border border-[var(--border-default)] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-[var(--shadow-sm)] flex-1 flex flex-col min-h-0 overflow-hidden">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
