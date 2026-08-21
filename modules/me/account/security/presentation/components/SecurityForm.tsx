"use client";

import { useState, useTransition } from "react";
import { updatePasswordAction, PasswordUpdateData } from "../actions/security";
import { Loader2, Key, ShieldAlert } from "lucide-react";

export function SecurityForm() {
  const [isPending, startTransition] = useTransition();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    startTransition(async () => {
      const result = await updatePasswordAction({ password: formData.newPassword });
      
      if (result.success) {
        setSuccessMessage("Password updated successfully.");
        setFormData({ newPassword: "", confirmPassword: "" });
      } else {
        setErrorMessage(result.error?.message || "An error occurred.");
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* PASSWORD SECTION */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[var(--border-default)]">
          <Key size={18} className="text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-50 uppercase tracking-wider">
            Change Password
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
          {successMessage && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-sm">
              {successMessage}
            </div>
          )}
          
          {errorMessage && (
            <div className="p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg text-sm">
              {errorMessage}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
              />
              <p className="mt-1 text-xs text-slate-500">
                Must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isPending || !formData.newPassword}
              className="flex items-center justify-center px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </div>
        </form>
      </section>

      {/* DANGER ZONE SECTION */}
      <section className="space-y-4 pt-8">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-red-900/50">
          <ShieldAlert size={18} className="text-red-500" />
          <h3 className="text-sm font-bold text-red-500 uppercase tracking-wider">
            Danger Zone
          </h3>
        </div>
        
        <div className="p-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 rounded-xl max-w-xl">
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
            Delete Account
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button
            type="button"
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Delete Account
          </button>
        </div>
      </section>
    </div>
  );
}
