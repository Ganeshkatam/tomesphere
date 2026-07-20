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
