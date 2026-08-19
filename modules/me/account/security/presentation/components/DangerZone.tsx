"use client";

import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { showError } from "@/lib/toast";
import { deleteAccountAction } from "../actions/security";

const DELETION_CONFIRMATION = "DELETE MY ACCOUNT";

export function DangerZone({ userId }: { userId: string }) {
  const [confirmation, setConfirmation] = useState("");
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    if (confirmation !== DELETION_CONFIRMATION) {
      showError(`Please type "${DELETION_CONFIRMATION}" to confirm`);
      return;
    }

    startTransition(async () => {
      const res = await deleteAccountAction({
        userId,
        confirmationText: confirmation,
      });
      if (res.success) {
        // Redirect will happen automatically if auth state changes, or we can force it
        window.location.href = "/";
      } else {
        showError(res.error || "Failed to delete account");
      }
    });
  };

  return (
    <div className="p-5 bg-red-950/20 border border-red-900/50 rounded-2xl space-y-4">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-red-900/50">
        <AlertTriangle size={18} className="text-red-500" />
        <h3 className="text-sm font-bold text-red-500 uppercase tracking-wider">
          Danger Zone
        </h3>
      </div>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex-1">
          <h4 className="text-sm font-bold text-slate-50">Delete Account</h4>
          <p className="text-xs text-red-300/80 mt-1 max-w-lg leading-relaxed">
            Once you delete your account, there is no going back. Please be
            certain. All your reading progress, notes, highlights, and personal
            library will be permanently removed from our servers.
          </p>

          {showConfirm && (
            <div className="mt-4 p-4 bg-black/40 rounded-xl border border-red-900/30">
              <label className="block text-xs font-bold text-red-400 mb-2">
                Type{" "}
                <span className="text-slate-50 select-all bg-red-500/20 px-1 rounded">
                  {DELETION_CONFIRMATION}
                </span>{" "}
                to confirm
              </label>
              <input
                type="text"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                className="w-full bg-[var(--surface-default)] border border-red-900/50 rounded-lg px-4 py-2 text-sm font-bold text-slate-50 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all mb-3"
                placeholder={DELETION_CONFIRMATION}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  disabled={isPending || confirmation !== DELETION_CONFIRMATION}
                  className="flex-1 py-2 text-sm font-bold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 disabled:bg-red-900/50 flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                  Permanently Delete
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={isPending}
                  className="px-4 py-2 text-sm font-bold bg-[var(--surface-raised)] text-slate-300 hover:text-slate-50 hover:bg-[var(--surface-overlay)] border border-[var(--border-default)] rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {!showConfirm && (
          <button
            onClick={() => setShowConfirm(true)}
            className="shrink-0 px-6 py-2.5 text-sm font-bold bg-red-950/50 text-red-400 border border-red-900/50 hover:bg-red-900 hover:text-white rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Trash2 size={16} />
            Delete Account
          </button>
        )}
      </div>
    </div>
  );
}
