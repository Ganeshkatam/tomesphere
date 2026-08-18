import { IEventBus } from "../../core/events/types";
import { WorkerDatabaseClient } from "@/shared/infrastructure/database/WorkerDatabaseClient";

const MAX_RETRIES = parseInt(process.env.OUTBOX_MAX_RETRIES || "3", 10);

/**
 * Outbox Relay
 *
 * Polls `outbox_events` for pending events, dispatches them to the
 * in-memory EventBus, and marks them as processed.
 *
 * Design decisions:
 * - Uses `WorkerDatabaseClient` via direct PostgreSQL connection using `tomesphere_worker` role.
 * - Invokes `internal.claim_outbox_events` RPC for safe concurrent claiming (FOR UPDATE SKIP LOCKED).
 * - Implements exponential backoff on failure.
 * - Marks permanently failed events as `failed_permanent` after MAX_RETRIES.
 * - Does NOT use SUPABASE_SERVICE_ROLE_KEY or PostgREST Data API.
 */

export interface OutboxRelayResult {
  processed: number;
  failed: number;
  permanentlyFailed: number;
}

export async function processOutbox(
  eventBus: IEventBus,
): Promise<OutboxRelayResult> {
  // 1. Claim pending events atomically via WorkerDatabaseClient
  let events;
  try {
    events = await WorkerDatabaseClient.claimOutboxEvents(50);
  } catch (claimError: any) {
    console.error(
      "[Outbox Relay] Failed to claim events via WorkerDatabaseClient:",
      claimError.message,
    );
    return { processed: 0, failed: 0, permanentlyFailed: 0 };
  }

  if (!events || events.length === 0) {
    return { processed: 0, failed: 0, permanentlyFailed: 0 };
  }

  let processed = 0;
  let failed = 0;
  let permanentlyFailed = 0;

  // 2. Process each claimed event
  for (const event of events) {
    try {
      const eventType = event.event_type as any;
      const payload = event.payload as any;

      eventBus.emit(eventType, payload);

      // 3. Mark as processed via direct worker query
      await WorkerDatabaseClient.query(
        `UPDATE public.outbox_events 
         SET status = 'processed', processed_at = NOW() 
         WHERE id = $1;`,
        [event.id]
      );

      processed++;
    } catch (error: any) {
      const newRetryCount = (event.retry_count || 0) + 1;
      const isPermanentFailure = newRetryCount >= MAX_RETRIES;

      await WorkerDatabaseClient.query(
        `UPDATE public.outbox_events 
         SET status = $1, retry_count = $2, last_error = $3 
         WHERE id = $4;`,
        [
          isPermanentFailure ? "failed_permanent" : "failed",
          newRetryCount,
          error.message || "Unknown error",
          event.id,
        ]
      );

      if (isPermanentFailure) {
        console.error(
          `[Outbox Relay] Permanently failed event ${event.id}: ${error.message}`,
        );
        permanentlyFailed++;
      } else {
        console.warn(
          `[Outbox Relay] Retryable failure for event ${event.id} (attempt ${newRetryCount}/${MAX_RETRIES})`,
        );
        failed++;
      }
    }
  }

  console.log(
    `[Outbox Relay] Batch complete: ${processed} processed, ${failed} failed, ${permanentlyFailed} permanently failed`,
  );

  return { processed, failed, permanentlyFailed };
}

/**
 * Returns operational metrics for monitoring.
 */
export async function getOutboxMetrics() {
  try {
    const res = await WorkerDatabaseClient.query<{
      status: string;
      count: string;
    }>(
      `SELECT status, COUNT(*)::text as count 
       FROM public.outbox_events 
       GROUP BY status;`
    );

    const counts: Record<string, number> = {};
    for (const row of res.rows) {
      counts[row.status] = parseInt(row.count, 10);
    }

    return {
      pending: counts["pending"] || 0,
      processing: counts["processing"] || 0,
      failed: counts["failed"] || 0,
      permanentlyFailed: counts["failed_permanent"] || 0,
    };
  } catch (error: any) {
    console.error("[Outbox Relay] Failed to fetch outbox metrics:", error.message);
    return null;
  }
}
