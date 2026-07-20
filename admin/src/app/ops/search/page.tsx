import { getSearchMetrics, getSlowQueries, getZeroResultQueries, getTopSearches } from "../../../features/ops/search-queries";

export default async function SearchDiagnosticsPage() {
  const [metrics, slowQueries, zeroResults, topSearches] = await Promise.all([
    getSearchMetrics(),
    getSlowQueries(),
    getZeroResultQueries(),
    getTopSearches(),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Search Diagnostics</h1>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <MetricCard label="Total Searches" value={metrics.totalSearches.toString()} />
        <MetricCard label="Avg Latency" value={metrics.avgLatencyMs + "ms"} warn={metrics.avgLatencyMs > 200} />
        <MetricCard label="Zero-Result Rate" value={metrics.zeroResultRate + "%"} warn={metrics.zeroResultRate > 20} />
        <MetricCard label="Slow Query Rate" value={metrics.slowQueryRate + "%"} warn={metrics.slowQueryRate > 10} />
        <MetricCard label="Typo Recovery" value={metrics.typoRecoveryRate + "%"} />
      </div>

      {/* Top Searches */}
      {topSearches.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b"><h2 className="font-semibold">Top Searches</h2></div>
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-3">Query</th>
                <th className="text-left p-3">Count</th>
                <th className="text-left p-3">Avg Time</th>
              </tr>
            </thead>
            <tbody>
              {topSearches.map(s => (
                <tr key={s.normalized_query} className="border-t hover:bg-slate-50">
                  <td className="p-3 font-mono">{s.normalized_query}</td>
                  <td className="p-3">{s.count}</td>
                  <td className="p-3">{s.avg_execution_time_ms}ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Slow Queries */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b"><h2 className="font-semibold text-amber-700">Slow Queries (&gt;200ms)</h2></div>
        <table className="w-full text-sm">
          <thead className="bg-amber-50">
            <tr>
              <th className="text-left p-3">Query</th>
              <th className="text-left p-3">Time</th>
              <th className="text-left p-3">Results</th>
              <th className="text-left p-3">When</th>
            </tr>
          </thead>
          <tbody>
            {slowQueries.map((q, i) => (
              <tr key={i} className="border-t">
                <td className="p-3 font-mono text-xs">{q.query}</td>
                <td className="p-3 font-bold text-amber-700">{q.execution_time_ms}ms</td>
                <td className="p-3">{q.result_count}</td>
                <td className="p-3 text-xs">{q.searched_at ? new Date(q.searched_at).toLocaleString() : "-"}</td>
              </tr>
            ))}
            {slowQueries.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-slate-400">No slow queries</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Zero-Result Queries */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b"><h2 className="font-semibold text-red-700">Zero-Result Queries</h2></div>
        <table className="w-full text-sm">
          <thead className="bg-red-50">
            <tr>
              <th className="text-left p-3">Query</th>
              <th className="text-left p-3">Time</th>
              <th className="text-left p-3">When</th>
            </tr>
          </thead>
          <tbody>
            {zeroResults.map((q, i) => (
              <tr key={i} className="border-t">
                <td className="p-3 font-mono text-xs">{q.query}</td>
                <td className="p-3">{q.execution_time_ms}ms</td>
                <td className="p-3 text-xs">{q.searched_at ? new Date(q.searched_at).toLocaleString() : "-"}</td>
              </tr>
            ))}
            {zeroResults.length === 0 && (
              <tr><td colSpan={3} className="p-8 text-center text-slate-400">No zero-result queries</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MetricCard({ label, value, warn = false }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className={"rounded-lg border p-4 " + (warn ? "bg-amber-50 border-amber-200" : "bg-white border-slate-200")}>
      <div className="text-sm text-slate-500">{label}</div>
      <div className={"text-2xl font-bold " + (warn ? "text-amber-700" : "text-slate-800")}>{value}</div>
    </div>
  );
}
