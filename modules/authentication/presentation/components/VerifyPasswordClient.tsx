"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import AuthTopBar from "./AuthTopBar";
import { showError, showSuccess } from "@/lib/toast";
import { Eye, EyeOff, Lock, ArrowRight } from "lucide-react";

function VerifyPasswordForm() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      const authError = !res.ok
        ? new Error(data.error?.message || "Failed to sign in")
        : null;
      const authData = data;

      if (authError) throw authError;

      if (authData?.user) {
        showSuccess("Welcome back!");

        setTimeout(() => {
          router.push("/home");
        }, 500);
      }
    } catch (error: any) {
      showError("Incorrect password");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && password) {
      e.preventDefault();
      handleVerify(e as any);
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
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2 font-display">
            Welcome Back
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Enter your password to continue</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/60">
          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-600 dark:text-slate-400"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                readOnly
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl px-4 py-3 text-sm cursor-not-allowed opacity-80"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-600 dark:text-slate-400"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Enter your password"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-3.5 pr-12 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-600/30 transition-all text-sm"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Keep me logged in checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="keepLoggedIn"
                checked={keepLoggedIn}
                onChange={(e) => setKeepLoggedIn(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor="keepLoggedIn"
                className="ml-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer select-none"
              >
                Keep me logged in
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[52px] rounded-xl font-semibold text-sm flex items-center justify-center gap-2 group transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 active:scale-[0.99] cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  Continue <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Not you?{" "}
              <Link
                href="/login"
                className="text-indigo-600 dark:text-indigo-400 hover:underline transition-colors font-semibold"
              >
                Use another account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPassword() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--surface-canvas)] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      }
    >
      <VerifyPasswordForm />
    </Suspense>
  );
}
