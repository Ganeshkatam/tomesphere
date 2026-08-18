"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--surface-canvas)] flex flex-col items-center justify-center p-4 text-center">
      <div className="space-y-6 max-w-md">
        {/* Icon */}
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20 text-red-500 shadow-sm">
          <AlertCircle size={36} />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-[var(--text-primary)]">
            Something went wrong
          </h2>
          <p className="text-[var(--text-secondary)]">
            We encountered an unexpected error. Our team has been notified.
          </p>
          <p className="text-xs text-red-500 mt-4 bg-red-500/10 p-3 rounded-xl break-all border border-red-500/20">
            {error.message || "Unknown error"}
          </p>
        </div>

        {/* Action */}
        <button
          onClick={reset}
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
