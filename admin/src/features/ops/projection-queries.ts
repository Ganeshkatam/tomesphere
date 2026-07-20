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
