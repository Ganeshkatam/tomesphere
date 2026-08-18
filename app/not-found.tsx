import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--surface-canvas)] flex flex-col items-center justify-center p-4 text-center">
      <div className="space-y-6 max-w-md">
        {/* Icon */}
        <div className="w-20 h-20 bg-[var(--surface-default)] rounded-full flex items-center justify-center mx-auto border border-[var(--border-default)] text-indigo-600 dark:text-indigo-400 shadow-sm">
          <SearchX size={36} />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-[var(--text-primary)]">Page Not Found</h2>
          <p className="text-[var(--text-secondary)]">
            The page you are looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        {/* Action */}
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-md active:scale-95"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
