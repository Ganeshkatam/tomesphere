const fs = require('fs');
const path = require('path');

function mkdirp(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function writeFile(filePath, content) {
  mkdirp(path.dirname(filePath));
  fs.writeFileSync(filePath, content.trim() + '\n');
  console.log(`Created: ${filePath}`);
}

// ============================================================
// 1. Shared: admin Supabase client helper
// ============================================================
writeFile('admin/src/lib/supabase-admin.ts', `
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";

/**
 * Service-role Supabase client for admin server-side operations.
 * Bypasses RLS. Only use in Server Components and Server Actions.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
`);

// ============================================================
// 2. Job Queries
// ============================================================
writeFile('admin/src/features/ops/job-queries.ts', `
import { createAdminClient } from "../../lib/supabase-admin";

export interface JobStats {
  pending: number;
  processing: number;
  completed: number;
  failed: number;
}

export interface JobRecord {
  id: string;
  job_type: string;
  status: string;
  attempts: number;
  last_error: string | null;
  scheduled_at: string;
  started_at: string | null;
  completed_at: string | null;
  created_at: string | null;
  payload: any;
}

export interface JobFailureRecord {
  id: string;
  job_type: string;
  error: string;
  stack_trace: string | null;
  worker: string | null;
  retry_count: number;
  failed_at: string;
  payload: any;
}

export interface AvgDuration {
  job_type: string;
  avg_duration_ms: number;
  count: number;
}

export async function getJobStats(): Promise<JobStats> {
  const supabase = createAdminClient();
  const statuses = ["pending", "processing", "completed", "failed"] as const;
  const results = await Promise.all(
    statuses.map(s =>
      supabase.from("job_queue").select("*", { count: "exact", head: true }).eq("status", s)
    )
  );
  return {
    pending: results[0].count || 0,
    processing: results[1].count || 0,
    completed: results[2].count || 0,
    failed: results[3].count || 0,
  };
}

export async function getJobs(status?: string, page = 0, limit = 20): Promise<{ jobs: JobRecord[]; total: number }> {
  const supabase = createAdminClient();
  let query = supabase.from("job_queue").select("*", { count: "exact" });
  if (status) query = query.eq("status", status);
  query = query.order("created_at", { ascending: false }).range(page * limit, (page + 1) * limit - 1);
  const { data, count, error } = await query;
  if (error) throw new Error(error.message);
  return { jobs: (data || []) as JobRecord[], total: count || 0 };
}

export async function getJobFailures(page = 0, limit = 20): Promise<{ failures: JobFailureRecord[]; total: number }> {
  const supabase = createAdminClient();
  const { data, count, error } = await supabase
    .from("job_failures")
    .select("*", { count: "exact" })
    .order("failed_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);
  if (error) throw new Error(error.message);
  return { failures: (data || []) as JobFailureRecord[], total: count || 0 };
}

export async function getAvgJobDuration(): Promise<AvgDuration[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("job_queue")
    .select("job_type, started_at, completed_at")
    .eq("status", "completed")
    .not("started_at", "is", null)
    .not("completed_at", "is", null);
  if (error) throw new Error(error.message);

  const byType: Record<string, { total: number; count: number }> = {};
  for (const row of data || []) {
    if (!row.started_at || !row.completed_at) continue;
    const ms = new Date(row.completed_at).getTime() - new Date(row.started_at).getTime();
    if (!byType[row.job_type]) byType[row.job_type] = { total: 0, count: 0 };
    byType[row.job_type].total += ms;
    byType[row.job_type].count++;
  }

  return Object.entries(byType).map(([job_type, v]) => ({
    job_type,
    avg_duration_ms: Math.round(v.total / v.count),
    count: v.count,
  }));
}
`);

// ============================================================
// 3. Job Actions
// ============================================================
writeFile('admin/src/features/ops/job-actions.ts', `
"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "../../lib/supabase-admin";

export async function retryJobAction(jobId: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("job_queue")
    .update({ status: "pending", last_error: null })
    .eq("id", jobId);
  if (error) throw new Error("Failed to retry job: " + error.message);
  revalidatePath("/ops/jobs");
  return { success: true };
}

export async function cancelJobAction(jobId: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("job_queue")
    .update({ status: "cancelled" as any })
    .eq("id", jobId);
  if (error) throw new Error("Failed to cancel job: " + error.message);
  revalidatePath("/ops/jobs");
  return { success: true };
}
`);

// ============================================================
// 4. Outbox Queries
// ============================================================
writeFile('admin/src/features/ops/outbox-queries.ts', `
import { createAdminClient } from "../../lib/supabase-admin";

export interface OutboxStats {
  pending: number;
  processing: number;
  processed: number;
  failed: number;
  failed_permanent: number;
}

export interface OutboxEventRecord {
  id: string;
  aggregate_type: string;
  aggregate_id: string;
  event_type: string;
  event_version: number;
  payload: any;
  occurred_at: string;
  status: string;
  retry_count: number;
  last_error: string | null;
  created_at: string | null;
  processed_at: string | null;
  /** Computed: milliseconds since occurred_at */
  age_ms?: number;
}

export async function getOutboxStats(): Promise<OutboxStats> {
  const supabase = createAdminClient();
  const statuses = ["pending", "processing", "processed", "failed", "failed_permanent"] as const;
  const results = await Promise.all(
    statuses.map(s =>
      supabase.from("outbox_events").select("*", { count: "exact", head: true }).eq("status", s)
    )
  );
  return {
    pending: results[0].count || 0,
    processing: results[1].count || 0,
    processed: results[2].count || 0,
    failed: results[3].count || 0,
    failed_permanent: results[4].count || 0,
  };
}

export async function getOutboxEvents(
  status?: string, page = 0, limit = 20
): Promise<{ events: OutboxEventRecord[]; total: number }> {
  const supabase = createAdminClient();
  let query = supabase.from("outbox_events").select("*", { count: "exact" });
  if (status) query = query.eq("status", status);
  query = query.order("created_at", { ascending: false }).range(page * limit, (page + 1) * limit - 1);
  const { data, count, error } = await query;
  if (error) throw new Error(error.message);

  const now = Date.now();
  const events = (data || []).map((e: any) => ({
    ...e,
    age_ms: e.occurred_at ? now - new Date(e.occurred_at).getTime() : 0,
  }));

  return { events, total: count || 0 };
}
`);

// ============================================================
// 5. Outbox Actions
// ============================================================
writeFile('admin/src/features/ops/outbox-actions.ts', `
"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "../../lib/supabase-admin";

export async function retryOutboxEventAction(eventId: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("outbox_events")
    .update({ status: "pending", last_error: null })
    .eq("id", eventId);
  if (error) throw new Error("Failed to retry outbox event: " + error.message);
  revalidatePath("/ops/outbox");
  return { success: true };
}
`);

// ============================================================
// 6. Projection Queries
// ============================================================
writeFile('admin/src/features/ops/projection-queries.ts', `
import { createAdminClient } from "../../lib/supabase-admin";

export interface ProjectionCheckpoint {
  projection_name: string;
  last_processed_event_id: string | null;
  updated_at: string | null;
}

export interface ProjectionHealth {
  checkpoints: ProjectionCheckpoint[];
  latestEventId: string | null;
  lag: number; // events behind
}

export interface SearchProjectionStats {
  totalDocuments: number;
  avgAgeDays: number;
  oldestIndexedAt: string | null;
  newestIndexedAt: string | null;
}

export async function getProjectionHealth(): Promise<ProjectionHealth> {
  const supabase = createAdminClient();

  const [checkpointResult, latestEventResult] = await Promise.all([
    supabase.from("projection_checkpoints").select("*"),
    supabase.from("outbox_events").select("id").order("created_at", { ascending: false }).limit(1),
  ]);

  const checkpoints = (checkpointResult.data || []) as ProjectionCheckpoint[];
  const latestEventId = latestEventResult.data?.[0]?.id || null;

  // Calculate lag: count events after the last checkpoint
  let lag = 0;
  if (checkpoints.length > 0 && checkpoints[0].last_processed_event_id) {
    const { count } = await supabase
      .from("outbox_events")
      .select("*", { count: "exact", head: true })
      .gt("created_at", checkpoints[0].updated_at || "1970-01-01");
    lag = count || 0;
  } else {
    // No checkpoint: all events are lag
    const { count } = await supabase
      .from("outbox_events")
      .select("*", { count: "exact", head: true });
    lag = count || 0;
  }

  return { checkpoints, latestEventId, lag };
}

export async function getSearchProjectionStats(): Promise<SearchProjectionStats> {
  const supabase = createAdminClient();

  const [countResult, oldestResult, newestResult] = await Promise.all([
    supabase.from("discovery_search_documents").select("*", { count: "exact", head: true }),
    supabase.from("discovery_search_documents").select("indexed_at").order("indexed_at", { ascending: true }).limit(1),
    supabase.from("discovery_search_documents").select("indexed_at").order("indexed_at", { ascending: false }).limit(1),
  ]);

  const totalDocuments = countResult.count || 0;
  const oldest = oldestResult.data?.[0]?.indexed_at || null;
  const newest = newestResult.data?.[0]?.indexed_at || null;

  let avgAgeDays = 0;
  if (oldest && newest) {
    const avgMs = (Date.now() - new Date(oldest).getTime() + Date.now() - new Date(newest).getTime()) / 2;
    avgAgeDays = Math.round(avgMs / (1000 * 60 * 60 * 24) * 10) / 10;
  }

  return { totalDocuments, avgAgeDays, oldestIndexedAt: oldest, newestIndexedAt: newest };
}
`);

// ============================================================
// 7. Projection Actions
// ============================================================
writeFile('admin/src/features/ops/projection-actions.ts', `
"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "../../lib/supabase-admin";

export async function enqueueSearchRebuildAction() {
  const supabase = createAdminClient();

  // Fetch all published book IDs and enqueue a rebuild job for each
  const { data: books, error: fetchError } = await supabase
    .from("books")
    .select("id")
    .eq("is_published", true);

  if (fetchError) throw new Error("Failed to fetch books: " + fetchError.message);

  for (const book of books || []) {
    const { error } = await supabase.from("job_queue").insert({
      job_type: "PROJECTION_REBUILD",
      payload: { entityId: book.id, projectionName: "discovery_search" },
      status: "pending",
      scheduled_at: new Date().toISOString(),
    });
    if (error) console.error("Failed to enqueue rebuild for", book.id, error.message);
  }

  revalidatePath("/ops/projections");
  return { success: true, count: books?.length || 0 };
}

export async function enqueueMvRefreshAction(rpcName: string) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("job_queue").insert({
    job_type: "MV_REFRESH",
    payload: { rpcName },
    status: "pending",
    scheduled_at: new Date().toISOString(),
  });

  if (error) throw new Error("Failed to enqueue MV refresh: " + error.message);
  revalidatePath("/ops/projections");
  return { success: true };
}
`);

// ============================================================
// 8. Search Queries
// ============================================================
writeFile('admin/src/features/ops/search-queries.ts', `
import { createAdminClient } from "../../lib/supabase-admin";

export interface SearchMetrics {
  totalSearches: number;
  avgLatencyMs: number;
  zeroResultRate: number;
  slowQueryRate: number;
  typoRecoveryRate: number;
}

export interface SlowQueryRecord {
  query: string;
  execution_time_ms: number | null;
  result_count: number | null;
  searched_at: string | null;
}

export interface TopSearchRecord {
  normalized_query: string;
  count: number;
  avg_execution_time_ms: number;
}

export async function getSearchMetrics(): Promise<SearchMetrics> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("search_history")
    .select("execution_time_ms, result_count, is_zero_result, is_slow_query, sort_strategy");

  if (error || !data) return { totalSearches: 0, avgLatencyMs: 0, zeroResultRate: 0, slowQueryRate: 0, typoRecoveryRate: 0 };

  const total = data.length;
  if (total === 0) return { totalSearches: 0, avgLatencyMs: 0, zeroResultRate: 0, slowQueryRate: 0, typoRecoveryRate: 0 };

  const avgLatency = data.reduce((sum, r) => sum + (r.execution_time_ms || 0), 0) / total;
  const zeroResults = data.filter(r => r.is_zero_result).length;
  const slowQueries = data.filter(r => r.is_slow_query).length;
  // Typo recovery: queries that used 'typo' sort strategy or had typo fallback
  const typoRecoveries = data.filter(r => r.sort_strategy === "typo_fallback").length;

  return {
    totalSearches: total,
    avgLatencyMs: Math.round(avgLatency),
    zeroResultRate: Math.round((zeroResults / total) * 100),
    slowQueryRate: Math.round((slowQueries / total) * 100),
    typoRecoveryRate: total > 0 ? Math.round((typoRecoveries / total) * 100) : 0,
  };
}

export async function getSlowQueries(limit = 20): Promise<SlowQueryRecord[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("search_history")
    .select("query, execution_time_ms, result_count, searched_at")
    .eq("is_slow_query", true)
    .order("execution_time_ms", { ascending: false })
    .limit(limit);
  return (data || []) as SlowQueryRecord[];
}

export async function getZeroResultQueries(limit = 20): Promise<SlowQueryRecord[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("search_history")
    .select("query, execution_time_ms, result_count, searched_at")
    .eq("is_zero_result", true)
    .order("searched_at", { ascending: false })
    .limit(limit);
  return (data || []) as SlowQueryRecord[];
}

export async function getTopSearches(limit = 20): Promise<TopSearchRecord[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("search_history")
    .select("normalized_query, execution_time_ms");

  if (!data) return [];

  const grouped: Record<string, { count: number; totalMs: number }> = {};
  for (const row of data) {
    if (!grouped[row.normalized_query]) grouped[row.normalized_query] = { count: 0, totalMs: 0 };
    grouped[row.normalized_query].count++;
    grouped[row.normalized_query].totalMs += row.execution_time_ms || 0;
  }

  return Object.entries(grouped)
    .map(([q, v]) => ({
      normalized_query: q,
      count: v.count,
      avg_execution_time_ms: Math.round(v.totalMs / v.count),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
`);

// ============================================================
// 9. Health Queries
// ============================================================
writeFile('admin/src/features/ops/health-queries.ts', `
import { createAdminClient } from "../../lib/supabase-admin";

export type HealthLevel = "healthy" | "warning" | "critical";

export interface HealthIndicator {
  name: string;
  level: HealthLevel;
  value: string;
  detail?: string;
}

export interface SystemHealth {
  indicators: HealthIndicator[];
  overallLevel: HealthLevel;
}

export async function getSystemHealth(): Promise<SystemHealth> {
  const supabase = createAdminClient();
  const indicators: HealthIndicator[] = [];

  // 1. Database connectivity
  try {
    const start = Date.now();
    await supabase.from("books").select("id", { count: "exact", head: true });
    const latency = Date.now() - start;
    indicators.push({
      name: "Database",
      level: latency < 500 ? "healthy" : latency < 2000 ? "warning" : "critical",
      value: latency + "ms",
      detail: "Response time for SELECT query",
    });
  } catch {
    indicators.push({ name: "Database", level: "critical", value: "Unreachable" });
  }

  // 2. Queue depth
  const { count: queueDepth } = await supabase
    .from("job_queue")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");
  const qd = queueDepth || 0;
  indicators.push({
    name: "Queue Depth",
    level: qd < 10 ? "healthy" : qd < 50 ? "warning" : "critical",
    value: qd.toString() + " pending",
    detail: qd > 50 ? "Queue may be stalled" : undefined,
  });

  // 3. Failed jobs
  const { count: failedJobs } = await supabase
    .from("job_queue")
    .select("*", { count: "exact", head: true })
    .eq("status", "failed");
  const fj = failedJobs || 0;
  indicators.push({
    name: "Failed Jobs",
    level: fj === 0 ? "healthy" : fj < 5 ? "warning" : "critical",
    value: fj.toString(),
  });

  // 4. Outbox backlog
  const { count: outboxPending } = await supabase
    .from("outbox_events")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");
  const ob = outboxPending || 0;
  indicators.push({
    name: "Outbox Backlog",
    level: ob < 5 ? "healthy" : ob < 20 ? "warning" : "critical",
    value: ob.toString() + " pending",
    detail: ob > 20 ? "Outbox relay may have stopped" : undefined,
  });

  // 5. Outbox permanently failed
  const { count: outboxFailed } = await supabase
    .from("outbox_events")
    .select("*", { count: "exact", head: true })
    .eq("status", "failed_permanent");
  const of_ = outboxFailed || 0;
  indicators.push({
    name: "Permanently Failed Events",
    level: of_ === 0 ? "healthy" : "critical",
    value: of_.toString(),
    detail: of_ > 0 ? "Events that exceeded max retries" : undefined,
  });

  // 6. Last successful outbox relay
  const { data: lastRelay } = await supabase
    .from("outbox_events")
    .select("processed_at")
    .eq("status", "processed")
    .order("processed_at", { ascending: false })
    .limit(1);
  const lastRelayAt = lastRelay?.[0]?.processed_at;
  if (lastRelayAt) {
    const ageMs = Date.now() - new Date(lastRelayAt).getTime();
    const ageMin = Math.round(ageMs / 60000);
    indicators.push({
      name: "Last Relay",
      level: ageMin < 10 ? "healthy" : ageMin < 60 ? "warning" : "critical",
      value: ageMin + " min ago",
      detail: ageMin > 60 ? "Relay may have stopped" : undefined,
    });
  } else {
    indicators.push({
      name: "Last Relay",
      level: "warning",
      value: "No processed events",
      detail: "No events have been relayed yet",
    });
  }

  // 7. Projection freshness
  const { data: newestBook } = await supabase
    .from("books")
    .select("updated_at")
    .order("updated_at", { ascending: false })
    .limit(1);
  const { data: newestDoc } = await supabase
    .from("discovery_search_documents")
    .select("indexed_at")
    .order("indexed_at", { ascending: false })
    .limit(1);
  if (newestBook?.[0]?.updated_at && newestDoc?.[0]?.indexed_at) {
    const bookTime = new Date(newestBook[0].updated_at).getTime();
    const docTime = new Date(newestDoc[0].indexed_at).getTime();
    const lagMs = bookTime - docTime;
    const lagMin = Math.max(0, Math.round(lagMs / 60000));
    indicators.push({
      name: "Projection Freshness",
      level: lagMin < 5 ? "healthy" : lagMin < 30 ? "warning" : "critical",
      value: lagMin + " min behind",
    });
  } else {
    indicators.push({
      name: "Projection Freshness",
      level: "warning",
      value: "No data",
    });
  }

  // 8. Slow queries (from search_history)
  const { count: slowCount } = await supabase
    .from("search_history")
    .select("*", { count: "exact", head: true })
    .eq("is_slow_query", true);
  const sc = slowCount || 0;
  indicators.push({
    name: "Slow Queries",
    level: sc === 0 ? "healthy" : sc < 10 ? "warning" : "critical",
    value: sc.toString() + " total",
  });

  // Determine overall level
  const levels = indicators.map(i => i.level);
  const overallLevel: HealthLevel = levels.includes("critical")
    ? "critical"
    : levels.includes("warning")
      ? "warning"
      : "healthy";

  return { indicators, overallLevel };
}
`);

// ============================================================
// 10. Admin Pages
// ============================================================

// --- Jobs Page ---
writeFile('admin/src/app/ops/jobs/page.tsx', `
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
`);

// --- Outbox Page ---
writeFile('admin/src/app/ops/outbox/page.tsx', `
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
`);

// --- Projections Page ---
writeFile('admin/src/app/ops/projections/page.tsx', `
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
          <form action={enqueueSearchRebuildAction}>
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
`);

// --- Search Diagnostics Page ---
writeFile('admin/src/app/ops/search/page.tsx', `
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
`);

// --- System Health Dashboard (ops root) ---
writeFile('admin/src/app/ops/page.tsx', `
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
`);

console.log('\\nAll operational tooling files generated successfully.');
