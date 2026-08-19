"use client";

import { ShieldAlert, LogOut, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { showError, showSuccess } from "@/lib/toast";
import { signOutAllDevicesAction } from "../actions/security";

export function SignOutSection() {
  const [isPending, startTransition] = useTransition();

  const handleSignOutAll = () => {
    startTransition(async () => {
      const res = await signOutAllDevicesAction({});
      if (res.success) {
        showSuccess("Signed out of all other sessions");
      } else {
        showError(res.error || "Failed to sign out of other sessions");
      }
    });
  };

  return (
    <div className="p-5 bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-2xl space-y-4">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[var(--border-default)]">
        <ShieldAlert size={18} className="text-amber-400" />
        <h3 className="text-sm font-bold text-slate-50 uppercase tracking-wider">
          Session Security
        </h3>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-50">
            Sign Out Everywhere
          </h4>
          <p className="text-xs text-slate-400 mt-1 max-w-md">
            Lost a device or noticed suspicious activity? Sign out of all other
            active sessions across all devices. Your current session will remain
            active.
          </p>
        </div>

        <button
          onClick={handleSignOutAll}
          disabled={isPending}
          className="shrink-0 px-6 py-2.5 text-sm font-bold bg-[var(--surface-default)] text-amber-400 border border-amber-500/30 hover:bg-amber-500/10 rounded-xl transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <LogOut size={16} />
          )}
          Sign Out All Devices
        </button>
      </div>
    </div>
  );
}
