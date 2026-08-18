"use client";

import { useState, useEffect } from "react";
import { Check, X, Loader2, RefreshCw } from "lucide-react";
import { showError, showSuccess } from "@/lib/toast";

export default function VerificationStatus() {
  const [status, setStatus] = useState({
    emailVerified: false,
    phoneVerified: false,
    loading: true,
  });

  const checkVerification = async () => {
    const { getUserVerificationStatus } =
      await import("@/modules/authentication/presentation/actions/auth");
    const res = await getUserVerificationStatus();

    if (true && res) {
      setStatus({
        emailVerified: res.emailVerified,
        phoneVerified: res.phoneVerified,
        loading: false,
      });
    }
  };

  useEffect(() => {
    // Initial check
    checkVerification();

    // Secure polling every 10s instead of insecure client-side auth.users subscription
    const interval = setInterval(() => {
      checkVerification();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const resendEmail = async () => {
    const { resendVerificationEmail } =
      await import("@/modules/authentication/presentation/actions/auth");

    try {
      await resendVerificationEmail();
      showSuccess("Verification email sent!");
    } catch (err) {
      showError("Failed to send email");
    }
  };

  if (status.loading)
    return <div className="h-20 animate-pulse bg-white/5 rounded-xl" />;

  return (
    <div className="glass rounded-xl p-6 border border-[var(--border-default)] space-y-4">
      <h3 className="text-lg font-bold flex items-center gap-2">
        <RefreshCw size={18} className="text-primary" />
        Verification Status
      </h3>

      {/* Email Status */}
      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-full ${status.emailVerified ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}
          >
            {status.emailVerified ? <Check size={16} /> : <X size={16} />}
          </div>
          <div>
            <p className="font-medium">Email Verification</p>
            <p className="text-xs text-slate-400">
              {status.emailVerified ? "Verified" : "Pending verification"}
            </p>
          </div>
        </div>
        {!status.emailVerified && (
          <button
            onClick={resendEmail}
            className="text-xs btn btn-secondary py-1 px-3"
          >
            Resend
          </button>
        )}
      </div>

      {/* Phone Status */}
      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-full ${status.phoneVerified ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}
          >
            {status.phoneVerified ? <Check size={16} /> : <X size={16} />}
          </div>
          <div>
            <p className="font-medium">Phone Verification</p>
            <p className="text-xs text-slate-400">
              {status.phoneVerified ? "Verified" : "Pending verification"}
            </p>
          </div>
        </div>
        {!status.phoneVerified && (
          <button
            onClick={() => (window.location.href = "/me/security")}
            className="text-xs btn btn-secondary py-1 px-3"
          >
            Verify
          </button>
        )}
      </div>
    </div>
  );
}
