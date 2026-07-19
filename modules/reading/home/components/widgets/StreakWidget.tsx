import { ReadingStreakDto } from "@/modules/progress/application/queries/GetReadingStreakQuery/dto";
import { Flame } from "lucide-react";

interface StreakWidgetProps {
  result: ReadingStreakDto | null;
}

export function StreakWidget({ result }: StreakWidgetProps) {
  if (!result) {
    return (
      <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 h-full">
        <p className="font-semibold">Unable to load streak.</p>
        <p className="text-sm opacity-80">{"Error"}</p>
      </div>
    );
  }

  const data = result || { currentStreakDays: 0, longestStreakDays: 0 };

  return (
    <div className="flex flex-col p-6 rounded-3xl bg-[var(--surface-raised)] border border-[var(--border-default)] h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400">
          <Flame size={20} />
        </div>
        <h3 className="font-semibold text-[var(--text-primary)]">Reading Streak</h3>
      </div>

      <div className="flex-1 flex items-center justify-between">
        <div>
          <p className="text-sm text-[var(--text-secondary)] font-medium mb-1">Current</p>
          <p className="text-4xl font-display font-bold text-[var(--text-primary)]">
            {data.currentStreakDays} <span className="text-lg text-[var(--text-secondary)] font-medium">Days</span>
          </p>
        </div>
        
        <div className="h-12 w-px bg-[var(--border-default)] mx-4"></div>
        
        <div className="text-right">
          <p className="text-sm text-[var(--text-secondary)] font-medium mb-1">Longest</p>
          <p className="text-2xl font-display font-bold text-slate-300">
            {data.longestStreakDays} <span className="text-sm text-[var(--text-secondary)] font-medium">Days</span>
          </p>
        </div>
      </div>
    </div>
  );
}
