import { GoalProgressDto } from "./dto";

export interface ReadingGoalReadModel {
  getGoalProgress(userId: string): Promise<GoalProgressDto | null>;
}

export class GetReadingGoalQuery {
  constructor(private readonly repository: ReadingGoalReadModel) {}

  async execute(userId: string): Promise<GoalProgressDto | null> {
    try {
      const data = await this.repository.getGoalProgress(userId);
      return data;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch reading goal." );
    }
  }
}
