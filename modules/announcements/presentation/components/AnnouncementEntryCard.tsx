"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, AlertTriangle, AlertCircle, ArrowRight, X } from "lucide-react";
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

export interface AnnouncementEntryCardProps {
  announcements: AnnouncementDto[];
}

export function AnnouncementEntryCard({ announcements }: AnnouncementEntryCardProps) {
  const [activeAnnouncement, setActiveAnnouncement] = useState<AnnouncementDto | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Evaluate entry queue once on initial workspace mount
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

  // 1. Critical non-dismissible announcements use Dialog directly without Card nesting
  if (isCritical) {
    return (
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent
          className="sm:max-w-md border-rose-500/40 bg-[var(--surface-default)]"
          aria-describedby="critical-announcement-desc"
        >
          <DialogHeader className="gap-2">
            <div className="flex items-center gap-2 text-rose-500">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                Critical Notice
              </span>
            </div>
            <DialogTitle className="text-xl font-bold text-[var(--text-primary)]">
              {activeAnnouncement.title}
            </DialogTitle>
            <DialogDescription
              id="critical-announcement-desc"
              className="text-sm text-[var(--text-secondary)] pt-2 leading-relaxed"
            >
              {activeAnnouncement.content}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 gap-2 sm:justify-end">
            {activeAnnouncement.linkUrl && activeAnnouncement.linkText && (
              <Button asChild variant="default" onClick={handleDismiss}>
                <Link href={activeAnnouncement.linkUrl} className="flex items-center gap-1.5">
                  <span>{activeAnnouncement.linkText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            )}
            <Button
              type="button"
              variant={activeAnnouncement.linkUrl ? "outline" : "default"}
              onClick={handleDismiss}
            >
              I Understand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // 2. Feature, Warning, and dismissible Error announcements use a centered floating Card
  const getBadgeMeta = (type: string) => {
    switch (type) {
      case "warning":
        return {
          icon: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />,
          label: "Notice",
          badgeStyle: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
          cardBorder: "border-amber-500/30",
        };
      case "error":
        return {
          icon: <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />,
          label: "Important",
          badgeStyle: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
          cardBorder: "border-rose-500/30",
        };
      case "feature":
      default:
        return {
          icon: <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />,
          label: "New Feature",
          badgeStyle: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
          cardBorder: "border-emerald-500/30",
        };
    }
  };

  const meta = getBadgeMeta(activeAnnouncement.type);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="entry-announcement-title"
    >
      <Card
        className={`w-full max-w-md bg-[var(--surface-default)] shadow-2xl border ${meta.cardBorder} transition-all`}
      >
        <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0 gap-3">
          <div className="flex items-center gap-2">
            {meta.icon}
            <span
              className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${meta.badgeStyle}`}
            >
              {meta.label}
            </span>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            aria-label={`Dismiss announcement: ${activeAnnouncement.title}`}
            className="h-8 w-8 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] -mt-1 -mr-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-2 pb-4">
          <CardTitle
            id="entry-announcement-title"
            className="text-lg font-bold text-[var(--text-primary)]"
          >
            {activeAnnouncement.title}
          </CardTitle>
          <CardDescription className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {activeAnnouncement.content}
          </CardDescription>
        </CardContent>

        <CardFooter className="flex items-center justify-between gap-3 pt-2 border-t border-[var(--border-subtle)]">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
          >
            Don&apos;t show again
          </Button>

          <div className="flex items-center gap-2">
            {activeAnnouncement.linkUrl && activeAnnouncement.linkText ? (
              <Button asChild size="sm" variant="default" onClick={handleDismiss}>
                <Link
                  href={activeAnnouncement.linkUrl}
                  className="flex items-center gap-1.5 text-xs font-semibold"
                >
                  <span>{activeAnnouncement.linkText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            ) : (
              <Button type="button" size="sm" variant="default" onClick={handleDismiss}>
                Got it
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default AnnouncementEntryCard;
