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
      const res = await updatePasswordAction(formData);
      if (res.success) {
        showSuccess("Password updated successfully");
        setFormData({ newPassword: "", confirmPassword: "" });
      } else {
        showError(res.error || "Failed to update password");
      }
    });
  };

  return (
    <div className="p-5 bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-2xl space-y-4">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[var(--border-default)]">
        <KeyRound size={18} className="text-indigo-400" />
        <h3 className="text-sm font-bold text-slate-50 uppercase tracking-wider">
          Change Password
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
            New Password
          </label>
          <input
            type="password"
            value={formData.newPassword}
            onChange={(e) =>
              setFormData({ ...formData, newPassword: e.target.value })
            }
            className="w-full bg-[var(--surface-default)] border border-[var(--border-default)] rounded-xl px-4 py-2.5 text-sm font-medium text-slate-50 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            placeholder="At least 8 characters"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
            Confirm Password
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            className="w-full bg-[var(--surface-default)] border border-[var(--border-default)] rounded-xl px-4 py-2.5 text-sm font-medium text-slate-50 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            placeholder="Confirm new password"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          disabled={isPending || !formData.newPassword}
          className="px-6 py-2.5 text-sm font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
        >
          {isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Update Password
        </button>
      </div>
    </div>
  );
}
