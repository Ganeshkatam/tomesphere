import { getSystemHealth, HealthIndicator, HealthLevel } from "../../features/ops/health-queries";

export default async function SystemHealthPage() {
  const health = await getSystemHealth();

  const healthy = health.indicators.filter(i => i.level === "healthy");
  const warnings = health.indicators.filter(i => i.level === "warning");
  const critical = health.indicators.filter(i => i.level === "critical");

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900">System Health</h1>
        <OverallBadge level={health.overallLevel} />
      </div>

      {/* Critical */}
      {critical.length > 0 && (
        <Section title="Critical" color="red" indicators={critical} />
      )}

      {/* Warning */}
      {warnings.length > 0 && (
        <Section title="Warning" color="amber" indicators={warnings} />
      )}

      {/* Healthy */}
      <Section title="Healthy" color="green" indicators={healthy} />

      <p className="text-xs text-slate-400 text-center mt-8">
        Last checked: {new Date().toLocaleString()}
      </p>
    </div>
  );
}

function OverallBadge({ level }: { level: HealthLevel }) {
  const styles: Record<HealthLevel, string> = {
    healthy: "bg-green-100 text-green-800 border-green-300",
    warning: "bg-amber-100 text-amber-800 border-amber-300",
    critical: "bg-red-100 text-red-800 border-red-300",
  };
  return (
    <span className={"text-sm px-3 py-1 rounded-full border font-medium " + styles[level]}>
      {level.toUpperCase()}
    </span>
  );
}

function Section({ title, color, indicators }: { title: string; color: string; indicators: HealthIndicator[] }) {
  const bgMap: Record<string, string> = {
    red: "bg-red-50 border-red-200",
    amber: "bg-amber-50 border-amber-200",
    green: "bg-green-50 border-green-200",
  };
  const textMap: Record<string, string> = {
    red: "text-red-800",
    amber: "text-amber-800",
    green: "text-green-800",
  };

  return (
    <div>
      <h2 className={"text-lg font-semibold mb-3 " + (textMap[color] || "")}>{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {indicators.map(ind => (
          <div key={ind.name} className={"rounded-lg border p-4 " + (bgMap[color] || "")}>
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">{ind.name}</span>
              <span className={"text-lg font-bold " + (textMap[color] || "")}>{ind.value}</span>
            </div>
            {ind.detail && <p className="text-xs text-slate-500 mt-1">{ind.detail}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
