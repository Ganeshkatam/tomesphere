"use client";

import { Download, Loader2, Clock, CheckCircle } from "lucide-react";
import { useTransition } from "react";
import { showError, showSuccess } from "@/lib/toast";
import { requestExportAction } from "../../../../../app/(workspace)/account/security/actions";

interface ExportDataProps {
  userId: string;
  exportData?: {
    status:
      | "requested"
      | "queued"
      | "processing"
      | "completed"
      | "failed"
      | "expired";
    downloadUrl: string | null;
    requestedAt: Date | string | null;
  } | null;
}

export function ExportSection({ userId, exportData }: ExportDataProps) {
  const [isPending, startTransition] = useTransition();

  const active =
    exportData &&
    ["requested", "queued", "processing"].includes(exportData.status);
  const completed = exportData?.status === "completed";

  const handleRequest = () => {
    startTransition(async () => {
      const res = await requestExportAction({ userId });
      if (res.success) {
        showSuccess(
          "Export requested successfully. You will be notified when it's ready.",
        );
      } else {
        showError(res.error || "Failed to request export");
      }
    });
  };

  return (
    <div className="p-5 bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-2xl space-y-4">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[var(--border-default)]">
        <Download size={18} className="text-emerald-400" />
        <h3 className="text-sm font-bold text-slate-50 uppercase tracking-wider">
          Export Data
        </h3>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-50">
            Download Your Information
          </h4>
          <p className="text-xs text-slate-400 mt-1 max-w-md">
            Request a copy of your library, reading progress, highlights, and
            notes. This process may take a few minutes. We'll email you when
            your download is ready.
          </p>

          {active && (
            <div className="mt-3 flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-3 py-2 rounded-lg inline-flex">
              <Clock size={14} className="animate-pulse" />
              Export is currently {exportData.status}...
            </div>
          )}

          {completed && exportData.downloadUrl && (
            <div className="mt-3 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-3 py-2 rounded-lg inline-flex w-fit">
                <CheckCircle size={14} />
                Export completed
              </div>
              <a
                href={exportData.downloadUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1 w-fit"
              >
                <Download size={12} />
                Download JSON Archive
              </a>
            </div>
          )}
        </div>

        <button
          onClick={handleRequest}
          disabled={isPending || !!active}
          className="shrink-0 px-6 py-2.5 text-sm font-bold bg-[var(--surface-default)] text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 rounded-xl transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Download size={16} />
          )}
          {active ? "Export in Progress" : "Request Export"}
        </button>
      </div>
    </div>
  );
}
