import { DomainEvent } from "@/shared/kernel/DomainEvent";

export class ReadingProgressApplied implements DomainEvent {
  public readonly eventId = crypto.randomUUID();
  public readonly occurredAt = new Date();
  public readonly eventName = "ReadingProgressApplied";

  constructor(
    public readonly aggregateId: string,
    public readonly minutes: number,
    public readonly pages: number,
    public readonly completedBooks: number,
  ) {}
}

export class StreakExtended implements DomainEvent {
  public readonly eventId = crypto.randomUUID();
  public readonly occurredAt = new Date();
  public readonly eventName = "StreakExtended";

  constructor(
    public readonly aggregateId: string,
    public readonly newStreakDays: number,
  ) {}
}

export class StreakLost implements DomainEvent {
  public readonly eventId = crypto.randomUUID();
  public readonly occurredAt = new Date();
  public readonly eventName = "StreakLost";

  constructor(
    public readonly aggregateId: string,
    public readonly lapsedStreakDays: number,
  ) {}
}

export class LevelUp implements DomainEvent {
  public readonly eventId = crypto.randomUUID();
  public readonly occurredAt = new Date();
  public readonly eventName = "LevelUp";

  constructor(
    public readonly aggregateId: string,
    public readonly newLevel: number,
    public readonly newTitle: string,
  ) {}
}

export class AchievementUnlocked implements DomainEvent {
  public readonly eventId = crypto.randomUUID();
  public readonly occurredAt = new Date();
  public readonly eventName = "AchievementUnlocked";

  constructor(
    public readonly aggregateId: string,
    public readonly achievementId: string,
  ) {}
}

export class ReadingGoalCompleted implements DomainEvent {
  public readonly eventId = crypto.randomUUID();
  public readonly occurredAt = new Date();
  public readonly eventName = "ReadingGoalCompleted";

  constructor(
    public readonly aggregateId: string,
    public readonly goalType: "daily" | "yearly",
    public readonly targetValue: number,
  ) {}
}

export class ReadingGoalUpdated implements DomainEvent {
  public readonly eventId = crypto.randomUUID();
  public readonly occurredAt = new Date();
  public readonly eventName = "ReadingGoalUpdated";

  constructor(
    public readonly aggregateId: string,
    public readonly newDailyMinutes: number,
    public readonly newYearlyBooks: number,
  ) {}
}
