"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getSafeRedirectUrl } from "@/shared/core/utils/redirect";
import {
  loginWithPassword,
  sendMagicLinkServer,
  verifyMagicLinkServer,
  getMFAStatus,
  verifyMFA,
} from "@/modules/authentication/presentation/actions/auth";
import { showError, showSuccess } from "@/lib/toast";
import {
  Lock,
  Mail,
  Smartphone,
  ArrowRight,
  Globe,
  ChevronDown,
  Sparkles,
  BookOpen,
  Check,
  Shield,
  RefreshCw,
  Eye,
  EyeOff,
  PenTool,
  CheckSquare,
  FileText,
} from "lucide-react";

const COUNTRY_CODES = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "USA", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
];

const LEFT_FEATURES = [
  { icon: BookOpen, label: "Your books, always accessible" },
  { icon: Sparkles, label: "Highlights saved across sessions" },
  { icon: PenTool, label: "Notes connected to your reading" },
  { icon: CheckSquare, label: "Flashcards built from your annotations" },
  { icon: FileText, label: "Citations generated automatically" },
];

const TRUST_SIGNALS = [
  { icon: Shield, label: "Secure authentication" },
  { icon: RefreshCw, label: "Sync across all devices" },
  { icon: Lock, label: "Your reading data stays private" },
];

/* ──────────────────────────────────────────
   Shared input class
────────────────────────────────────────── */
const inputCls =
  "w-full bg-[var(--surface-raised)] border border-[var(--border-default)] text-slate-50 placeholder-slate-500 rounded-xl px-4 py-3.5 pl-12 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 transition-all text-sm";
const btnCls =
  "w-full h-[54px] rounded-xl font-semibold text-sm flex items-center justify-center gap-2 group transition-all duration-200 disabled:opacity-50 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-[0_4px_20px_rgba(99,102,241,0.25)] active:scale-[0.99]";

/* ──────────────────────────────────────────
   Spinner
────────────────────────────────────────── */
const Spinner = () => (
  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
);

