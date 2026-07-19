import { headers } from "next/headers";
import { createSupabaseServerClient } from "@/shared/core/database/server";

type LogLevel = "INFO" | "WARN" | "ERROR" | "CRITICAL";

/**
 * Securely writes a system log to the database.
 * This is meant to be called from Next.js Server Components, Server Actions, or API Routes.
 */
export async function logSystemEvent(
  level: LogLevel,
  context: string,
  message: string,
  metadata: Record<string, any> = {},
) {
  try {
    const supabase = await createSupabaseServerClient();

    // Attempt to get authenticated user gracefully
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Extract network request context safely
    let ipAddress = "unknown";
    let path = "unknown";

    try {
      const headersList = await headers();
      ipAddress =
        headersList.get("x-forwarded-for") ||
        headersList.get("x-real-ip") ||
        "unknown";
      path = headersList.get("referer") || "unknown";
    } catch (headerErr) {
      // Context not available (e.g. called outside of request scope)
    }

    // The database has an INSERT-ONLY policy, meaning writing is allowed
    // but reading from the public schema is strictly denied.
    const { error } = await supabase.from("system_logs").insert({
      level,
      context,
      message,
      metadata,
      user_id: user?.id || null,
      ip_address: ipAddress,
      path,
    });

    if (error) {
      console.error("[LOGGER_DB_ERROR]", error.message);
    }
  } catch (e) {
    // Silently swallow core logging failures so they don't break the parent execution
    console.error("[LOGGER_FATAL]", e);
  }
}
