"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  AlertTriangle,
  AlertCircle,
  ArrowRight,
  X,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { AnnouncementDto } from "../../application/dto/AnnouncementDto";
import {
  selectEntryAnnouncement,
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
  const [activeAnnouncement, setActiveAnnouncement] = useState<AnnouncementDto | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Evaluate notice queue once on initial session mount
  useEffect(() => {
    setIsClient(true);
    const seenSet = new Set<string>();

    for (const item of announcements) {
      if (isAnnouncementSeen(item.id)) {
        seenSet.add(item.id);
      }
    }

    const selected = selectEntryAnnouncement(announcements, seenSet);
    setActiveAnnouncement(selected);
  }, [announcements]);

  if (!isClient || !activeAnnouncement) {
    return null;
  }

  const handleDismiss = () => {
    markAnnouncementSeen(activeAnnouncement.id);
    markBannerDismissed(activeAnnouncement.id);
    setActiveAnnouncement(null);
  };

  const isCritical =
    activeAnnouncement.type === "error" && !activeAnnouncement.isDismissible;

  // 1. Truly critical non-dismissible announcements use blocking Dialog
  if (isCritical) {
    return (
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent
          className="sm:max-w-md border-rose-500/40 bg-slate-950 text-slate-100 p-6 rounded-2xl shadow-2xl"
          aria-describedby="critical-announcement-desc"
        >
          <DialogHeader className="gap-2 text-left">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] font-mono">
                Critical Notice
              </span>
            </div>
            <DialogTitle className="text-xl font-serif font-bold text-white leading-tight">
              {activeAnnouncement.title}
            </DialogTitle>
            <DialogDescription
              id="critical-announcement-desc"
              className="text-sm text-slate-300 pt-1 leading-relaxed font-sans"
            >
              {activeAnnouncement.content}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-2 sm:justify-end">
            {activeAnnouncement.linkUrl && activeAnnouncement.linkText && (
              <Button asChild variant="default" onClick={handleDismiss} className="bg-rose-600 hover:bg-rose-500 text-white rounded-xl h-9 px-4 text-xs font-semibold">
                <Link href={activeAnnouncement.linkUrl} className="flex items-center gap-1.5 font-semibold">
                  <span>{activeAnnouncement.linkText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            )}
            <Button
              type="button"
              variant={activeAnnouncement.linkUrl ? "outline" : "default"}
              onClick={handleDismiss}
              className="rounded-xl border-slate-700 hover:bg-slate-800 text-slate-200 h-9 px-4 text-xs font-medium"
            >
              I Understand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // 2. Normal announcements: Non-blocking bottom-right anchored Card notice
  const getNoticeMeta = (type: string) => {
    switch (type) {
      case "warning":
        return {
          icon: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
          kicker: "Notice",
          kickerColor: "text-amber-400",
          borderAccent: "border-amber-500/30",
          ctaColor: "text-amber-400 hover:text-amber-300 hover:bg-amber-500/10",
        };
      case "error":
        return {
          icon: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
          kicker: "Important",
          kickerColor: "text-rose-400",
          borderAccent: "border-rose-500/30",
          ctaColor: "text-rose-400 hover:text-rose-300 hover:bg-rose-500/10",
        };
      case "success":
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
          kicker: "Update",
          kickerColor: "text-emerald-400",
          borderAccent: "border-emerald-500/30",
          ctaColor: "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10",
        };
      case "greetings":
      case "greeting":
      case "Greetings":
        return {
          icon: <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />,
          kicker: "New at TomeSphere",
          kickerColor: "text-indigo-400",
          borderAccent: "border-indigo-500/30",
          ctaColor: "text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10",
        };
      case "feature":
      default:
        return {
          icon: <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />,
          kicker: "New at TomeSphere",
          kickerColor: "text-indigo-400",
          borderAccent: "border-indigo-500/30",
          ctaColor: "text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10",
        };
    }
  };

  const meta = getNoticeMeta(activeAnnouncement.type);

  return (
    <aside
      aria-label="Product announcement"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-[calc(100vw-32px)] sm:w-[360px] max-w-[380px] animate-in fade-in slide-in-from-bottom-3 duration-200 pointer-events-auto"
    >
      <Card
        className={`bg-slate-950/95 dark:bg-slate-950/95 text-slate-100 border ${meta.borderAccent} shadow-2xl rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-200`}
      >
        <div className="p-4 sm:p-5 space-y-3">
          {/* Header Row: Label & Close */}
          <CardHeader className="p-0 flex flex-row items-center justify-between space-y-0 gap-2">
            <div className="flex items-center gap-1.5">
              {meta.icon}
              <span className={`text-[10px] font-mono font-semibold uppercase tracking-[0.18em] ${meta.kickerColor}`}>
                {meta.kicker}
              </span>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              aria-label={`Dismiss announcement: ${activeAnnouncement.title}`}
              className="h-7 w-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 -mr-1 -mt-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </CardHeader>

          {/* Content Body */}
          <CardContent className="p-0 space-y-1.5">
            <CardTitle className="text-base sm:text-[17px] font-serif font-bold text-white leading-snug tracking-tight">
              {activeAnnouncement.title}
            </CardTitle>
            <CardDescription className="text-xs sm:text-[13px] text-slate-300 leading-relaxed font-sans font-normal line-clamp-3">
              {activeAnnouncement.content}
            </CardDescription>
          </CardContent>

          {/* Action Footer */}
          <CardFooter className="p-0 pt-1 flex items-center justify-between gap-3">
            {activeAnnouncement.linkUrl && activeAnnouncement.linkText ? (
              <Button
                asChild
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className={`text-xs font-semibold p-0 h-auto ${meta.ctaColor} transition-colors group inline-flex items-center gap-1.5`}
              >
                <Link href={activeAnnouncement.linkUrl}>
                  <span>{activeAnnouncement.linkText}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="text-xs text-slate-400 hover:text-slate-200 p-0 h-auto font-medium"
              >
                Dismiss
              </Button>
            )}
          </CardFooter>
        </div>
      </Card>
    </aside>
  );
}

export default AnnouncementNotice;
