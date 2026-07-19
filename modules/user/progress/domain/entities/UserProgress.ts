import { AggregateRoot } from "@/modules/core/domain/AggregateRoot";
import { UserId } from "@/modules/core/domain/UserId";
import { ReadingGoal } from "../value-objects/ReadingGoal";
import { ReadingStreak } from "../value-objects/ReadingStreak";
import { ExperiencePoints } from "../value-objects/ExperiencePoints";
import { LevelPolicy } from "../policies/LevelPolicy";
import { AchievementCollection } from "../collections/AchievementCollection";
import { Achievement } from "../entities/Achievement";
import { ReadingActivity } from "../value-objects/ReadingActivity";
import {
  ReadingProgressApplied,
  StreakExtended,
  StreakLost,
  LevelUp,
  AchievementUnlocked,
  ReadingGoalCompleted,
  ReadingGoalUpdated,
} from "../events";

export interface UserProgressProps {
  userId: UserId;
  readingGoal: ReadingGoal;
  readingStreak: ReadingStreak;
  experiencePoints: ExperiencePoints;
  achievements: AchievementCollection;
  updatedAt: Date;
}

export class UserProgress extends AggregateRoot<UserProgressProps> {
  get userId(): UserId {
    return this.props.userId;
  }
  get readingGoal(): ReadingGoal {
    return this.props.readingGoal;
  }
  get readingStreak(): ReadingStreak {
    return this.props.readingStreak;
  }
  get experiencePoints(): ExperiencePoints {
    return this.props.experiencePoints;
  }
  get achievements(): AchievementCollection {
    return this.props.achievements;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }
  get level() {
    return LevelPolicy.calculateLevel(this.props.experiencePoints);
  }

  private constructor(id: string, props: UserProgressProps) {
    super(id, props);
  }

  static fromPersistence(
    id: string,
    userId: string,
    readingGoal: ReadingGoal,
    readingStreak: ReadingStreak,
    experiencePoints: ExperiencePoints,
    achievements: AchievementCollection,
    updatedAt: Date,
  ): UserProgress {
    return new UserProgress(id, {
      userId: UserId.create(userId),
      readingGoal,
      readingStreak,
      experiencePoints,
      achievements,
      updatedAt,
    });
  }

  applyReadingActivity(activity: ReadingActivity) {
    // 1. Evaluate and update streak
    const currentStreakDays = this.props.readingStreak.currentStreakDays;
    const { newStreak, extended, lost } = this.props.readingStreak.evaluate(
      activity.date,
    );
    this.props.readingStreak = newStreak;

    if (lost) {
      this.addDomainEvent(new StreakLost(this.id, currentStreakDays));
    }
    if (extended) {
      this.addDomainEvent(
        new StreakExtended(this.id, newStreak.currentStreakDays),
      );
    }

    // 2. Award XP
    // Example algorithm: 1 XP per minute, 5 XP per completed book
    const earnedXp = Math.floor(activity.minutes) + activity.completedBooks * 5;
    const oldLevel = this.level.levelNumber;

    this.props.experiencePoints = this.props.experiencePoints.add(earnedXp);

    const newLevel = this.level.levelNumber;
    if (newLevel > oldLevel) {
      this.addDomainEvent(new LevelUp(this.id, newLevel, this.level.title));
    }

    // 3. Update Goals
    const { newGoal, justCompletedDaily } =
      this.props.readingGoal.applyProgress(activity);
    this.props.readingGoal = newGoal;

    if (justCompletedDaily) {
      this.addDomainEvent(
        new ReadingGoalCompleted(this.id, "daily", newGoal.dailyMinutesTarget),
      );
    }

    this.props.updatedAt = new Date();
    this.addDomainEvent(
      new ReadingProgressApplied(
        this.id,
        activity.minutes,
        activity.pages,
        activity.completedBooks,
      ),
    );
  }

  evaluateStreak(todayDate: Date = new Date()) {
    const currentStreakDays = this.props.readingStreak.currentStreakDays;
    const { newStreak, lost } = this.props.readingStreak.refresh(todayDate);
    this.props.readingStreak = newStreak;

    if (lost) {
      this.props.updatedAt = new Date();
      this.addDomainEvent(new StreakLost(this.id, currentStreakDays));
    }
  }

  unlockAchievement(
    achievementId: string,
    rarity: string | null = null,
    source: string | null = null,
  ) {
    const achievement = Achievement.create(
      crypto.randomUUID(),
      achievementId,
      new Date(),
      rarity,
      source,
    );
    const { collection, newlyUnlocked } =
      this.props.achievements.unlock(achievement);

    if (newlyUnlocked) {
      this.props.achievements = collection;
      this.props.updatedAt = new Date();
      this.addDomainEvent(new AchievementUnlocked(this.id, achievementId));
    }
  }

  updateReadingGoal(dailyMinutes: number, yearlyBooks: number) {
    this.props.readingGoal = ReadingGoal.create(
      dailyMinutes,
      yearlyBooks,
      this.props.readingGoal.dailyMinutesProgress,
      this.props.readingGoal.yearlyBooksProgress,
      this.props.readingGoal.lastUpdatedDate,
    );
    this.props.updatedAt = new Date();
    this.addDomainEvent(
      new ReadingGoalUpdated(this.id, dailyMinutes, yearlyBooks),
    );
  }
}
