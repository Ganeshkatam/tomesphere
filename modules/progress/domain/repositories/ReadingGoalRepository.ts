import { ReadingGoal, ReadingGoalType } from "../entities/ReadingGoal";

export interface ReadingGoalRepository {
  findById(id: string): Promise<ReadingGoal | null>;
  findByUserIdAndType(
    userId: string,
    goalType: ReadingGoalType,
    year?: number,
  ): Promise<ReadingGoal | null>;
  findByUserIdAndYear(
    userId: string,
    year: number,
  ): Promise<ReadingGoal | null>;
  listActiveByUserId(userId: string): Promise<ReadingGoal[]>;
  save(goal: ReadingGoal): Promise<void>;
  delete(id: string, userId: string): Promise<void>;
}
