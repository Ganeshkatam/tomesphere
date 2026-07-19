import { ProgressRepository } from "../../../domain/repositories/ProgressRepository";
import { UserId } from "@/shared/kernel/UserId";

export interface ProgressSummary {
  dailyMinutesTarget: number;
  dailyMinutesProgress: number;
  yearlyBooksTarget: number;
  yearlyBooksProgress: number;
}

export interface GetProgressDashboardOutput {
  userId: string;
  level: {
    number: number;
    title: string;
    totalXp: number;
    minimumXp: number;
  };
  streak: {
    currentDays: number;
    longestDays: number;
  };
  goals: ProgressSummary;
  recentAchievements: Array<{
    id: string;
    unlockedAt: string;
    rarity: string | null;
  }>;
}

export class GetProgressDashboard {
  constructor(private readonly repository: ProgressRepository) {}

  async execute(userId: string): Promise<GetProgressDashboardOutput | null> {
    const id = UserId.create(userId);
    const progress = await this.repository.findByUserId(id);

    if (!progress) return null;

    // Auto-refresh streak if they haven't logged in a while
    progress.evaluateStreak(new Date());

    // Note: we don't necessarily want to save it back to the DB *on read* here,
    // although we could if we injected a save command. For a query model,
    // we might just present the refreshed view. For now, just presenting is fine.

    const recent = progress.achievements.recentlyUnlocked(5);

    return {
      userId: progress.userId.value,
      level: {
        number: progress.level.levelNumber,
        title: progress.level.title,
        totalXp: progress.experiencePoints.value,
        minimumXp: progress.level.minimumXp,
      },
      streak: {
        currentDays: progress.readingStreak.currentStreakDays,
        longestDays: progress.readingStreak.longestStreakDays,
      },
      goals: {
        dailyMinutesTarget: progress.readingGoal.dailyMinutesTarget,
        dailyMinutesProgress: progress.readingGoal.dailyMinutesProgress,
        yearlyBooksTarget: progress.readingGoal.yearlyBooksTarget,
        yearlyBooksProgress: progress.readingGoal.yearlyBooksProgress,
      },
      recentAchievements: recent.map((a: any) => ({
        id: a.achievementId,
        unlockedAt: a.unlockedAt.toISOString(),
        rarity: a.rarity,
      })),
    };
  }
}
