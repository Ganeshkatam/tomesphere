"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyTokenHashServer } from "@/modules/authentication/presentation/actions/auth";
import { showError, showSuccess } from "@/lib/toast";
import { ShieldCheck, Loader2 } from "lucide-react";
import AuthTopBar from "@/modules/authentication/presentation/components/AuthTopBar";
import Image from "next/image";

function ConfirmAuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") || "magiclink";
  const next = searchParams.get("next") ?? "/discover";

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!tokenHash) {
      showError("Invalid or missing token.");
      router.push("/login");
    }
  }, [tokenHash, router]);

  const handleConfirm = async () => {
    if (!tokenHash) return;
    setLoading(true);

    try {
      const res = await verifyTokenHashServer(tokenHash, type as any);
      
      if (!res.success) {
        showError(res.error?.message || "Link is invalid or has expired.");
        router.push("/login?error=Invalid_or_expired_link");
        return;
      }

      showSuccess("Successfully verified!");
      // We must force a hard refresh or router push to establish the session in the client context
      window.location.href = next;
    } catch (err: any) {
      showError(err.message || "Failed to verify.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--surface-canvas)] flex items-center justify-center p-4 sm:p-6 md:py-12 pt-20 sm:pt-24 relative overflow-hidden">
      <AuthTopBar />
      
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        <Image
          src="/auth_signup_bg.jpg"
          alt="Library Background"
          fill
          className="object-cover object-center opacity-50 dark:opacity-40 transition-opacity duration-500 scale-105"
          priority
        />
        <div className="absolute inset-0 bg-slate-900/30 dark:bg-slate-950/75 backdrop-blur-[3px] transition-colors" />
      </div>

      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/60 relative z-10 text-center">
        <div className="w-16 h-16 mx-auto mb-6 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <ShieldCheck size={32} />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Secure Login Verification
        </h1>
        
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-8">
          To protect your account from automated scanners, please click the button below to confirm your login.
        </p>

        <button
          onClick={handleConfirm}
          disabled={loading || !tokenHash}
          className="w-full bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white py-3.5 rounded-xl font-semibold text-sm transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Verifying...
            </>
          ) : (
            "Complete Login"
          )}
        </button>
      </div>
    </div>
  );
}

export default function ConfirmAuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--surface-canvas)] flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    }>
      <ConfirmAuthContent />
    </Suspense>
  );
}
