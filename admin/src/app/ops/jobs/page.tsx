import { getJobStats, getJobs, getJobFailures, getAvgJobDuration } from "../../../features/ops/job-queries";
import { retryJobAction, cancelJobAction } from "../../../features/ops/job-actions";

export default async function JobsPage() {
  const [stats, { jobs }, { failures }, avgDurations] = await Promise.all([
    getJobStats(),
    getJobs(),
    getJobFailures(),
    getAvgJobDuration(),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Job Monitor</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Pending" value={stats.pending} color="yellow" />
        <StatCard label="Processing" value={stats.processing} color="blue" />
        <StatCard label="Completed" value={stats.completed} color="green" />
        <StatCard label="Failed" value={stats.failed} color="red" />
      </div>

      {/* Avg Duration by Type */}
      {avgDurations.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Average Job Duration</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {avgDurations.map(d => (
              <div key={d.job_type} className="text-center p-3 bg-slate-50 rounded">
                <div className="text-sm text-slate-500">{d.job_type}</div>
                <div className="text-xl font-bold text-slate-800">{d.avg_duration_ms}ms</div>
                <div className="text-xs text-slate-400">{d.count} completed</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Job Queue Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b"><h2 className="font-semibold">Job Queue</h2></div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-3">Type</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Attempts</th>
              <th className="text-left p-3">Scheduled</th>
              <th className="text-left p-3">Error</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr key={job.id} className="border-t hover:bg-slate-50">
                <td className="p-3 font-mono text-xs">{job.job_type}</td>
                <td className="p-3"><StatusBadge status={job.status} /></td>
                <td className="p-3">{job.attempts}</td>
                <td className="p-3 text-xs">{job.scheduled_at ? new Date(job.scheduled_at).toLocaleString() : "-"}</td>
                <td className="p-3 text-xs text-red-600 max-w-xs truncate">{job.last_error || "-"}</td>
                <td className="p-3 space-x-2">
                  {job.status === "failed" && (
                    <form action={async () => { "use server"; await retryJobAction(job.id); }} className="inline">
                      <button className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">Retry</button>
                    </form>
                  )}
                  {(job.status === "pending" || job.status === "processing") && (
                    <form action={async () => { "use server"; await cancelJobAction(job.id); }} className="inline">
                      <button className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200">Cancel</button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-slate-400">No jobs in queue</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Recent Failures */}
      {failures.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b"><h2 className="font-semibold text-red-700">Recent Failures</h2></div>
          <table className="w-full text-sm">
            <thead className="bg-red-50">
              <tr>
                <th className="text-left p-3">Type</th>
                <th className="text-left p-3">Error</th>
                <th className="text-left p-3">Worker</th>
                <th className="text-left p-3">Retries</th>
                <th className="text-left p-3">Failed At</th>
              </tr>
            </thead>
            <tbody>
              {failures.map(f => (
                <tr key={f.id} className="border-t">
                  <td className="p-3 font-mono text-xs">{f.job_type}</td>
                  <td className="p-3 text-xs text-red-600 max-w-md">
                    <details>
                      <summary className="cursor-pointer truncate">{f.error}</summary>
                      <pre className="mt-2 text-xs bg-red-50 p-2 rounded overflow-auto max-h-40">{f.stack_trace || "No stack trace"}</pre>
                    </details>
                  </td>
                  <td className="p-3 text-xs">{f.worker || "-"}</td>
                  <td className="p-3">{f.retry_count}</td>
                  <td className="p-3 text-xs">{new Date(f.failed_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    yellow: "bg-yellow-50 text-yellow-800 border-yellow-200",
    blue: "bg-blue-50 text-blue-800 border-blue-200",
    green: "bg-green-50 text-green-800 border-green-200",
    red: "bg-red-50 text-red-800 border-red-200",
  };
  return (
    <div className={"rounded-lg border p-4 " + (colors[color] || "")}>
      <div className="text-sm font-medium">{label}</div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    cancelled: "bg-gray-100 text-gray-800",
  };
  return (
    <span className={"text-xs px-2 py-0.5 rounded-full font-medium " + (styles[status] || "bg-gray-100")}>
      {status}
    </span>
  );
}
