import { SupabaseClient } from "@supabase/supabase-js";
import { RateLimiter, RateLimitResult } from "../domain/RateLimiter";

/**
 * Postgres-backed rate limiter using the auth_rate_limits table.
 *
 * Uses a sliding-window approach: counts attempts within [now - windowMs, now].
 * Supports hard lockout via the locked_until column.
 */
export class SupabaseRateLimiter implements RateLimiter {
  constructor(private readonly supabase: SupabaseClient) {}

  async check(
    key: string,
    maxAttempts: number,
    windowMs: number,
  ): Promise<RateLimitResult> {
    const now = new Date();
    const windowStart = new Date(now.getTime() - windowMs);

    // Check for active lockout first
    const { data: lockRow } = await this.supabase
      .from("auth_rate_limits")
      .select("locked_until")
      .eq("key", key)
      .gt("locked_until", now.toISOString())
      .maybeSingle();

    if (lockRow?.locked_until) {
      const lockedUntil = new Date(lockRow.locked_until);
      return {
        allowed: false,
        remaining: 0,
        retryAfterMs: lockedUntil.getTime() - now.getTime(),
      };
    }

    // Count attempts within the sliding window
    const { count } = await this.supabase
      .from("auth_rate_limits")
      .select("*", { count: "exact", head: true })
      .eq("key", key)
      .gte("created_at", windowStart.toISOString());

    const attempts = count || 0;
    const remaining = Math.max(0, maxAttempts - attempts);

    return {
      allowed: attempts < maxAttempts,
      remaining,
    };
  }

  async increment(key: string, _windowMs: number): Promise<void> {
    await this.supabase.from("auth_rate_limits").insert({
      key,
      created_at: new Date().toISOString(),
    });
  }

  /**
   * Lock an account for a specified duration.
   */
  async lockout(key: string, durationMs: number): Promise<void> {
    const lockedUntil = new Date(Date.now() + durationMs);

    await this.supabase.from("auth_rate_limits").insert({
      key,
      locked_until: lockedUntil.toISOString(),
      created_at: new Date().toISOString(),
    });
  }

  async reset(key: string): Promise<void> {
    await this.supabase.from("auth_rate_limits").delete().eq("key", key);
  }
}
