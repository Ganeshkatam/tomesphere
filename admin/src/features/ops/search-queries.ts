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
