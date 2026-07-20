import { getOutboxStats, getOutboxEvents } from "../../../features/ops/outbox-queries";
import { retryOutboxEventAction } from "../../../features/ops/outbox-actions";

function formatAge(ms: number): string {
  if (ms < 60000) return Math.round(ms / 1000) + "s";
  if (ms < 3600000) return Math.round(ms / 60000) + "m";
  if (ms < 86400000) return Math.round(ms / 3600000) + "h";
  return Math.round(ms / 86400000) + "d";
}

export default async function OutboxPage() {
  const [stats, { events }] = await Promise.all([
    getOutboxStats(),
    getOutboxEvents(),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Outbox Monitor</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-sm text-yellow-700">Pending</div>
          <div className="text-3xl font-bold text-yellow-800">{stats.pending}</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-700">Processing</div>
          <div className="text-3xl font-bold text-blue-800">{stats.processing}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-sm text-green-700">Processed</div>
          <div className="text-3xl font-bold text-green-800">{stats.processed}</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-sm text-red-700">Failed</div>
          <div className="text-3xl font-bold text-red-800">{stats.failed}</div>
        </div>
        <div className="bg-red-100 border border-red-300 rounded-lg p-4">
          <div className="text-sm text-red-800">Permanent</div>
          <div className="text-3xl font-bold text-red-900">{stats.failed_permanent}</div>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b"><h2 className="font-semibold">Recent Events</h2></div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-3">Event Type</th>
              <th className="text-left p-3">Aggregate</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Age</th>
              <th className="text-left p-3">Retries</th>
              <th className="text-left p-3">Error</th>
              <th className="text-left p-3">Payload</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(evt => (
              <tr key={evt.id} className="border-t hover:bg-slate-50">
                <td className="p-3 font-mono text-xs">{evt.event_type}</td>
                <td className="p-3 text-xs">
                  <span className="text-slate-500">{evt.aggregate_type}/</span>
                  <span className="font-mono">{evt.aggregate_id.slice(0, 8)}</span>
                </td>
                <td className="p-3">
                  <span className={"text-xs px-2 py-0.5 rounded-full font-medium " + getStatusStyle(evt.status)}>
                    {evt.status}
                  </span>
                </td>
                <td className="p-3 text-xs font-mono">{formatAge(evt.age_ms || 0)}</td>
                <td className="p-3">{evt.retry_count}</td>
                <td className="p-3 text-xs text-red-600 max-w-xs truncate">{evt.last_error || "-"}</td>
                <td className="p-3">
                  <details>
                    <summary className="cursor-pointer text-xs text-blue-600">Inspect</summary>
                    <pre className="mt-2 text-xs bg-slate-50 p-2 rounded overflow-auto max-h-40 max-w-sm">
                      {JSON.stringify(evt.payload, null, 2)}
                    </pre>
                  </details>
                </td>
                <td className="p-3">
                  {(evt.status === "failed" || evt.status === "failed_permanent") && (
                    <form action={async () => { "use server"; await retryOutboxEventAction(evt.id); }} className="inline">
                      <button className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">Retry</button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr><td colSpan={8} className="p-8 text-center text-slate-400">No outbox events</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getStatusStyle(status: string): string {
  const styles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    processed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    failed_permanent: "bg-red-200 text-red-900",
  };
  return styles[status] || "bg-gray-100";
}
