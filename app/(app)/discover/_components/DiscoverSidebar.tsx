"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Flame, Sparkles, Clock, Users, BookOpen } from "lucide-react";

const navItems = [
  { name: "Overview", href: "/discover", icon: Compass },
  { name: "Featured", href: "/discover/featured", icon: Sparkles },
  { name: "Trending", href: "/discover/trending", icon: Flame },
  { name: "New Arrivals", href: "/discover/new", icon: Clock },
  { name: "Collections", href: "/discover/collections", icon: BookOpen },
  { name: "Authors", href: "/discover/authors", icon: Users },
];

export function DiscoverSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 shrink-0 border-r border-[var(--border-default)] bg-[var(--surface-raised)]/50 p-6 md:sticky md:top-[76px] md:self-start md:h-[calc(100vh-76px)] overflow-y-auto">
      <h1 className="text-xl font-display font-bold text-[var(--text-primary)] mb-6 px-2">Discover</h1>
      <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
        {navItems.map((item) => {
          const Icon = item.icon;
          // For overview, match exactly. For others, allow nested routes.
          const isActive = item.href === "/discover" 
            ? pathname === "/discover" 
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors whitespace-nowrap ${
                isActive 
                  ? "bg-indigo-500/10 text-indigo-400 font-semibold" 
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface-overlay)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Icon size={18} />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
