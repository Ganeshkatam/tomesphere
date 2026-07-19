import Link from "next/link";
import { BookOpen, Compass, Bookmark, Target } from "lucide-react";

export function QuickActionsWidget() {
  const actions = [
    { label: "Continue Reading", href: "/home#continue", icon: BookOpen, color: "text-indigo-400", bg: "bg-indigo-500/10" },
    { label: "Discover Books", href: "/discover", icon: Compass, color: "text-purple-400", bg: "bg-purple-500/10" },
    { label: "My Library", href: "/library", icon: Bookmark, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Reading Goals", href: "/me/profile#goals", icon: Target, color: "text-orange-400", bg: "bg-orange-500/10" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border-default)] hover:border-[var(--border-hover)] transition-all group"
          >
            <div className={`p-2 rounded-xl ${action.bg} ${action.color}`}>
              <Icon size={20} />
            </div>
            <span className="font-medium text-sm text-[var(--text-primary)] group-hover:text-indigo-400 transition-colors">
              {action.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
