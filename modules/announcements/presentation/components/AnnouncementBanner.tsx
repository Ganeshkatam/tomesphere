"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Info, AlertTriangle, Sparkles, AlertCircle, X, ArrowRight, Megaphone } from "lucide-react";
import { AnnouncementDto } from "../../application/dto/AnnouncementDto";

export interface AnnouncementBannerProps {
  announcements: AnnouncementDto[];
}

const DISMISSED_STORAGE_KEY_PREFIX = "tomesphere_dismissed_announcement_";

function getThemeStyles(type: string) {
  switch (type) {
    case "warning":
      return {
        wrapper: "bg-amber-500/10 dark:bg-amber-950/40 border-amber-500/30 text-amber-900 dark:text-amber-200",
        badge: "bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/30",
        icon: <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />,
        cta: "bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-slate-950",
      };
    case "success":
    case "feature":
      return {
        wrapper: "bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-500/30 text-emerald-900 dark:text-emerald-200",
        badge: "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/30",
        icon: <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />,
        cta: "bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950",
      };
    case "error":
    case "maintenance":
      return {
        wrapper: "bg-rose-500/10 dark:bg-rose-950/40 border-rose-500/30 text-rose-900 dark:text-rose-200",
        badge: "bg-rose-500/20 text-rose-800 dark:text-rose-300 border-rose-500/30",
        icon: <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />,
        cta: "bg-rose-600 hover:bg-rose-700 text-white dark:bg-rose-500 dark:hover:bg-rose-400 dark:text-slate-950",
      };
    case "info":
    default:
      return {
        wrapper: "bg-indigo-500/10 dark:bg-indigo-950/40 border-indigo-500/30 text-indigo-900 dark:text-indigo-200",
        badge: "bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 border-indigo-500/30",
        icon: <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />,
        cta: "bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:text-white",
      };
  }
}

export function AnnouncementBanner({ announcements }: AnnouncementBannerProps) {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(() => new Set());
  const [isClient, setIsClient] = useState(false);

  // Load device-local dismissal state from localStorage on client mount
  useEffect(() => {
    setIsClient(true);
    const dismissed = new Set<string>();

    if (typeof window !== "undefined" && window.localStorage) {
      for (const announcement of announcements) {
        try {
          const key = `${DISMISSED_STORAGE_KEY_PREFIX}${announcement.id}`;
          if (window.localStorage.getItem(key) === "true") {
            dismissed.add(announcement.id);
          }
        } catch {
          // Ignore localStorage access errors in restricted sandbox
        }
      }
    }

    setDismissedIds(dismissed);
  }, [announcements]);

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });

    if (typeof window !== "undefined" && window.localStorage) {
      try {
        window.localStorage.setItem(`${DISMISSED_STORAGE_KEY_PREFIX}${id}`, "true");
      } catch {
        // Fallback gracefully
      }
    }
  };

  // Filter out dismissed announcements
  const visibleAnnouncements = announcements.filter(
    (a) => !dismissedIds.has(a.id)
  );

  if (!isClient || visibleAnnouncements.length === 0) {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-2 z-40" role="region" aria-label="System Announcements">
      {visibleAnnouncements.map((announcement) => {
        const theme = getThemeStyles(announcement.type);

        return (
          <aside
            key={announcement.id}
            className={`w-full border-b backdrop-blur-sm transition-all duration-300 ${theme.wrapper}`}
          >
            <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {theme.icon}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${theme.badge}`}>
                    {announcement.type}
                  </span>
                  <span className="font-semibold">{announcement.title}</span>
                  <span className="opacity-90 hidden sm:inline">&mdash;</span>
                  <span className="opacity-90 line-clamp-1 sm:line-clamp-none">{announcement.content}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {announcement.linkUrl && announcement.linkText && (
                  <Link
                    href={announcement.linkUrl}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold shadow-sm transition-all duration-150 active:scale-95 ${theme.cta}`}
                  >
                    <span>{announcement.linkText}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                )}

                {announcement.isDismissible && (
                  <button
                    type="button"
                    onClick={() => handleDismiss(announcement.id)}
                    aria-label={`Dismiss announcement: ${announcement.title}`}
                    className="p-1 rounded-md opacity-70 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-current"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </aside>
        );
      })}
    </div>
  );
}

export default AnnouncementBanner;
