"use client";

import { useState } from "react";
import { ShieldAlert, Send, CheckCircle2, ArrowLeft, MessageSquareWarning } from "lucide-react";
import Link from "next/link";

export default function ReportPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock network request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col pt-12 pb-24">
      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-3xl w-full mx-auto px-4 sm:px-6 relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-rose-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-500/20 mb-6 transform -rotate-3">
            <ShieldAlert size={32} className="transform rotate-3" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
            Report an Issue
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Found a bug, encountered abusive content, or discovered a security vulnerability? Let us know so we can fix it immediately.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/50 dark:shadow-black/40 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
          {isSubmitted ? (
            <div className="text-center py-12 animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Report Submitted</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-8">
                Thank you for helping keep TomeSphere safe and reliable. Our team will review your report shortly.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-medium px-6 py-3 rounded-xl transition-colors"
              >
                Submit Another Report
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                  What are you reporting?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['Bug / Glitch', 'Abuse / Spam', 'Security Vulnerability'].map((type, i) => (
                    <label key={type} className="relative flex cursor-pointer rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors">
                      <input type="radio" name="reportType" value={type} className="peer sr-only" defaultChecked={i === 0} />
                      <div className="text-sm font-medium text-slate-600 dark:text-slate-300 peer-checked:text-indigo-600 dark:peer-checked:text-indigo-400">
                        {type}
                      </div>
                      <div className="absolute inset-0 rounded-xl border-2 border-transparent peer-checked:border-indigo-600 dark:peer-checked:border-indigo-500 pointer-events-none" />
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-semibold text-slate-900 dark:text-white">
                  Issue Title
                </label>
                <input
                  type="text"
                  id="title"
                  required
                  placeholder="Brief summary of the issue"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-semibold text-slate-900 dark:text-white">
                  Detailed Description
                </label>
                <textarea
                  id="description"
                  required
                  rows={5}
                  placeholder="Please provide as much detail as possible, including steps to reproduce if applicable."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-slate-900 dark:text-white">
                  Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="If you'd like us to follow up with you"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={18} />
                      Submit Report
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
