import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/shared/core/types/database";

export class SearchAnalyticsHandler {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async handle(payload: {
    searchId: string;
    userId?: string;
    query: string;
    executionTimeMs: number;
    resultCount: number;
    filters: any;
    sort: string;
    timestamp: string;
  }): Promise<void> {
    try {
      const isZeroResult = payload.resultCount === 0;
      const isSlowQuery = payload.executionTimeMs > 200;

      // 1. Slow Query Telemetry
      if (payload.executionTimeMs > 500) {
        console.error(
          `[SearchAnalytics] CRITICAL: Slow query detected (${payload.executionTimeMs}ms) for query: "${payload.query}"`,
        );
      } else if (payload.executionTimeMs > 200) {
        console.warn(
          `[SearchAnalytics] WARNING: Sub-optimal query detected (${payload.executionTimeMs}ms) for query: "${payload.query}"`,
        );
      }

      // 2. Insert into immutable history log
      const { error } = await this.supabase.from("search_history").insert({
        id: payload.searchId,
        user_id: payload.userId || null,
        query: payload.query,
        normalized_query: payload.query.trim().toLowerCase(),
        searched_at: payload.timestamp,
        result_count: payload.resultCount,
        execution_time_ms: payload.executionTimeMs,
        is_zero_result: isZeroResult,
        is_slow_query: isSlowQuery,
        filters: payload.filters,
        sort_strategy: payload.sort,
      });

      if (error) {
        console.error(
          "[SearchAnalyticsHandler] Failed to insert search history:",
          error,
        );
      }
    } catch (err) {
      console.error("[SearchAnalyticsHandler] Unexpected error:", err);
    }
  }
}