/* ══════════════════════════════════════════
   Main Component
══════════════════════════════════════════ */
export default function EnhancedLoginPage() {
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"input" | "password" | "otp" | "mfa">(
    "input",
  );
  const [mfaCode, setMfaCode] = useState("");
  const [authMode, setAuthMode] = useState<"password" | "magic">("password");
  const [otp, setOtp] = useState("");
  const [isPhone, setIsPhone] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = getSafeRedirectUrl(searchParams.get("redirectTo"));

  /* ── helpers ── */
  const detectInputType = (value: string): "email" | "phone" | "unknown" => {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "email";
    if (/^\d{10,15}$/.test(value) || /^\+\d{10,15}$/.test(value))
      return "phone";
    return "unknown";
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    setIsPhone(detectInputType(value) === "phone");
  };

  const checkMFA = async () => {
    try {
      const res = await getMFAStatus();
      if (true && res.isEnabled) {
        setStep("mfa");
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  /* ── auth handlers ── */
  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (detectInputType(input) === "unknown") {
      showError("Please enter a valid email or phone number");
      return;
    }
    if (authMode === "magic") {
      await handleMagicLinkLogin(e);
    } else {
      setStep("password");
    }
  };

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let id = input;
      if (isPhone) {
        const c = input.replace(/[\s-]/g, "");
        id = c.startsWith("+") ? c : `${countryCode}${c}`;
      }
      const res = await sendMagicLinkServer(id, isPhone);

      if (!res.success) {
        showError(res.error.message);
        return;
      }

      showSuccess(
        isPhone ? "SMS code sent!" : "Magic code sent to your email!",
      );
      setStep("otp");
    } catch (err: any) {
      showError(err.message || "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let id = input;
      if (isPhone) {
        const c = input.replace(/[\s-]/g, "");
        id = c.startsWith("+") ? c : `${countryCode}${c}`;
      }
      const res = await loginWithPassword(id, password, isPhone);

      if (!res.success) {
        showError(res.error.message);
        setLoading(false);
        return;
      }

      const mfaRequired = await checkMFA();
      if (mfaRequired) {
        setLoading(false);
        return;
      }
      showSuccess("Logged in successfully!");
      router.push(redirectTo);
    } catch (err: any) {
      showError(err.message || "Invalid password");
      setLoading(false);
    }
  };

  const handleMFAVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      throw new Error(
        "MFA is currently being migrated to Server Actions. Please contact support.",
      );
      showSuccess("MFA Verified! Logging in...");
      router.push(redirectTo);
    } catch (err: any) {
      showError(err.message || "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const id = isPhone ? `${countryCode}${input}` : input;
      const res = await verifyMagicLinkServer(id, otp, isPhone);

      if (!res.success) {
        showError(res.error.message);
        setLoading(false);
        return;
      }

      showSuccess("Verified! Logging in...");
      router.push(redirectTo);
    } catch (err: any) {
      showError(err.message || "Invalid code");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    showError("Google Sign-In is being migrated to Server Actions.");
  };

  /* ══════════════════════════════════════════
       MFA Screen (minimal)
    ══════════════════════════════════════════ */
  if (step === "mfa") {
    return (
      <div className="min-h-screen bg-[var(--surface-canvas)] flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/8 rounded-full blur-[120px]" />
        </div>
        <div className="relative w-full max-w-sm bg-[var(--surface-default)] backdrop-blur-xl border border-[var(--border-default)] rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-indigo-500/15 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="text-indigo-400" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Two-Factor Auth
            </h1>
            <p className="text-slate-400 text-sm">
              Enter the 6-digit code from your authenticator app
            </p>
          </div>
          <form onSubmit={handleMFAVerify} className="space-y-5">
            <input
              type="text"
              maxLength={6}
              value={mfaCode}
              onChange={(e) =>
                setMfaCode(e.target.value.replace(/[^0-9]/g, ""))
              }
              className="w-full bg-white/5 border border-[var(--border-default)] rounded-xl px-4 py-3.5 text-white text-center text-xl tracking-[0.5em] font-mono focus:outline-none focus:border-indigo-500/60 transition-all"
              placeholder="000000"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || mfaCode.length !== 6}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Spinner />
              ) : (
                <>
                  Verify <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════
       Centralized Workspace Card
    ══════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[var(--surface-canvas)] flex items-center justify-center p-4 sm:p-8 relative">
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
                Read Smarter.
                <br />
                <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent dark:from-slate-100 dark:via-slate-200 dark:to-indigo-300">
                  Remember More.
                </span>
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                Access your library, notes, highlights, and study plans in one
                unified space.
              </p>
            </div>

            {/* Soft Glow Behind the Workspace Card */}
            <div className="relative p-1 bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.06)_0%,transparent_70%)] w-fit rounded-3xl">
              {/* Compact Mock Reader Workspace Card */}
              <div className="glass bg-[var(--surface-default)]/60 border border-[var(--border-subtle)] rounded-2xl p-5 w-full max-w-sm sm:w-[350px] space-y-4 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">📖</span>
                    <h4 className="text-slate-50 text-xs font-semibold tracking-wide truncate max-w-[200px]">
                      Algorithms
                    </h4>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono animate-pulse">
                    Page 143
                  </span>
                </div>

                {/* Animated Progress Bar */}
                <div className="space-y-1">
                  <div className="h-1.5 w-full bg-[var(--border-default)] rounded-full overflow-hidden relative">
                    <div className="absolute top-0 left-0 h-full w-[72%] bg-indigo-500 rounded-full animate-pulse" />
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-500">
                    <span>Progress</span>
                    <span>72%</span>
                  </div>
                </div>

                <div className="border-t border-white/[0.04] pt-3 space-y-3">
                  {/* Highlight snippet */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[9px] font-semibold text-yellow-500/90 uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-ping" />
                      <span>Highlight</span>
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)] italic pl-3 border-l border-yellow-500/40 leading-relaxed">
                      &quot;Graph traversal algorithms like DFS and BFS form the
                      foundation...&quot;
                    </p>
                  </div>

                  {/* Note snippet */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[9px] font-semibold text-indigo-400 uppercase tracking-wider">
                      <span>Note</span>
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)] pl-3 border-l border-indigo-500/40 leading-relaxed">
                      Remember: DFS uses a stack, BFS uses a queue.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Workflow indicator */}
            <div className="flex items-center gap-2.5 text-[11px] font-semibold text-slate-500">
              <span className="text-slate-50/80">Read</span>
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
                Welcome Back
              </h2>
              <p className="text-slate-400 text-xs leading-relaxed">
                Continue where you left off.
              </p>
            </div>

            {/* Auth mode segmented control */}
            {step === "input" && (
              <div className="flex p-1 bg-white/5 rounded-xl relative">
                <button
                  onClick={() => setAuthMode("password")}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${authMode === "password" ? "bg-white/10 text-white shadow-sm border border-[var(--border-subtle)]" : "text-slate-400/60 hover:text-white"}`}
                  type="button"
                >
                  Password
                </button>
                <button
                  onClick={() => setAuthMode("magic")}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${authMode === "magic" ? "bg-white/10 text-white shadow-sm border border-[var(--border-subtle)]" : "text-slate-400/60 hover:text-white"}`}
                  type="button"
                >
                  <Sparkles size={11} /> Magic Link
                </button>
              </div>
            )}

            {/* ── STEP: input ── */}
            {step === "input" && (
              <form onSubmit={handleContinue} className="space-y-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    {isPhone ? (
                      <Smartphone
                        className="text-slate-500 group-focus-within:text-indigo-400 transition-colors"
                        size={16}
                      />
                    ) : (
                      <Mail
                        className="text-slate-500 group-focus-within:text-indigo-400 transition-colors"
                        size={16}
                      />
                    )}
                  </div>
                  <div className="flex">
                    {isPhone && (
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            setShowCountryDropdown(!showCountryDropdown)
                          }
                          className="h-full px-3 bg-white/5 border-y border-l border-[var(--border-default)] rounded-l-xl text-slate-300 hover:text-white flex items-center gap-1 text-sm transition-colors"
                        >
                          <span>
                            {
                              COUNTRY_CODES.find((c) => c.code === countryCode)
                                ?.flag
                            }
                          </span>
                          <span>{countryCode}</span>
                          <ChevronDown size={12} />
                        </button>
                        {showCountryDropdown && (
                          <div className="absolute top-full left-0 mt-1 w-60 bg-[var(--surface-default)] border border-[var(--border-default)] rounded-xl shadow-xl z-50 max-h-56 overflow-y-auto">
                            {COUNTRY_CODES.map((c) => (
                              <button
                                key={c.code}
                                type="button"
                                onClick={() => {
                                  setCountryCode(c.code);
                                  setShowCountryDropdown(false);
                                }}
                                className="w-full px-4 py-2.5 text-left hover:bg-white/10 flex items-center gap-3 transition-colors text-sm"
                              >
                                <span className="text-lg">{c.flag}</span>
                                <span className="text-slate-300">
                                  {c.country}
                                </span>
                                <span className="ml-auto text-slate-500 text-xs">
                                  {c.code}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    <input
                      type={isPhone ? "tel" : "text"}
                      value={input}
                      onChange={(e) => handleInputChange(e.target.value)}
                      className={`${inputCls} ${isPhone ? "rounded-r-xl border-l-0 pl-4" : ""}`}
                      placeholder={isPhone ? "Phone number" : "Email or phone"}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !input}
                  className={btnCls}
                >
                  {loading ? (
                    <Spinner />
                  ) : (
                    <>
                      {authMode === "password" ? "Continue" : "Send Magic Link"}{" "}
                      <ArrowRight
                        size={15}
                        className="group-hover:translate-x-0.5 transition-transform"
                      />
                    </>
                  )}
                </button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[var(--border-default)]" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-[var(--surface-default)] text-slate-500">
                      or
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full bg-[var(--surface-default)] hover:bg-[var(--surface-overlay)] border border-[var(--border-default)] text-slate-50 h-[54px] rounded-xl font-medium text-sm flex items-center justify-center gap-3 transition-all"
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
            )}

            {/* ── STEP: password ── */}
            {step === "password" && (
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <div className="flex items-center justify-between px-4 py-3 bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm">
                      {input.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide">
                        Signing in as
                      </p>
                      <p className="text-slate-50 text-sm font-medium">
                        {input}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setStep("input");
                      setPassword("");
                    }}
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Change
                  </button>
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock
                      className="text-slate-500 group-focus-within:text-indigo-400 transition-colors"
                      size={16}
                    />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputCls}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <div className="flex justify-end">
                  <a
                    href="/forgot-password"
                    className="text-xs text-slate-500 hover:text-slate-50 transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading || !password}
                  className={btnCls}
                >
                  {loading ? (
                    <Spinner />
                  ) : (
                    <>
                      Resume Reading <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ── STEP: OTP ── */}
            {step === "otp" && (
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div className="text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500/15 to-purple-500/15 border border-[var(--border-default)] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Mail className="text-indigo-400" size={26} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-50 mb-1">
                    Check your inbox
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Magic code sent to{" "}
                    <span className="text-white font-medium">{input}</span>
                  </p>
                </div>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-white/5 border border-[var(--border-default)] text-white text-center text-2xl tracking-widest px-4 py-3.5 rounded-xl focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/40 transition-all font-mono"
                  placeholder="000000"
                  maxLength={6}
                  required
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className={btnCls}
                >
                  {loading ? <Spinner /> : "Verify & Sign In"}
                </button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setStep("input")}
                    className="text-xs text-slate-500 hover:text-white transition-colors"
                  >
                    ← Back
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Footer sign up & legal links */}
          <div className="space-y-5 mt-8 border-t border-[var(--border-subtle)] pt-6 text-center">
            <div className="text-slate-500 text-xs">
              New to TomeSphere?{" "}
              <button
                onClick={() => router.push("/signup")}
                className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
              >
                Create a free account
              </button>
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
