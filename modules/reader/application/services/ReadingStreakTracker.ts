import { SupabaseClient } from "@supabase/supabase-js";

export interface ReadingProgressDelta {
  durationSeconds?: number;
  pagesRead?: number;
  isNewBook?: boolean;
  isCompletedBook?: boolean;
}

export interface ReadingStreakResult {
  currentStreak: number;
  longestStreak: number;
  lastReadDate: string;
  totalSecondsRead: number;
  totalPagesRead: number;
}

/**
 * Authoritative, idempotent tracker for user daily streaks and reading statistics.
 * Computes calendar-day transitions (UTC) reliably.
 */
export async function trackUserReadingActivity(
  supabase: SupabaseClient,
  userId: string,
  delta: ReadingProgressDelta = {},
): Promise<ReadingStreakResult> {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const nowIso = now.toISOString();

  const { data: stats } = await supabase
    .from("user_statistics")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (!stats) {
    const initialSeconds = Math.max(0, delta.durationSeconds || 0);
    const initialPages = Math.max(0, delta.pagesRead || 0);

    const { error } = await supabase
      .from("user_statistics")
      .insert({
        user_id: userId,
        books_started: delta.isNewBook ? 1 : 0,
        books_completed: delta.isCompletedBook ? 1 : 0,
        seconds_read: initialSeconds,
        minutes_read: Math.floor(initialSeconds / 60),
        pages_read: initialPages,
        current_streak: 1,
        longest_streak: 1,
        last_read_date: today,
        updated_at: nowIso,
      });

    if (error) {
      console.error("Failed to insert initial user_statistics:", error);
    }

    return {
      currentStreak: 1,
      longestStreak: 1,
      lastReadDate: today,
      totalSecondsRead: initialSeconds,
      totalPagesRead: initialPages,
    };
  }

  // Calculate day difference for streak
  let newStreak = stats.current_streak || 1;
  const prevDateStr = stats.last_read_date;

  if (prevDateStr) {
    const prevDate = new Date(prevDateStr + "T00:00:00Z");
    const currDate = new Date(today + "T00:00:00Z");
    const diffTime = currDate.getTime() - prevDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Consecutive calendar day -> Advance streak
      newStreak = (stats.current_streak || 0) + 1;
    } else if (diffDays > 1) {
      // Missed one or more calendar days -> Reset streak
      newStreak = 1;
    } else if (diffDays === 0) {
      // Same day -> Keep existing streak
      newStreak = stats.current_streak || 1;
    }
  } else {
    newStreak = 1;
  }

  const longestStreak = Math.max(stats.longest_streak || 1, newStreak);
  const totalSeconds = Math.max(0, (stats.seconds_read || 0) + (delta.durationSeconds || 0));
  const totalPages = Math.max(0, (stats.pages_read || 0) + (delta.pagesRead || 0));

  const updates: Record<string, any> = {
    seconds_read: totalSeconds,
    minutes_read: Math.floor(totalSeconds / 60),
    pages_read: totalPages,
    current_streak: newStreak,
    longest_streak: longestStreak,
    last_read_date: today,
    updated_at: nowIso,
  };

  if (delta.isNewBook) {
    updates.books_started = (stats.books_started || 0) + 1;
  }
  if (delta.isCompletedBook) {
    updates.books_completed = (stats.books_completed || 0) + 1;
  }

  await supabase
    .from("user_statistics")
    .update(updates)
    .eq("user_id", userId);

  return {
    currentStreak: newStreak,
    longestStreak,
    lastReadDate: today,
    totalSecondsRead: totalSeconds,
    totalPagesRead: totalPages,
  };
}
