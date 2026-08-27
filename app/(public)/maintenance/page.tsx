import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  ShieldAlert,
  Clock,
  BookOpen,
  ArrowRight,
  FileText,
  Calendar,
  AlertTriangle,
  Server,
  Layers,
  Database,
  HelpCircle,
} from "lucide-react";
import { createSupabaseServerClient } from "@/shared/core/database/server";
import { SupabaseAnnouncementReadModel } from "@/modules/announcements/infrastructure/read-models/SupabaseAnnouncementReadModel";
import { GetActiveAnnouncementsQueryHandler } from "@/modules/announcements/application/queries/GetActiveAnnouncements/handler";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Scheduled Maintenance & Operations Report",
  description:
    "Detailed operational report, execution timelines, and service impact assessment for scheduled TomeSphere system maintenance.",
};

export const revalidate = 60; // Refresh every 60 seconds

export default async function MaintenancePage() {
  const supabase = await createSupabaseServerClient();
  const readModel = new SupabaseAnnouncementReadModel(supabase);
  const handler = new GetActiveAnnouncementsQueryHandler(readModel);

  const announcements = await handler.execute().catch(() => []);

  const maintenanceAnnouncements = announcements.filter(
    (a) =>
      a.type === "warning" ||
      a.type === "maintenance" ||
      a.type === "error"
  );

  const activeNotice =
    maintenanceAnnouncements[0] || {
      id: "maint-scheduled-default",
      title: "Scheduled Catalog Indexing & System Optimization",
      content:
        "TomeSphere catalog indexing and sync services will undergo scheduled database optimization on Sunday from 02:00 to 04:00 UTC. Reader sessions and offline margin notes will remain fully uninterrupted.",
      startsAt: new Date().toISOString(),
      type: "warning",
    };

  const impactMatrix = [
    {
      subsystem: "Reader Shell & EPUB/PDF Rendering",
      scope: "Browser Client Engine",
      impact: "Zero Impact",
      details: "Standalone reader viewports operate completely client-side. Open reading sessions continue uninterrupted.",
      statusColor: "text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    },
    {
      subsystem: "Margin Notes, Quotes & Annotations",
      scope: "Client Cache & Sync Ledger",
      impact: "Zero Impact",
      details: "All annotations are cached in local browser storage and automatically reconciled upon reconnection.",
      statusColor: "text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    },
    {
      subsystem: "Personal Shelves & Reading Queues",
      scope: "Workspace Collections",
      impact: "Zero Impact",
      details: "Private shelf structures and reading progress state remain accessible throughout the window.",
      statusColor: "text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    },
    {
      subsystem: "Catalog Indexing & Live Search Queries",
      scope: "Database & Search RPC",
      impact: "Brief Intermittent Latency",
      details: "Search RPC queries may experience brief transient latency spikes while full-text partitions re-index.",
      statusColor: "text-amber-800 dark:text-amber-300 bg-amber-500/15 border-amber-500/30",
    },
  ];

  const timelineSteps = [
    {
      time: "01:45 UTC",
      phase: "Phase 1: Pre-Flight Verification",
      description: "Automated snapshot integrity checks and edge cache pre-warming across discovery endpoints.",
      status: "Pre-Maintenance",
    },
    {
      time: "02:00 UTC",
      phase: "Phase 2: Database Index Partitioning",
      description: "Execution of full-text catalog index rebuilding and database vacuum optimization routines.",
      status: "Active Execution",
    },
    {
      time: "03:30 UTC",
      phase: "Phase 3: Schema Consistency Audit",
      description: "Verification of metadata relational constraints and query latency validation.",
      status: "Verification",
    },
    {
      time: "04:00 UTC",
      phase: "Phase 4: Full Traffic Normalization",
      description: "Completion of maintenance window and resumption of normal background ingestion workers.",
      status: "Resolution",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--surface-canvas)] text-[var(--text-primary)] font-sans">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-6">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white">Maintenance Operations Report</span>
        </div>

        {/* Header Section */}
        <div className="mb-10 pb-8 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              <span>Maintenance Advisory</span>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
              <span>Report Ref: <strong className="text-slate-900 dark:text-slate-200">TS-MAINT-2026-08</strong></span>
              <span className="hidden sm:inline">&bull;</span>
              <span suppressHydrationWarning>Updated: {formatDate(activeNotice.startsAt)}</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight mb-4 leading-tight">
            Detailed Maintenance Report
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
            This operational document outlines the execution window, subsystem impact assessment, and safeguards for scheduled TomeSphere platform optimization.
          </p>
        </div>

        {/* Primary Executive Summary Card */}
        <div className="relative overflow-hidden rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-amber-500/10 via-white to-amber-500/5 dark:from-amber-950/40 dark:via-slate-950/90 dark:to-amber-950/20 border border-amber-300/60 dark:border-amber-500/30 shadow-xl mb-12">
          <div className="flex items-center gap-3 text-amber-800 dark:text-amber-300 mb-4 font-bold text-sm uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>Executive Advisory</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white tracking-tight mb-4">
            {activeNotice.title}
          </h2>

          <p className="text-base text-slate-700 dark:text-slate-200 leading-relaxed mb-6 font-normal">
            {activeNotice.content}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-amber-200/80 dark:border-amber-500/20 text-xs">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <div>
                <p className="text-slate-500 dark:text-slate-400">Scheduled Date</p>
                <p className="font-bold text-slate-900 dark:text-white">Sunday (Upcoming)</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <div>
                <p className="text-slate-500 dark:text-slate-400">Target Window</p>
                <p className="font-bold text-slate-900 dark:text-white">02:00 &ndash; 04:00 UTC (120 min)</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <div>
                <p className="text-slate-500 dark:text-slate-400">Reader Availability</p>
                <p className="font-bold text-emerald-600 dark:text-emerald-400">100% Uninterrupted</p>
              </div>
            </div>
          </div>
        </div>

        {/* Subsystem Impact Assessment Matrix */}
        <div className="mb-14">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Subsystem Impact Assessment
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                Technical impact breakdown across user workloads and background pipelines.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 overflow-hidden shadow-lg">
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {impactMatrix.map((item, idx) => (
                <div key={idx} className="p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">
                        {item.subsystem}
                      </h3>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        {item.scope}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                      {item.details}
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap w-fit shrink-0 ${item.statusColor}`}
                  >
                    {item.impact}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chronological Maintenance Timeline */}
        <div className="mb-14">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Execution Timeline & Phases
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              Deterministic sequence of infrastructure routines during the 2-hour maintenance window.
            </p>
          </div>

          <div className="space-y-4">
            {timelineSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-mono text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">
                    0{idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400">
                        {step.time}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white text-base">
                        {step.phase}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 w-fit shrink-0">
                  {step.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Reader Assurance & Safeguards */}
        <div className="rounded-3xl p-8 sm:p-10 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-lg mb-12">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Reader Safeguards & FAQs
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">
                Will my reading progress, bookmarks, or marginalia be affected?
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                No. All reading progress, scroll offsets, highlights, and margin notes are persistently cached in your browser&apos;s local storage. They remain fully interactive during the window and synchronize seamlessly once maintenance finishes.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">
                Can I continue reading opened books?
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                Yes. The standalone reader shell operates autonomously in client memory. Book content, formatting tools, and typography adjustments do not rely on live database round-trips once loaded.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation & Help CTAs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <Button
            asChild
            variant="outline"
            className="h-11 px-6 font-semibold rounded-xl border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100"
          >
            <Link href="/discover" className="inline-flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>Explore Catalog</span>
            </Link>
          </Button>

          <Button
            asChild
            className="h-11 px-6 font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
          >
            <Link href="/support" className="inline-flex items-center gap-2">
              <span>Contact Reader Support</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
