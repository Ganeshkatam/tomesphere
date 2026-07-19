/**
 * Rate Limiter — Domain Port
 *
 * Defines the contract for rate limiting authentication attempts.
 * Implementations can use Postgres, Redis, or any other backing store.
 */

export interface RateLimitResult {
  /** Whether the request is allowed */
  allowed: boolean;
  /** Remaining attempts before lockout */
  remaining: number;
  /** Milliseconds until the limit resets (if blocked) */
  retryAfterMs?: number;
}

export interface RateLimiter {
  /**
   * Check whether a key (IP, email, or composite) is currently rate-limited.
   */
  check(
    key: string,
    maxAttempts: number,
    windowMs: number,
  ): Promise<RateLimitResult>;

  /**
   * Record a failed attempt for the given key.
   */
  increment(key: string, windowMs: number): Promise<void>;

  /**
   * Reset the rate limit for a key (e.g. after successful login).
   */
  reset(key: string): Promise<void>;
}
