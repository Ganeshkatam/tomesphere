import { GoalProgressDto } from "@/modules/progress/application/queries/GetReadingGoalQuery/dto";
import { Target } from "lucide-react";
import Link from "next/link";

interface GoalWidgetProps {
  result: GoalProgressDto | null;
}

export function GoalWidget({ result }: GoalWidgetProps) {
  if (!result) {
    return (
      <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 h-full">
        <p className="font-semibold">Unable to load goal.</p>
        <p className="text-sm opacity-80">{"Error"}</p>
      </div>
    );
  }

  const data = result;

  return (
    <div className="flex flex-col p-6 rounded-3xl bg-[var(--surface-raised)] border border-[var(--border-default)] h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
          <Target size={20} />
        </div>
        <h3 className="font-semibold text-[var(--text-primary)]">Today's Goal</h3>
      </div>

      {!data || !data.hasGoal ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <p className="text-sm text-[var(--text-secondary)] mb-4">No reading goal yet.</p>
          <Link
            href="/me/profile#goals"
            className="px-4 py-2 rounded-full border border-[var(--border-default)] hover:border-[var(--border-hover)] text-sm font-medium transition-colors"
          >
            Create Goal
          </Link>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex justify-between items-baseline mb-4">
            <span className="text-3xl font-display font-bold text-[var(--text-primary)]">
              {data.currentValue} <span className="text-lg text-[var(--text-secondary)] font-medium">/ {data.targetValue}</span>
            </span>
            <span className="text-sm font-medium text-orange-400 uppercase tracking-wider">{data.type}</span>
          </div>

          <div className="h-2.5 w-full bg-black/20 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${data.percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs font-medium text-[var(--text-secondary)]">
            <span>Progress</span>
            <span>{data.percentage}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
