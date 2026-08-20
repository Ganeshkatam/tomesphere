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
    <div className="min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Left Sidebar Panel */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="p-5 rounded-2xl bg-[var(--surface-default)] border border-[var(--border-default)] space-y-1 sticky top-24">
              {ACCOUNT_NAVIGATION.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold border border-transparent transition-all duration-200 group ${
                      active
                        ? "bg-indigo-600/10 text-indigo-400 border-indigo-500/20"
                        : "text-slate-400 hover:text-slate-200 hover:bg-[var(--surface-overlay)] hover:border-[var(--border-subtle)]"
                    }`}
                  >
                    <Icon
                      size={18}
                      className={
                        active
                          ? "text-indigo-400"
                          : "text-slate-400 group-hover:text-slate-200"
                      }
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </aside>

          {/* Mobile Navigation Horizontal Scroll View (Lg viewport hide) */}
          <div className="block lg:hidden overflow-x-auto pb-3 mb-2">
            <div className="flex gap-2 min-w-max">
              {ACCOUNT_NAVIGATION.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                      active
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-[var(--surface-default)] text-slate-400 border-[var(--border-default)] hover:bg-[var(--surface-overlay)]"
                    }`}
                  >
                    <Icon size={14} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Main Content Container */}
          <main className="lg:col-span-3">
            <div className="animate-in fade-in duration-300 bg-[var(--surface-default)] border border-[var(--border-default)] rounded-3xl overflow-hidden p-6 sm:p-8 shadow-[var(--shadow-sm)]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
