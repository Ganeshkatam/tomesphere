import { getProjectionHealth, getSearchProjectionStats } from "../../../features/ops/projection-queries";
import { enqueueSearchRebuildAction, enqueueMvRefreshAction } from "../../../features/ops/projection-actions";

export default async function ProjectionsPage() {
  const [health, searchStats] = await Promise.all([
    getProjectionHealth(),
    getSearchProjectionStats(),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Projection Management</h1>

      {/* Projection Lag */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Projection Lag</h2>
        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="text-sm text-slate-500">Latest Event</div>
            <div className="text-lg font-mono">{health.latestEventId ? health.latestEventId.slice(0, 8) + "..." : "None"}</div>
          </div>
          <div className="text-3xl text-slate-300">&rarr;</div>
          <div className="text-center">
            <div className="text-sm text-slate-500">Events Behind</div>
            <div className={"text-3xl font-bold " + (health.lag === 0 ? "text-green-600" : health.lag < 10 ? "text-yellow-600" : "text-red-600")}>
              {health.lag}
            </div>
          </div>
        </div>
      </div>

      {/* Checkpoints */}
      {health.checkpoints.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b"><h2 className="font-semibold">Checkpoints</h2></div>
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-3">Projection</th>
                <th className="text-left p-3">Last Event</th>
                <th className="text-left p-3">Updated</th>
              </tr>
            </thead>
            <tbody>
              {health.checkpoints.map(cp => (
                <tr key={cp.projection_name} className="border-t">
                  <td className="p-3 font-medium">{cp.projection_name}</td>
                  <td className="p-3 font-mono text-xs">{cp.last_processed_event_id?.slice(0, 12) || "None"}</td>
                  <td className="p-3 text-xs">{cp.updated_at ? new Date(cp.updated_at).toLocaleString() : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Search Index Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Search Index</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-slate-50 rounded">
            <div className="text-sm text-slate-500">Documents</div>
            <div className="text-2xl font-bold text-slate-800">{searchStats.totalDocuments}</div>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded">
            <div className="text-sm text-slate-500">Avg Age</div>
            <div className="text-2xl font-bold text-slate-800">{searchStats.avgAgeDays}d</div>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded">
            <div className="text-sm text-slate-500">Oldest</div>
            <div className="text-xs text-slate-600 mt-1">{searchStats.oldestIndexedAt ? new Date(searchStats.oldestIndexedAt).toLocaleString() : "-"}</div>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded">
            <div className="text-sm text-slate-500">Newest</div>
            <div className="text-xs text-slate-600 mt-1">{searchStats.newestIndexedAt ? new Date(searchStats.newestIndexedAt).toLocaleString() : "-"}</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Administrative Actions</h2>
        <div className="flex flex-wrap gap-4">
          <form action={async () => { "use server"; await enqueueSearchRebuildAction(); }}>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
              Enqueue Search Index Rebuild
            </button>
          </form>
          <form action={async () => { "use server"; await enqueueMvRefreshAction("refresh_trending_searches_v1"); }}>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
              Enqueue Refresh Trending
            </button>
          </form>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Actions enqueue jobs into the job queue. They will be processed by the next worker run.
        </p>
      </div>
    </div>
  );
}
