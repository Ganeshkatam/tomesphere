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
