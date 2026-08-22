import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security & Trust - TomeSphere",
  description: "Learn how TomeSphere protects your data and privacy.",
};

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 text-center border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck size={32} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Security Center</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          This page is currently under construction. Soon, you will be able to review our enterprise-grade security protocols, compliance certifications, and data privacy commitments here.
        </p>
        <Link 
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-medium transition-transform hover:scale-105 active:scale-95"
        >
          <ArrowLeft size={18} />
          Go Back
        </Link>
      </div>
    </div>
  );
}
