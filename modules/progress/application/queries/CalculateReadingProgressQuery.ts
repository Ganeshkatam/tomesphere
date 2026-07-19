import { ReadingGoalRepository } from "../../domain/repositories/ReadingGoalRepository";
import { ReadingActivityRepository } from "../../domain/repositories/ReadingActivityRepository";
import { ReadingProgressDto } from "../dto/response/ReadingProgressDto";
import { ProgressMapper } from "../mappers/ProgressMapper";

export class CalculateReadingProgressQuery {
  constructor(
    private readonly goalRepo: ReadingGoalRepository,
    private readonly activityRepo: ReadingActivityRepository
  ) {}

  async execute(userId: string, year: number): Promise<ReadingProgressDto> {
    try {
      const [goal, streak] = await Promise.all([
        this.goalRepo.findByUserIdAndYear(userId, year),
        this.activityRepo.getStreak(userId),
      ]);

      const dto: ReadingProgressDto = {
        goal: goal ? ProgressMapper.toGoalDto(goal) : null,
        streak: ProgressMapper.toStreakDto(streak),
      };

      return dto ;
    } catch (error) {
      console.error("[CalculateReadingProgressQuery] Error:", error);
      throw new Error("Failed to calculate reading progress" );
    }
  }
}
