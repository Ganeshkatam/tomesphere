import { GoalProgressDto } from "@/modules/progress/application/queries/GetReadingGoalQuery/dto";
import { Target } from "lucide-react";
import Link from "next/link";

interface GoalWidgetProps {
  promise: Promise<GoalProgressDto | null>;
}

export async function GoalWidget({ promise }: GoalWidgetProps) {
  let result: any = null;
  let isError = false;
  try {
    result = await promise;
  } catch (e) {
    isError = true;
  }
  return (
    <div className="p-6 rounded-3xl bg-[var(--surface-raised)] border border-[var(--border-default)]">
      Mock UI
    </div>
  );
}
export function GoalSkeleton() {
  return (
    <div className="p-6 rounded-3xl bg-[var(--surface-raised)] border border-[var(--border-default)] h-full min-h-[200px] animate-pulse">
      <div className="h-6 bg-[var(--surface-overlay)] rounded w-1/3 mb-6"></div>
      <div className="h-24 bg-[var(--surface-overlay)] rounded w-full"></div>
    </div>
  );
}
