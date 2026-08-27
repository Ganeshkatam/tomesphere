"use client";

import React, { useState } from "react";
import {
  FileText,
  Download,
  Copy,
  Check,
  Printer,
  Code,
  Eye,
  Calendar,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Database,
  Terminal,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface MaintenanceDocumentViewerProps {
  notice?: {
    id: string;
    title: string;
    content: string;
    startsAt: string;
    type: string;
  } | null;
}

export function MaintenanceDocumentViewer({
  notice,
}: MaintenanceDocumentViewerProps) {
  const [viewMode, setViewMode] = useState<"formatted" | "raw">("formatted");
  const [copied, setCopied] = useState(false);

  const title = notice?.title || "Scheduled System Maintenance & Optimization";
  const content =
    notice?.content ||
    "TomeSphere catalog indexing and sync services will undergo scheduled database optimization on Sunday from 02:00 to 04:00 UTC. Reader sessions and offline margin notes will remain fully uninterrupted.";
  const dateFormatted = notice?.startsAt
    ? formatDate(notice.startsAt)
    : "August 28, 2026";

  const rawMarkdown = `# ${title}

> **Document ID:** TS-DOC-MAINT-2026-08A  
> **Status:** ACTIVE ADVISORY  
> **Effective Date:** ${dateFormatted}  
> **Subsystems:** Catalog Indexing, Full-Text Search Partitions  

---

## 1. Executive Overview

${content}

---

## 2. Service Impact & Operational Matrix

| Subsystem | Impact Level | Status | Notes |
| :--- | :--- | :--- | :--- |
| **Reader Shell Engine** | None (0%) | OPERATIONAL | Standalone client viewport executes entirely client-side. |
| **Margin Notes & Quotes** | None (0%) | PERSISTED | Offline browser cache active; sync reconciles on completion. |
| **Personal Shelves** | None (0%) | PERSISTED | Shelf reads and queue ordering remain local-first. |
| **Search & Indexing RPC** | Minor Intermittent | MAINTENANCE | Transient latency may occur during partition re-indexing. |

---

## 3. Data Integrity & Reader Safeguards

- **Zero Data Loss Guarantee**: All reading progress, scroll offsets, highlights, and annotations are preserved locally.
- **Continuous Reading**: Open book sessions require no live database round-trips once initiated.
- **Automatic Re-sync**: Background workers automatically reconcile pending ledger updates upon maintenance resolution.

---

## 4. Verification & Operational Sign-off

\`\`\`json
{
  "system": "tomesphere-core",
  "environment": "production",
  "maintenance_window": "02:00-04:00 UTC",
  "reader_availability": "100%",
  "verified_by": "TomeSphere Operations Team"
}
\`\`\`
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(rawMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-xl overflow-hidden font-sans">
      {/* ── 1. GitHub-style Document Top Control Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
        {/* File Identity */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <FileText className="w-4 h-4" />
          </div>
          <span className="font-mono font-bold text-slate-900 dark:text-slate-100 truncate">
            MAINTENANCE_ADVISORY.pdf
          </span>
          <span className="text-slate-400 dark:text-slate-600 hidden sm:inline">&bull;</span>
          <span className="font-mono text-[11px] text-slate-500 hidden sm:inline">
            24.8 KB
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
            OFFICIAL
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* View Mode Toggle (Formatted / Raw) */}
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

          {/* Download PDF File */}
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-7 px-2.5 text-xs font-semibold rounded-lg border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <a href="/mock-document.pdf" download="MAINTENANCE_ADVISORY.pdf">
              <Download className="w-3.5 h-3.5 sm:mr-1" />
              <span className="hidden sm:inline">Download PDF</span>
            </a>
          </Button>

          {/* Print */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handlePrint}
            aria-label="Print Document"
            className="h-7 w-7 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg"
          >
            <Printer className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* ── 2. Document Content Rendering ── */}
      {viewMode === "raw" ? (
        /* Raw Markdown View */
        <div className="p-6 sm:p-8 bg-slate-950 text-slate-100 font-mono text-xs leading-relaxed overflow-x-auto selection:bg-indigo-500 selection:text-white">
          <pre className="whitespace-pre-wrap">{rawMarkdown}</pre>
        </div>
      ) : (
        /* Formatted GitHub-style Document View */
        <div className="p-6 sm:p-10 lg:p-12 space-y-8 text-slate-800 dark:text-slate-200">
          {/* Document Header */}
          <div className="space-y-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest">
                TS-DOC-MAINT-2026-08A
              </span>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                <span suppressHydrationWarning>{dateFormatted}</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
              {title}
            </h1>
          </div>

          {/* GitHub-style Warning Callout Banner */}
          <div className="p-4 sm:p-5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border-l-4 border-amber-500 dark:border-amber-400 text-slate-800 dark:text-amber-100 text-sm leading-relaxed flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-900 dark:text-amber-200 mb-1">
                Notice & Operational Summary
              </p>
              <p className="text-slate-700 dark:text-slate-300 font-normal">
                {content}
              </p>
            </div>
          </div>

          {/* Section 1: Service Impact & Status Matrix Table */}
          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-indigo-600 dark:text-indigo-400">#</span>
              <span>1. Service Impact & Operational Matrix</span>
            </h2>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-bold">
                  <tr>
                    <th className="py-3 px-4">Subsystem</th>
                    <th className="py-3 px-4">Impact</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Operational Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      Reader Shell Engine
                    </td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-bold">
                      Zero Impact (0%)
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
                        OPERATIONAL
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      Standalone client viewports operate entirely in browser memory.
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      Margin Notes & Highlights
                    </td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-bold">
                      Zero Impact (0%)
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
                        PERSISTED
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      Cached locally; automatically synced once maintenance finishes.
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      Personal Shelves
                    </td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-bold">
                      Zero Impact (0%)
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
                        PERSISTED
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      Shelf organizations and reading queues remain fully interactive.
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      Catalog Indexing & Search RPC
                    </td>
                    <td className="py-3 px-4 text-amber-600 dark:text-amber-400 font-bold">
                      Transient Latency
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                        MAINTENANCE
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      Temporary background indexing pause during partition re-indexing.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Reader Safeguards */}
          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-indigo-600 dark:text-indigo-400">#</span>
              <span>2. Data Integrity & Safeguards</span>
            </h2>

            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
              <li>
                <strong>Zero Data Loss:</strong> All reading progress, scroll offsets, and margin notes are preserved locally.
              </li>
              <li>
                <strong>Autonomous Reader:</strong> Loaded books operate without live database connectivity.
              </li>
              <li>
                <strong>Automatic Reconciliation:</strong> Background sync resumes upon maintenance completion.
              </li>
            </ul>
          </div>

          {/* Section 3: Technical Protocol Metadata */}
          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-indigo-600 dark:text-indigo-400">#</span>
              <span>3. Technical Sign-off Protocol</span>
            </h2>

            <div className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-500">
                <span>verification_manifest.json</span>
                <span className="text-[10px] text-emerald-400 font-bold">VALIDATED</span>
              </div>
              <pre className="text-slate-300 leading-relaxed">
{`{
  "system": "tomesphere-core",
  "service": "catalog-indexing-engine",
  "scheduled_window": "02:00 - 04:00 UTC",
  "reader_availability": "100% UNINTERRUPTED",
  "offline_annotations": "LOCAL_FIRST_CACHED",
  "sign_off": "TomeSphere Infrastructure Operations"
}`}
              </pre>
            </div>
          </div>

          {/* Document Sign-off Footer */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Certified by TomeSphere Site Reliability Engineering</span>
            </div>

            <div className="font-mono text-[11px]">
              Doc Ref: TS-DOC-MAINT-2026
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MaintenanceDocumentViewer;
