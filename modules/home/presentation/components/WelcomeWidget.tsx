import React from "react";
import { Sparkles } from "lucide-react";

interface WelcomeWidgetProps {
  user: {
    user_metadata?: {
      full_name?: string;
      display_name?: string;
    };
    email?: string;
  };
}

export function WelcomeWidget({ user }: WelcomeWidgetProps) {
  const name =
    user?.user_metadata?.full_name?.split(" ")[0] ||
    user?.user_metadata?.display_name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "Reader";

  // Determine time of day
  const hour = new Date().getHours();
  let greeting = "Good evening";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 mb-2.5">
          <Sparkles size={13} className="text-indigo-500" />
          <span>Reader Workspace</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
          {greeting}, {name}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-1.5 font-medium">
          Welcome back to your personal sanctuary. Continue your reading journey.
        </p>
      </div>
    </div>
  );
}
