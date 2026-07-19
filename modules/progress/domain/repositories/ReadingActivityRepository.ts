import { ActivityLog } from "../entities/ActivityLog";
import { ReadingStreak } from "../entities/ReadingStreak";

export interface ReadingActivityRepository {
  /**
   * Logs a reading activity for a user on a given date.
   */
  logActivity(activity: ActivityLog): Promise<void>;

  /**
   * Calculates or retrieves the reading streak for a user.
   */
  getStreak(userId: string): Promise<ReadingStreak>;
}
