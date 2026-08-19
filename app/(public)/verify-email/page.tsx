"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { showError, showSuccess } from "@/lib/toast";
import AuthTopBar from "@/modules/authentication/presentation/components/AuthTopBar";
import { Mail, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState("");
  const [resending, setResending] = useState(false);
  const router = useRouter();

  const checkUser = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/auth/session");
      const resData = await res.json();
      const user = resData?.session?.user;

      if (!user) {
        router.push("/login");
        return;
      }

      setEmail(user.email || "");

      // If already verified, redirect to home
      if (user.email_confirmed_at) {
        showSuccess("Email already verified!");
        setTimeout(() => router.push("/discover"), 1000);
      }
    } catch {
      // ignore
    }
  }, [router]);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  const resendVerification = async () => {
    setResending(true);
    try {
      const res = await fetch("/api/v1/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      const error = !res.ok ? new Error(data.error?.message || "Failed to resend email") : null;

      if (error) throw error;

      showSuccess("Verification email resent! Check your inbox.");
    } catch (error: any) {
      showError("Failed to resend email");
    } finally {
      setResending(false);
    }
  };

  const handleSignOut = async () => {
    await fetch("/api/v1/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[var(--surface-canvas)] flex items-center justify-center p-4 sm:p-6 md:py-12 pt-20 sm:pt-24 relative overflow-hidden">
      {/* ── Floating Top Bar (Theme Toggle & Back Home) ── */}
      <AuthTopBar />

      {/* ── Route-related Background Sanctuary Backdrop ── */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <Image
          src="/auth_signup_bg.jpg"
          alt="Grand Library Atrium"
          fill
          className="object-cover object-center opacity-55 dark:opacity-85 transition-opacity duration-500"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-50/60 via-slate-100/45 to-purple-50/40 dark:from-slate-950/75 dark:via-slate-950/65 dark:to-slate-900/50 backdrop-blur-[1px] transition-colors" />
      </div>

      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/60 relative z-10">
        {/* Icon */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Mail size={32} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">
            Verify Your Email
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">We sent a verification link to</p>
          <p className="text-slate-900 dark:text-white font-semibold mt-1 text-base">{email || "your inbox"}</p>
        </div>

        {/* Instructions */}
        <div className="space-y-3 mb-6">
          <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <h3 className="text-slate-900 dark:text-white font-semibold mb-2 text-sm flex items-center gap-2">
              <CheckCircle2 size={16} className="text-indigo-600 dark:text-indigo-400" />
              <span>Next Steps:</span>
            </h3>
            <ol className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-decimal list-inside">
              <li>Check your email inbox</li>
              <li>Click the verification link</li>
              <li>Return here to start exploring books</li>
            </ol>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-3.5 border border-amber-200 dark:border-amber-800">
            <p className="text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>Check your spam folder if you don&apos;t see the email within 2 minutes.</span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={resendVerification}
            disabled={resending}
            className="w-full bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white py-3 rounded-xl font-semibold text-sm transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {resending ? "Sending..." : "Resend Verification Email"}
          </button>

          <button
            onClick={checkUser}
            className="w-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 py-3 rounded-xl font-semibold text-sm transition-all border border-slate-300 dark:border-slate-700 cursor-pointer"
          >
            I&apos;ve Verified - Continue
          </button>

          <button
            onClick={handleSignOut}
            className="w-full text-slate-500 hover:text-slate-900 dark:hover:text-white py-2 text-xs transition-colors cursor-pointer font-medium"
          >
            Sign out
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Need help?{" "}
            <Link
              href="/support"
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
