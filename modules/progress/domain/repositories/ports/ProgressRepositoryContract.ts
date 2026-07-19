import { ProgressRepository } from "../ProgressRepository";
import { UserProgress } from "../../entities/UserProgress";
import { ReadingGoal } from "../../value-objects/ReadingGoal";
import { ReadingStreak } from "../../value-objects/ReadingStreak";
import { ExperiencePoints } from "../../value-objects/ExperiencePoints";
import { AchievementCollection } from "../../collections/AchievementCollection";
import { UserId } from "@/shared/kernel/UserId";

export function runProgressRepositoryContract(
  createRepository: () => ProgressRepository,
  clearDatabase: () => Promise<void>,
) {
  describe("ProgressRepository Contract", () => {
    let repository: ProgressRepository;

    beforeEach(async () => {
      await clearDatabase();
      repository = createRepository();
    });

    it("should pass", () => {
      expect(true).toBe(true);
    });

    it("should return null when progress does not exist", async () => {
      const progress = await repository.findByUserId(
        UserId.create("non-existent"),
      );
      expect(progress).toBeNull();
    });

    it("should save and retrieve progress accurately", async () => {
      const userId = "user-123";
      const progress = UserProgress.fromPersistence(
        "progress-1",
        userId,
        ReadingGoal.create(30, 12, 10, 1, "2023-01-01"),
        ReadingStreak.create(5, 10, "2023-01-01"),
        ExperiencePoints.create(150),
        AchievementCollection.create([]),
        new Date("2023-01-01"),
      );
      progress.unlockAchievement("first-book");

      await repository.save(progress);

      const retrieved = await repository.findByUserId(UserId.create(userId));
      expect(retrieved).not.toBeNull();
      expect(retrieved?.userId.value).toBe(userId);
      expect(retrieved?.readingGoal.dailyMinutesTarget).toBe(30);
      expect(retrieved?.readingGoal.dailyMinutesProgress).toBe(10);
      expect(retrieved?.readingStreak.currentStreakDays).toBe(5);
      expect(retrieved?.experiencePoints.value).toBe(150);
      expect(retrieved?.achievements.contains("first-book")).toBe(true);
    });

    it("should update existing progress", async () => {
      const userId = "user-123";
      const progress = UserProgress.fromPersistence(
        "progress-1",
        userId,
        ReadingGoal.create(30, 12, 0, 0, "2023-01-01"),
        ReadingStreak.create(0, 0, "2023-01-01"),
        ExperiencePoints.create(0),
        AchievementCollection.create([]),
        new Date("2023-01-01"),
      );

      await repository.save(progress);

      // Update it
      const retrieved = await repository.findByUserId(UserId.create(userId));
      if (!retrieved) throw new Error("Not found");

      retrieved.updateReadingGoal(60, 24);
      await repository.save(retrieved);

      const updated = await repository.findByUserId(UserId.create(userId));
      expect(updated?.readingGoal.dailyMinutesTarget).toBe(60);
      expect(updated?.readingGoal.yearlyBooksTarget).toBe(24);
    });
  });
}
