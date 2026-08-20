"use client";

import React, { useState } from "react";
import { showError, showSuccess } from "@/lib/toast";
import { supabase } from "@/shared/core/database/client";
import {
  Link2,
  CheckCircle2,
  Mail,
  ShieldCheck,
  Calendar,
  ExternalLink,
  Lock,
} from "lucide-react";

export interface UserIdentityDto {
  id: string;
  provider: string;
  email?: string | null;
  createdAt?: string | null;
  lastSignInAt?: string | null;
}

interface ConnectedAccountsScreenProps {
  primaryEmail: string;
  identities: UserIdentityDto[];
}

export function ConnectedAccountsScreen({
  primaryEmail,
  identities,
}: ConnectedAccountsScreenProps) {
  const [isLinking, setIsLinking] = useState(false);

  const isGoogleConnected = identities.some((i) => i.provider === "google");
  const isEmailConnected = identities.some((i) => i.provider === "email");
  const googleIdentity = identities.find((i) => i.provider === "google");

  const handleConnectGoogle = async () => {
    setIsLinking(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/me/account/connections`,
        },
      });

      if (error) {
        showError(error.message || "Failed to start Google account link.");
      }
    } catch (err: any) {
      showError(err.message || "Failed to start Google account link.");
    } finally {
      setIsLinking(false);
    }
  };

  const handleDisconnect = () => {
    if (identities.length <= 1) {
      showError(
        "You cannot disconnect this authentication method because it is your only way to sign in."
      );
      return;
    }
    showError("To modify linked provider accounts, please re-authenticate in Security settings.");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
          Connected Accounts
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage your verified authentication providers and external sign-in identities.
        </p>
      </div>

      {/* Main Container */}
      <div className="p-6 bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-2xl space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-default)]">
          <Link2 size={18} className="text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-50 uppercase tracking-wider">
            Sign-in Identities
          </h3>
        </div>

        {/* Identities List */}
        <div className="space-y-4">
          {/* 1. Email & Password Identity */}
          <div className="p-5 rounded-xl bg-[var(--surface-default)] border border-[var(--border-default)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex-shrink-0">
                <Mail size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-100">
                    Email & Password
                  </h4>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                    <CheckCircle2 size={10} />
                    Primary
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{primaryEmail}</p>
                <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                  <ShieldCheck size={12} className="text-indigo-400" />
                  Secured with password authentication
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <Lock size={12} />
                Active
              </span>
            </div>
          </div>

          {/* 2. Google OAuth Identity */}
          <div className="p-5 rounded-xl bg-[var(--surface-default)] border border-[var(--border-default)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/50 flex-shrink-0 flex items-center justify-center w-11 h-11">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-100">
                    Google Account
                  </h4>
                  {isGoogleConnected ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                      <CheckCircle2 size={10} />
                      Connected
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700 uppercase tracking-wider">
                      Not Linked
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 mt-1">
                  {isGoogleConnected
                    ? googleIdentity?.email || "Connected via OAuth 2.0"
                    : "Sign in with your Google account seamlessly in one click."}
                </p>

                {isGoogleConnected && googleIdentity?.createdAt && (
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                    <Calendar size={12} />
                    Linked on {new Date(googleIdentity.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            <div className="self-end sm:self-center">
              {isGoogleConnected ? (
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-rose-400 border border-[var(--border-default)] hover:border-rose-500/30 rounded-xl transition-all uppercase tracking-wider"
                >
                  Unlink
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleConnectGoogle}
                  disabled={isLinking}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-sm disabled:opacity-50 uppercase tracking-wider"
                >
                  <ExternalLink size={13} />
                  <span>{isLinking ? "Connecting..." : "Connect Google"}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
