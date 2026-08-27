"use client";

import React, { useState } from "react";
import {
  FileText,
  Copy,
  Check,
  Printer,
  Code,
  Eye,
  Calendar,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { AnnouncementDto } from "../../application/dto/AnnouncementDto";

interface MaintenanceDocumentViewerProps {
  notice: AnnouncementDto;
}

export function MaintenanceDocumentViewer({
  notice,
}: MaintenanceDocumentViewerProps) {
  const [viewMode, setViewMode] = useState<"formatted" | "raw">("formatted");
  const [copied, setCopied] = useState(false);

  const title = notice.title;
  const content = notice.content;
  const dateFormatted = formatDate(notice.startsAt);
  const expirationFormatted = notice.endsAt ? formatDate(notice.endsAt) : null;
  const noticeType = notice.type.toUpperCase();

  const fileName = `${notice.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`;

  const rawMarkdown = `# ${title}

- **Type:** ${noticeType}
- **Posted:** ${dateFormatted}${expirationFormatted ? `\n- **Valid Until:** ${expirationFormatted}` : ""}

---

${content}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(rawMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-md overflow-hidden font-sans">
      {/* ── GitHub-style Control Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
        {/* File Identity */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <FileText className="w-4 h-4" />
          </div>
          <span className="font-mono font-bold text-slate-900 dark:text-slate-100 truncate">
            {fileName}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
            {noticeType}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-200/80 dark:bg-slate-800/80 rounded-lg p-0.5 border border-slate-300 dark:border-slate-700">
            <button
              onClick={() => setViewMode("formatted")}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                viewMode === "formatted"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
            <button
              onClick={() => setViewMode("raw")}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                viewMode === "raw"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Raw</span>
            </button>
          </div>

          {/* Copy Report */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2.5 text-xs font-semibold rounded-lg border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mr-1" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </Button>

          {/* Print */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handlePrint}
            aria-label="Print Notice"
            className="h-7 w-7 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg"
          >
            <Printer className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* ── Document Body ── */}
      {viewMode === "raw" ? (
        /* Raw Markdown */
        <div className="p-6 sm:p-8 bg-slate-950 text-slate-100 font-mono text-xs leading-relaxed overflow-x-auto selection:bg-indigo-500 selection:text-white">
          <pre className="whitespace-pre-wrap">{rawMarkdown}</pre>
        </div>
      ) : (
        /* Formatted Document View */
        <div className="p-6 sm:p-10 space-y-6 text-slate-800 dark:text-slate-200">
          {/* Header */}
          <div className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                <span suppressHydrationWarning>Posted: {dateFormatted}</span>
              </div>
              {expirationFormatted && (
                <span suppressHydrationWarning>Valid until: {expirationFormatted}</span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
              {title}
            </h1>
          </div>

          {/* Real Content */}
          <div className="p-4 sm:p-5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 dark:border-amber-400 text-slate-800 dark:text-slate-200 text-sm leading-relaxed flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-slate-800 dark:text-slate-200 font-normal whitespace-pre-wrap">
                {content}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MaintenanceDocumentViewer;
