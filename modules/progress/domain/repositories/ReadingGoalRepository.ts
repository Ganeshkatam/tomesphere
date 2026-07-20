import { ReadingGoal } from "../entities/ReadingGoal";

export interface ReadingGoalRepository {
  findById(id: string): Promise<ReadingGoal | null>;
  findByUserIdAndYear(
    userId: string,
    year: number,
  ): Promise<ReadingGoal | null>;
  save(goal: ReadingGoal): Promise<void>;
}
