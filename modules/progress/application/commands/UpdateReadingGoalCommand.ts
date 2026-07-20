import { ReadingGoalRepository } from "../../domain/repositories/ReadingGoalRepository";
import { ReadingGoal } from "../../domain/entities/ReadingGoal";
import { UseCaseResult } from "@/shared/core/application/UseCaseResult";

export interface UpdateReadingGoalCommandPayload {
  userId: string;
  year: number;
  targetBooks: number;
}

export class UpdateReadingGoalCommand {
  constructor(private readonly goalRepo: ReadingGoalRepository) {}

  async execute(
    payload: UpdateReadingGoalCommandPayload,
  ): Promise<UseCaseResult<void>> {
    try {
      if (payload.targetBooks < 0) {
        throw new Error("Target books cannot be negative"); // In a real app we'd throw DomainError
      }

      let goal = await this.goalRepo.findByUserIdAndYear(
        payload.userId,
        payload.year,
      );

      if (!goal) {
        // Create new goal if it doesn't exist
        goal = ReadingGoal.create("goal-" + Date.now(), {
          userId: payload.userId,
          year: payload.year,
          targetBooks: payload.targetBooks,
          booksRead: 0,
        });
      } else {
        goal.updateTargetBooks(payload.targetBooks);
      }

      await this.goalRepo.save(goal);
      return { output: undefined, events: goal.pullDomainEvents() };
    } catch (error) {
      console.error("[UpdateReadingGoalCommand] Error:", error);
      throw error;
    }
  }
}
