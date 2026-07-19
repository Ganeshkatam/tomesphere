import { UserProgress } from "./entities/UserProgress";
import { ReadingGoal } from "./value-objects/ReadingGoal";
import { ReadingStreak } from "./value-objects/ReadingStreak";
import { ExperiencePoints } from "./value-objects/ExperiencePoints";
import { AchievementCollection } from "./collections/AchievementCollection";
import { ReadingActivity } from "./value-objects/ReadingActivity";
import { UserId } from "@/modules/core/domain/UserId";

describe("UserProgress Aggregate", () => {
  let userProgress: UserProgress;

  beforeEach(() => {
    userProgress = UserProgress.fromPersistence(
      "progress-123",
      "user-123",
      ReadingGoal.create(30, 12),
      ReadingStreak.create(0, 0, null),
      ExperiencePoints.create(0),
      AchievementCollection.create([]),
      new Date(),
    );
  });

  it("✓ XP accumulation", () => {
    const activity = ReadingActivity.create(25, 10, 0);
    userProgress.applyReadingActivity(activity);

    expect(userProgress.experiencePoints.value).toBe(25); // 25 mins = 25 XP

    const activity2 = ReadingActivity.create(10, 5, 1);
    userProgress.applyReadingActivity(activity2);

    // 25 + 10 (mins) + 5 (1 book) = 40 XP
    expect(userProgress.experiencePoints.value).toBe(40);
  });

  it("✓ streak extension", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    userProgress = UserProgress.fromPersistence(
      "progress-123",
      "user-123",
      ReadingGoal.create(30, 12),
      ReadingStreak.create(3, 5, yesterday.toISOString().split("T")[0]),
      ExperiencePoints.create(100),
      AchievementCollection.create([]),
      new Date(),
    );

    const activity = ReadingActivity.create(30, 10, 0, new Date());
    userProgress.applyReadingActivity(activity);

    expect(userProgress.readingStreak.currentStreakDays).toBe(4);
    const events = userProgress.domainEvents;
    expect(events.some((e) => e.constructor.name === "StreakExtended")).toBe(
      true,
    );
  });

  it("✓ streak expiration", () => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    userProgress = UserProgress.fromPersistence(
      "progress-123",
      "user-123",
      ReadingGoal.create(30, 12),
      ReadingStreak.create(5, 5, threeDaysAgo.toISOString().split("T")[0]),
      ExperiencePoints.create(100),
      AchievementCollection.create([]),
      new Date(),
    );

    const activity = ReadingActivity.create(30, 10, 0, new Date());
    userProgress.applyReadingActivity(activity);

    expect(userProgress.readingStreak.currentStreakDays).toBe(1);
    const events = userProgress.domainEvents;
    expect(events.some((e) => e.constructor.name === "StreakLost")).toBe(true);
  });

  it("✓ achievement unlock", () => {
    userProgress.unlockAchievement("first-book");
    expect(userProgress.achievements.contains("first-book")).toBe(true);
    const events = userProgress.domainEvents;
    expect(
      events.some((e) => e.constructor.name === "AchievementUnlocked"),
    ).toBe(true);
  });

  it("✓ duplicate achievement ignored", () => {
    userProgress.unlockAchievement("first-book");
    userProgress.clearEvents(); // Clear events from first unlock

    userProgress.unlockAchievement("first-book");
    const events = userProgress.domainEvents;
    expect(
      events.some((e) => e.constructor.name === "AchievementUnlocked"),
    ).toBe(false);
  });

  it("✓ reading goal completion", () => {
    // Goal is 30 mins
    const activity1 = ReadingActivity.create(20, 10, 0, new Date());
    userProgress.applyReadingActivity(activity1);

    let events = userProgress.domainEvents;
    expect(events.some((e) => e.eventName === "ReadingGoalCompleted")).toBe(
      false,
    );
    userProgress.clearEvents();

    const activity2 = ReadingActivity.create(15, 5, 0, new Date()); // Total 35 mins
    userProgress.applyReadingActivity(activity2);

    events = userProgress.domainEvents;
    expect(events.some((e) => e.eventName === "ReadingGoalCompleted")).toBe(
      true,
    );
  });

  it("✓ level transition (via LevelPolicy)", () => {
    // Needs 1000 for level 2
    const activity = ReadingActivity.create(1001, 100, 0, new Date());
    userProgress.applyReadingActivity(activity);

    expect(userProgress.level.levelNumber).toBe(2);

    const events = userProgress.domainEvents;
    expect(events.some((e) => e.eventName === "LevelUp")).toBe(true);
  });

  it("✓ emitted events", () => {
    const activity = ReadingActivity.create(30, 10, 0, new Date());
    userProgress.applyReadingActivity(activity);

    const events = userProgress.domainEvents;
    expect(events.some((e) => e.eventName === "ReadingProgressApplied")).toBe(
      true,
    );
    expect(events.some((e) => e.eventName === "ReadingGoalCompleted")).toBe(
      true,
    );
  });

  it("✓ events emitted once", () => {
    const activity1 = ReadingActivity.create(30, 10, 0, new Date()); // Completes goal
    userProgress.applyReadingActivity(activity1);
    userProgress.clearEvents();

    const activity2 = ReadingActivity.create(30, 10, 0, new Date()); // Still completed
    userProgress.applyReadingActivity(activity2);

    const events = userProgress.domainEvents;
    // Should NOT emit ReadingGoalCompleted again on the same day
    expect(events.some((e) => e.eventName === "ReadingGoalCompleted")).toBe(
      false,
    );
  });

  it("✓ impossible negative XP", () => {
    expect(() => {
      ExperiencePoints.create(-10);
    }).toThrow("XP cannot be negative");

    const xp = ExperiencePoints.create(10);
    expect(() => {
      xp.add(-5);
    }).toThrow("Cannot add negative XP");
  });
});
