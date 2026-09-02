"use client";

import { KeyRound, Save, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { showError, showSuccess } from "@/lib/toast";
import { updatePasswordAction } from "../actions/security";

export function PasswordSection() {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      showError("Passwords do not match");
      return;
    }

    startTransition(async () => {
      const res = await updatePasswordAction({ password: formData.newPassword });
      if (res.success) {
        showSuccess("Password updated successfully");
        setFormData({ newPassword: "", confirmPassword: "" });
      } else {
        showError(res.error?.message || "Failed to update password");
      }
    });
  };

  return (
    <div className="p-6 bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <KeyRound size={18} className="text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Change Password
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
            New Password
          </label>
          <input
            type="password"
            value={formData.newPassword}
            onChange={(e) =>
              setFormData({ ...formData, newPassword: e.target.value })
            }
            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all shadow-xs"
            placeholder="At least 8 characters"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
            Confirm Password
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all shadow-xs"
            placeholder="Confirm new password"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          disabled={isPending || !formData.newPassword}
          className="px-6 py-2.5 text-xs font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-sm disabled:opacity-50 flex items-center gap-2 uppercase tracking-wider cursor-pointer"
        >
          {isPending ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Save size={15} />
          )}
          Update Password
        </button>
      </div>
    </div>
  );
}
