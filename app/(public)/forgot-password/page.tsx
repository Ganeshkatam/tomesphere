"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { showError, showSuccess } from "@/lib/toast";
import { sendPasswordResetServer } from "@/modules/authentication/presentation/actions/auth";
import AuthTopBar from "@/modules/authentication/presentation/components/AuthTopBar";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      showError("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const res = await sendPasswordResetServer(email);

      if (!res.success) {
        throw new Error(res.error?.message || "Failed to send reset link");
      }

      showSuccess("If an account exists for that email, we've sent password reset instructions.");
      setSent(true);
    } catch (error: any) {
      console.error("Error:", error);
      showError(error.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--surface-canvas)] flex items-center justify-center p-4 sm:p-6 md:py-12 pt-20 sm:pt-24 relative overflow-hidden">
      {/* ── Floating Top Bar (Theme Toggle & Back Home) ── */}
      <AuthTopBar />

      {/* ── Route-related Background Sanctuary Backdrop ── */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <Image
          src="/auth_login_bg.jpg"
          alt="Library Sanctuary"
          fill
          className="object-cover object-center opacity-55 dark:opacity-85 transition-opacity duration-500"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-50/60 via-slate-100/45 to-indigo-50/40 dark:from-slate-950/75 dark:via-slate-950/65 dark:to-slate-900/50 backdrop-blur-[1px] transition-colors" />
      </div>

      <div className="w-full max-w-md animate-fadeIn relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white mb-2">
            Forgot Password?
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            No worries, we&apos;ll send you reset instructions
          </p>
        </div>

        {!sent ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/60">
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-600 dark:text-slate-400">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="text-slate-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors" size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-3.5 pl-12 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-600/30 transition-all text-sm"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-[52px] rounded-xl font-semibold text-sm flex items-center justify-center gap-2 group transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 active:scale-[0.99] cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    Send Reset Link <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline transition-colors"
                >
                  ← Back to login
                </Link>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/60 text-center">
            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-2">
              Check Your Email
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
              We&apos;ve sent a password reset link to <br />
              <strong className="text-slate-900 dark:text-white">{email}</strong>
            </p>
            <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-4 mb-6 text-xs text-slate-600 dark:text-slate-400">
              Click the link in the email to reset your password. The link expires in 1 hour.
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSent(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                Try Another Email
              </button>
              <Link
                href="/login"
                className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all flex items-center justify-center"
              >
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
