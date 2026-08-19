import Link from "next/link";
import { BookOpen, Compass, Bookmark, Target, ChevronRight } from "lucide-react";

export function QuickActionsWidget() {
  const actions = [
    {
      label: "Continue Reading",
      description: "Jump back into your active book",
      href: "/home#continue",
      icon: BookOpen,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200/60 dark:border-indigo-800/60",
    },
    {
      label: "Discover Books",
      description: "Explore curated archival collections",
      href: "/discover",
      icon: Compass,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-950/60 border-purple-200/60 dark:border-purple-800/60",
    },
    {
      label: "My Library",
      description: "View saved and finished titles",
      href: "/library",
      icon: Bookmark,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/60 dark:border-emerald-800/60",
    },
    {
      label: "Reading Goals",
      description: "Track your streaks and milestones",
      href: "/account",
      icon: Target,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/60 border-amber-200/60 dark:border-amber-800/60",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.label}
            href={action.href}
            className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/80 shadow-xs hover:shadow-md transition-all duration-200 group cursor-pointer"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center border flex-shrink-0 ${action.bg} ${action.color}`}
              >
                <Icon size={20} />
              </div>
              <div className="min-w-0">
                <span className="block font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                  {action.label}
                </span>
                <span className="block text-xs text-slate-500 dark:text-slate-400 truncate">
                  {action.description}
                </span>
              </div>
            </div>
            <ChevronRight
              size={16}
              className="text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2"
            />
          </Link>
        );
      })}
    </div>
  );
}
