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
