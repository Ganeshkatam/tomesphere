import { ReadingGoalRepository } from "../../domain/repositories/ReadingGoalRepository";
import { ReadingGoalDto } from "../dto/response/ReadingGoalDto";
import { ProgressMapper } from "../mappers/ProgressMapper";

export class GetReadingGoalsQuery {
  constructor(private readonly goalRepo: ReadingGoalRepository) {}

  async execute(userId: string, year: number): Promise<ReadingGoalDto> {
    try {
      const goal = await this.goalRepo.findByUserIdAndYear(userId, year);

      if (!goal) {
        throw new Error(`No reading goal found for year ${year}`);
      }

      return ProgressMapper.toGoalDto(goal);
    } catch (error) {
      console.error("[GetReadingGoalsQuery] Error:", error);
      throw new Error("Failed to fetch reading goals");
    }
  }
}
