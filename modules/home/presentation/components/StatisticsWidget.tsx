import { ReadingStatisticsDto } from "@/modules/progress/application/queries/GetReadingStatisticsQuery/dto";
import { BarChart3 } from "lucide-react";

interface StatisticsWidgetProps {
  promise: Promise<ReadingStatisticsDto | null>;
}

export async function StatisticsWidget({ promise }: StatisticsWidgetProps) {
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
export function StatisticsSkeleton() {
  return (
    <div className="p-6 rounded-3xl bg-[var(--surface-raised)] border border-[var(--border-default)] h-full min-h-[200px] animate-pulse">
      <div className="h-6 bg-[var(--surface-overlay)] rounded w-1/3 mb-6"></div>
      <div className="h-24 bg-[var(--surface-overlay)] rounded w-full"></div>
    </div>
  );
}
