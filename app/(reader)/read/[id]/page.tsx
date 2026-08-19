import { executeReaderFacade } from "@/modules/reader/application/facades";
import { ClientReaderShell } from "@/modules/reader/components/ClientReaderShell";
import Link from "next/link";
import { BookOpen, ArrowLeft, LogIn } from "lucide-react";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let data: Awaited<ReturnType<typeof executeReaderFacade>> | null = null;
  let errorType: "auth" | "not_found" | null = null;

  try {
    data = await executeReaderFacade(id);
  } catch (err: any) {
    errorType = err?.message === "Unauthorized" ? "auth" : "not_found";
  }

  if (errorType || !data) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center px-4 transition-colors">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500">
            <BookOpen size={28} />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
              {errorType === "auth"
                ? "Sign in to start reading"
                : "This book could not be loaded"}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-sans">
              {errorType === "auth"
                ? "You need to be signed in to access the reader. Sign in to continue where you left off."
                : "The requested book may have been removed or the link is invalid. Head back to browse the full archive."}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            {errorType === "auth" ? (
              <Link
                href={`/login?redirect=/read/${id}`}
                className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
              >
                <LogIn size={16} />
                <span>Sign In</span>
              </Link>
            ) : null}
            <Link
              href="/me"
              className="h-11 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back to Library</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <ClientReaderShell data={data} />;
}

