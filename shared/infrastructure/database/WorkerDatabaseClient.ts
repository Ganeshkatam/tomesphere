import { Pool, QueryResultRow } from "pg";

/**
 * WorkerDatabaseClient
 * 
 * Infrastructure client for trusted server-side background workers and cron jobs.
 * Connects directly to PostgreSQL via TOMESPHERE_WORKER_DATABASE_URL using the 
 * narrowly-privileged 'tomesphere_worker' role.
 * 
 * Design & Security Principles:
 * - Does NOT use SUPABASE_SERVICE_ROLE_KEY or PostgREST Data API.
 * - Invokes unexposed capability functions in the 'internal' database schema.
 * - Configured with connection pooling suitable for Supavisor transaction poolers
 *   (bounded pool size, connection timeouts, SSL support, and idle cleanup).
 */

declare global {
  // Prevent multiple pool instances during Next.js hot reloading in dev
  var __tomesphereWorkerPool: Pool | undefined;
}

function getWorkerPool(): Pool {
  const connectionString = process.env.TOMESPHERE_WORKER_DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "[WorkerDatabaseClient] Missing TOMESPHERE_WORKER_DATABASE_URL environment variable."
    );
  }

  if (!globalThis.__tomesphereWorkerPool) {
    const isProduction = process.env.NODE_ENV === "production";
    
    globalThis.__tomesphereWorkerPool = new Pool({
      connectionString,
      max: 3, // Bounded pool size for serverless execution
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
      ssl: isProduction || process.env.DATABASE_SSL === "true" 
        ? { rejectUnauthorized: false } 
        : undefined,
    });
  }

  return globalThis.__tomesphereWorkerPool;
}

export interface ClaimedOutboxEvent {
  id: string;
  aggregate_type: string;
  aggregate_id: string;
  event_type: string;
  event_version: number;
  payload: Record<string, unknown>;
  occurred_at: string;
  status: string;
  retry_count: number;
  last_error: string | null;
  created_at: string;
  processed_at: string | null;
  claimed_at: string | null;
}

export class WorkerDatabaseClient {
  private static get pool(): Pool {
    return getWorkerPool();
  }

  /**
   * Atomically claims pending or failed outbox events using internal.claim_outbox_events
   */
  static async claimOutboxEvents(limitCount: number = 50): Promise<ClaimedOutboxEvent[]> {
    const query = `SELECT * FROM internal.claim_outbox_events($1);`;
    const res = await this.pool.query<ClaimedOutboxEvent>(query, [limitCount]);
    return res.rows;
  }

  /**
   * Executes a parameterized query against internal capability functions
   */
  static async query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: unknown[]
  ) {
    return this.pool.query<T>(text, params);
  }
}
