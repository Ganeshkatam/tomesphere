"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AccountTabs() {
  const pathname = usePathname();

  const tabs = [
    { id: "profile", label: "Profile", href: "/me/account/profile" },
    { id: "preferences", label: "Preferences", href: "/me/account/preferences" },
    { id: "security", label: "Security", href: "/me/account/security" },
  ];

  return (
    <div className="border-b border-slate-200 dark:border-slate-800 mb-8">
      <nav className="flex gap-8">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`pb-4 text-sm font-bold border-b-2 transition-colors ${
                isActive
                  ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                  : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
