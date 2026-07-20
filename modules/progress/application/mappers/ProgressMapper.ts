import { ReadingGoal } from "../../domain/entities/ReadingGoal";
import { ReadingStreak } from "../../domain/entities/ReadingStreak";
import { ReadingGoalDto } from "../dto/response/ReadingGoalDto";
import { StreakDataDto } from "../dto/response/StreakDataDto";

export class ProgressMapper {
  static toGoalDto(goal: ReadingGoal): ReadingGoalDto {
    return {
      id: goal.id,
      year: goal.year,
      targetBooks: goal.targetBooks,
      booksRead: goal.booksRead,
      progressPercentage: goal.calculateProgressPercentage(),
      isCompleted: goal.booksRead >= goal.targetBooks,
    };
  }

  static toStreakDto(streak: ReadingStreak): StreakDataDto {
    return {
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      lastActivityDate: streak.lastActivityDate
        ? streak.lastActivityDate.toISOString()
        : null,
      totalDaysActive: streak.totalDaysActive,
    };
  }
}
