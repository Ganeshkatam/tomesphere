"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { showError, showSuccess } from "@/lib/toast";
import {
  Lock,
  Mail,
  User,
  ArrowRight,
  BookOpen,
  Sparkles,
  Shield,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";

const LEFT_FEATURES = [
  { icon: BookOpen, label: "Your books, always accessible" },
  { icon: Sparkles, label: "Highlights saved across sessions" },
  { icon: User, label: "Notes connected to your reading" },
  { icon: Shield, label: "Flashcards built from your annotations" },
  { icon: RefreshCw, label: "Citations generated automatically" },
];

const TRUST_SIGNALS = [
  { icon: Shield, label: "Secure authentication" },
  { icon: RefreshCw, label: "Sync across all devices" },
  { icon: Lock, label: "Your reading data stays private" },
];

const inputCls =
  "w-full bg-[var(--surface-raised)] border border-[var(--border-default)] text-slate-50 placeholder-slate-500 rounded-xl px-4 py-3.5 pl-12 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 transition-all text-sm";
const btnCls =
  "w-full h-[54px] rounded-xl font-semibold text-sm flex items-center justify-center gap-2 group transition-all duration-200 disabled:opacity-50 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-[0_4px_20px_rgba(99,102,241,0.25)] active:scale-[0.99]";

const Spinner = () => (
  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
);

import { signUpWithPassword } from "@/modules/authentication/presentation/actions/auth";

export default function SignupClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showError("Please enter your name");
      return;
    }

    if (password.length < 6) {
      showError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await signUpWithPassword(
        email.trim().toLowerCase(),
        password,
        name.trim(),
      );

      if (!res.success) {
        showError(res.error.message);
        setLoading(false);
        return;
      }

      if (res.data?.user) {
        // Always require email verification — never auto-login
        showSuccess("Check your email to verify your account.");
        router.push("/verify-email");
      }
    } catch (error: any) {
      showError(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    showError("Google Sign-In is being migrated to Server Actions.");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-8 relative">
      {/* ── Ambient background ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.015] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/8 rounded-full blur-[120px]" />
      </div>

      {/* ══════════════════════════════════════
                Centralized Workspace Card
            ══════════════════════════════════════ */}
      <div className="w-full max-w-6xl bg-[var(--surface-default)]/85 backdrop-blur-2xl border border-[var(--border-subtle)] rounded-[24px] overflow-hidden flex flex-col lg:flex-row shadow-[var(--shadow-card)] relative z-10">
        {/* ── character vertical divider (lg only) ── */}
        <div className="hidden lg:block absolute left-[65%] top-[10%] bottom-[10%] w-[1px] bg-gradient-to-b from-transparent via-indigo-500/25 to-transparent pointer-events-none">
          <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-1.5 h-6 bg-indigo-400 rounded-full blur-[2px] opacity-80" />
        </div>

        {/* ── Left Info Pane (65%) ── */}
        <div className="w-full lg:w-[65%] bg-gradient-to-b from-[var(--surface-raised)]/60 via-[var(--surface-default)]/50 to-[var(--surface-raised)]/70 relative p-8 sm:p-10 lg:p-10 flex flex-col justify-between gap-8 overflow-hidden">
          {/* Soft ambient glow on brand panel */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/[0.03] rounded-full blur-3xl pointer-events-none" />

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group w-fit relative z-10"
          >
            <span className="text-3xl group-hover:scale-105 transition-transform">
              📚
            </span>
            <div>
              <span className="text-lg font-display font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                TomeSphere
              </span>
              <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-[0.2em] mt-2">
                READ • LEARN • REMEMBER
              </p>
            </div>
          </Link>

          {/* Features & Copy */}
          <div className="space-y-6 relative z-10">
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-display font-bold leading-tight text-slate-50">
                Discover Books.
                <br />
                <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent dark:from-slate-100 dark:via-slate-200 dark:to-indigo-300">
                  Start Learning.
                </span>
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                Build your personal reading list, annotate books as you read,
                and create study cards to remember what matters.
              </p>
            </div>

            {/* Soft Glow Behind the Onboarding Card */}
            <div className="relative p-1 bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.06)_0%,transparent_70%)] w-fit rounded-3xl">
              {/* Compact Onboarding Mock Card */}
              <div className="glass bg-[var(--surface-default)]/60 border border-[var(--border-subtle)] rounded-2xl p-5 w-full max-w-sm sm:w-[350px] space-y-4 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">✨</span>
                    <h4 className="text-slate-50 text-xs font-semibold tracking-wide truncate max-w-[200px]">
                      New Library
                    </h4>
                  </div>
                  <span className="text-[10px] text-indigo-400 font-mono animate-pulse">
                    Setup
                  </span>
                </div>

                {/* Animated Setup Goal Indicator */}
                <div className="space-y-1">
                  <div className="h-1.5 w-full bg-[var(--border-default)] rounded-full overflow-hidden relative">
                    <div className="absolute top-0 left-0 h-full w-[15%] bg-purple-500 rounded-full animate-pulse" />
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-500">
                    <span>Library Ready</span>
                    <span>15%</span>
                  </div>
                </div>

                <div className="border-t border-white/[0.04] pt-3 space-y-3">
                  {/* Action checklist */}
                  <div className="space-y-2">
                    <div className="text-[9px] font-semibold text-indigo-400/90 uppercase tracking-wider">
                      <span>Quick Start Steps</span>
                    </div>
                    <ul className="space-y-1.5 pl-1.5">
                      <li className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                        <span className="w-1 h-1 rounded-full bg-indigo-500" />
                        <span>Import PDF, EPUB, or Web Articles</span>
                      </li>
                      <li className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                        <span className="w-1 h-1 rounded-full bg-indigo-500" />
                        <span>Highlight and extract key ideas</span>
                      </li>
                      <li className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                        <span className="w-1 h-1 rounded-full bg-indigo-500" />
                        <span>Build active-recall flashcard decks</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Workflow indicator */}
            <div className="flex items-center gap-2.5 text-[11px] font-semibold text-slate-500">
              <span className="text-slate-50/80">Import</span>
              <span className="text-indigo-500/80">→</span>
              <span className="text-slate-50/80">Highlight</span>
              <span className="text-indigo-500/80">→</span>
              <span className="text-slate-50/80">Learn</span>
            </div>
          </div>

          {/* Accent border bottom spacer */}
          <div className="w-16 h-1 bg-gradient-to-r from-indigo-500/20 to-transparent rounded-full" />
        </div>

        {/* ── Right Form Pane (35%) ── */}
        <div className="w-full lg:w-[35%] p-8 sm:p-14 lg:p-16 bg-[var(--surface-raised)]/20 flex flex-col justify-between relative z-10">
          <div className="space-y-6 w-full mx-auto my-auto">
            {/* Header */}
            <div>
              <h2 className="text-2xl font-bold text-slate-50 mb-1">
                Create Account
              </h2>
              <p className="text-slate-400 text-xs leading-relaxed">
                Start your learning journey.
              </p>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSignup} className="space-y-4">
              {/* Name Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <User
                    className="text-slate-500 group-focus-within:text-indigo-400 transition-colors"
                    size={16}
                  />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className={inputCls}
                  required
                  disabled={loading}
                />
              </div>

              {/* Email Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <Mail
                    className="text-slate-500 group-focus-within:text-indigo-400 transition-colors"
                    size={16}
                  />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputCls}
                  required
                  disabled={loading}
                />
              </div>

              {/* Password Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <Lock
                    className="text-slate-500 group-focus-within:text-indigo-400 transition-colors"
                    size={16}
                  />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className={inputCls}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Submit Button */}
              <button type="submit" disabled={loading} className={btnCls}>
                {loading ? (
                  <Spinner />
                ) : (
                  <>
                    Create Account <ArrowRight size={15} />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/8" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-[#0a0f1d] text-slate-500">or</span>
                </div>
              </div>

              {/* Google Sign Up */}
              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={loading}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white h-[54px] rounded-xl font-medium text-sm flex items-center justify-center gap-3 transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </button>
            </form>
          </div>

          {/* Footer sign up & legal links */}
          <div className="space-y-5 mt-8 border-t border-white/5 pt-6 text-center">
            <div className="text-slate-500 text-xs">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
              >
                Sign in
              </Link>
            </div>

            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-600">
              <a
                href="/privacy"
                className="hover:text-slate-400 transition-colors"
              >
                Privacy
              </a>
              <span className="text-slate-800">•</span>
              <a
                href="/terms"
                className="hover:text-slate-400 transition-colors"
              >
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
