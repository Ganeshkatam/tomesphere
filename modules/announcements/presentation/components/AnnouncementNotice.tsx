"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  AlertTriangle,
  AlertCircle,
  ArrowRight,
  X,
  BookOpen,
  Bookmark,
} from "lucide-react";
import { AnnouncementDto } from "../../application/dto/AnnouncementDto";
import {
  getAnnouncementPriority,
  isEntryEligible,
  markAnnouncementSeen,
  markBannerDismissed,
  isAnnouncementSeen,
} from "../utils/announcement-storage";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export interface AnnouncementNoticeProps {
  announcements: AnnouncementDto[];
}

export function AnnouncementNotice({ announcements }: AnnouncementNoticeProps) {
  const [activeNotices, setActiveNotices] = useState<AnnouncementDto[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Evaluate all unseen eligible notices on initial session mount
  useEffect(() => {
    setIsClient(true);
    if (!announcements || announcements.length === 0) {
      setActiveNotices([]);
      return;
    }

    const unseenEligible = announcements
      .filter((item) => isEntryEligible(item) && !isAnnouncementSeen(item.id))
      .sort((a, b) => getAnnouncementPriority(b) - getAnnouncementPriority(a));

    setActiveNotices(unseenEligible);
  }, [announcements]);

  if (!isClient || activeNotices.length === 0) {
    return null;
  }

  const handleDismiss = (id: string) => {
    markAnnouncementSeen(id);
    markBannerDismissed(id);
    setActiveNotices((prev) => prev.filter((item) => item.id !== id));
  };

  // Critical non-dismissible announcements use blocking Dialog
  const criticalAnnouncement = activeNotices.find(
    (item) => item.type === "error" && !item.isDismissible
  );

  if (criticalAnnouncement) {
    return (
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent
          className="sm:max-w-lg border-rose-500/40 bg-slate-950 text-slate-100 p-0 overflow-hidden rounded-3xl shadow-2xl"
          aria-describedby="critical-announcement-desc"
        >
          <div className="h-1 w-full bg-gradient-to-r from-rose-500 via-pink-400 to-rose-500" />
          <div className="p-7 sm:p-8 space-y-4">
            <DialogHeader className="gap-2.5 text-left">
              <div className="flex items-center gap-2 text-rose-400">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] font-mono">
                  Critical Notice
                </span>
              </div>
              <DialogTitle className="text-2xl font-serif font-bold text-white leading-tight">
                {criticalAnnouncement.title}
              </DialogTitle>
              <DialogDescription
                id="critical-announcement-desc"
                className="text-sm sm:text-base text-slate-300 pt-1 leading-relaxed font-sans"
              >
                {criticalAnnouncement.content}
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="pt-4 border-t border-slate-800 flex items-center gap-3 sm:justify-end">
              {criticalAnnouncement.linkUrl && criticalAnnouncement.linkText && (
                <Button
                  asChild
                  variant="default"
                  onClick={() => handleDismiss(criticalAnnouncement.id)}
                  className="bg-rose-600 hover:bg-rose-500 text-white rounded-xl h-10 px-5 text-sm font-semibold"
                >
                  <Link href={criticalAnnouncement.linkUrl} className="flex items-center gap-1.5 font-semibold">
                    <span>{criticalAnnouncement.linkText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              )}
              <Button
                type="button"
                variant={criticalAnnouncement.linkUrl ? "outline" : "default"}
                onClick={() => handleDismiss(criticalAnnouncement.id)}
                className="rounded-xl border-slate-700 hover:bg-slate-800 text-slate-200 h-10 px-5 text-sm font-medium"
              >
                I Understand
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Distinct theme metadata for each announcement type
  const getNoticeMeta = (type: string) => {
    switch (type) {
      case "warning":
        return {
          icon: <AlertTriangle className="w-4 h-4 text-amber-300" />,
          kicker: "System Notice",
          kickerColor: "text-amber-400",
          topLine: "bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500",
          borderAccent: "border-amber-500/35 hover:border-amber-500/65",
          iconPlate: "bg-amber-500/15 border-amber-500/30 text-amber-300",
          glowBg: "bg-[radial-gradient(ellipse_at_top_left,rgba(245,158,11,0.15),transparent_65%)]",
          ctaColor: "text-amber-400 hover:text-amber-300 hover:bg-amber-500/15",
        };
      case "error":
        return {
          icon: <AlertCircle className="w-4 h-4 text-rose-300" />,
          kicker: "Important Notice",
          kickerColor: "text-rose-400",
          topLine: "bg-gradient-to-r from-rose-500 via-pink-400 to-rose-500",
          borderAccent: "border-rose-500/35 hover:border-rose-500/65",
          iconPlate: "bg-rose-500/15 border-rose-500/30 text-rose-300",
          glowBg: "bg-[radial-gradient(ellipse_at_top_left,rgba(244,63,94,0.15),transparent_65%)]",
          ctaColor: "text-rose-400 hover:text-rose-300 hover:bg-rose-500/15",
        };
      case "info":
        return {
          icon: <Bookmark className="w-4 h-4 text-cyan-300" />,
          kicker: "Reader Dispatch",
          kickerColor: "text-cyan-400",
          topLine: "bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500",
          borderAccent: "border-cyan-500/35 hover:border-cyan-500/65",
          iconPlate: "bg-cyan-500/15 border-cyan-500/30 text-cyan-300",
          glowBg: "bg-[radial-gradient(ellipse_at_top_left,rgba(6,182,212,0.15),transparent_65%)]",
          ctaColor: "text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/15",
        };
      case "greetings":
      case "greeting":
      case "Greetings":
        return {
          icon: <BookOpen className="w-4 h-4 text-indigo-300" />,
          kicker: "New at TomeSphere",
          kickerColor: "text-indigo-400",
          topLine: "bg-gradient-to-r from-indigo-500 via-purple-400 to-indigo-500",
          borderAccent: "border-indigo-500/35 hover:border-indigo-500/65",
          iconPlate: "bg-indigo-500/15 border-indigo-500/30 text-indigo-300",
          glowBg: "bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.15),transparent_65%)]",
          ctaColor: "text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/15",
        };
      case "feature":
      default:
        return {
          icon: <Sparkles className="w-4 h-4 text-emerald-300" />,
          kicker: "New Feature",
          kickerColor: "text-emerald-400",
          topLine: "bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500",
          borderAccent: "border-emerald-500/35 hover:border-emerald-500/65",
          iconPlate: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
          glowBg: "bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.15),transparent_65%)]",
          ctaColor: "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/15",
        };
    }
  };

  const hasMultiple = activeNotices.length > 1;
  const displayedNotices = isHovered ? activeNotices : [activeNotices[0]];
  // Limit rendered background tabs to at most 3 physical layered edges
  const queueTabsCount = Math.min(activeNotices.length - 1, 3);

  return (
    <aside
      aria-label="Product announcements"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-[calc(100vw-32px)] sm:w-[440px] max-w-[460px] pointer-events-auto transition-all duration-300 pt-8"
    >
      {/* Stack Container */}
      <div className="relative space-y-4">
        {/* Prominent High-Contrast Stacked Deck Tabs above the top card */}
        {!isHovered && hasMultiple && (
          <div className="pointer-events-none transition-all duration-300">
            {Array.from({ length: queueTabsCount }).map((_, i) => {
              // i goes from 0 (closest tab) to queueTabsCount - 1 (farthest top tab)
              const tabRank = queueTabsCount - i; // 3, 2, 1 (rendered from back to front)
              const topOffset = tabRank * 11; // -33px, -22px, -11px
              const insetHorizontal = tabRank * 14; // 42px, 28px, 14px
              const borderTopAccent =
                tabRank === 1
                  ? "border-t-[2.5px] border-t-slate-400"
                  : tabRank === 2
                  ? "border-t-2 border-t-slate-500"
                  : "border-t-2 border-t-slate-600";
              const opacity = 1 - (tabRank - 1) * 0.12; // 0.76, 0.88, 1.0

              return (
                <div
                  key={`deck-tab-${tabRank}`}
                  className={`absolute h-10 bg-slate-900/98 dark:bg-slate-900/98 ${borderTopAccent} border-x border-slate-700/80 rounded-t-2xl shadow-xl transition-all duration-300`}
                  style={{
                    top: `-${topOffset}px`,
                    left: `${insetHorizontal}px`,
                    right: `${insetHorizontal}px`,
                    opacity,
                    zIndex: -tabRank,
                    boxShadow: "0 -6px 18px rgba(0, 0, 0, 0.65)",
                  }}
                />
              );
            })}
          </div>
        )}

        {displayedNotices.map((notice) => {
          const meta = getNoticeMeta(notice.type);
          return (
            <Card
              key={notice.id}
              className={`bg-slate-950/95 dark:bg-slate-950/95 text-slate-100 border ${meta.borderAccent} shadow-2xl rounded-3xl overflow-hidden backdrop-blur-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 relative group`}
            >
              {/* 1. Distinct Glowing Top Line */}
              <div className={`h-[3px] w-full ${meta.topLine}`} />

              {/* 2. Distinct Radial Glow Background */}
              <div className={`absolute inset-0 pointer-events-none ${meta.glowBg}`} />

              <div className="p-5 sm:p-6 space-y-3 relative z-10">
                {/* Header Row: Distinct Kicker Badge & Close Button */}
                <CardHeader className="p-0 flex flex-row items-center justify-between space-y-0 gap-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${meta.iconPlate} border shadow-xs`}
                    >
                      {meta.icon}
                    </div>
                    <span
                      className={`text-[11px] font-mono font-bold uppercase tracking-[0.2em] ${meta.kickerColor}`}
                    >
                      {meta.kicker}
                    </span>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDismiss(notice.id)}
                    aria-label={`Dismiss announcement: ${notice.title}`}
                    className="h-8 w-8 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 -mr-1 -mt-1 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </CardHeader>

                {/* Content Body */}
                <CardContent className="p-0 space-y-2 pt-1">
                  <CardTitle className="text-lg sm:text-[19px] font-serif font-bold text-white leading-snug tracking-tight">
                    {notice.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-300 leading-relaxed font-sans font-normal line-clamp-3">
                    {notice.content}
                  </CardDescription>
                </CardContent>

                {/* Distinct Action Footer */}
                <CardFooter className="p-0 pt-2 flex items-center justify-between gap-3">
                  {notice.linkUrl && notice.linkText ? (
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDismiss(notice.id)}
                      className={`text-sm font-semibold px-3 py-1.5 rounded-xl ${meta.ctaColor} transition-colors group/cta inline-flex items-center gap-1.5`}
                    >
                      <Link href={notice.linkUrl}>
                        <span>{notice.linkText}</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/cta:translate-x-1" />
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDismiss(notice.id)}
                      className="text-xs text-slate-400 hover:text-slate-200 p-0 h-auto font-medium"
                    >
                      Dismiss
                    </Button>
                  )}
                </CardFooter>
              </div>
            </Card>
          );
        })}
      </div>
    </aside>
  );
}

export default AnnouncementNotice;
