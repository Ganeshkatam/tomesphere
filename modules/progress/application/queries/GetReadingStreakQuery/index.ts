import { ReadingStreakDto } from "./dto";

export interface ReadingStreakReadModel {
  getReadingStreak(userId: string): Promise<ReadingStreakDto | null>;
}

export class GetReadingStreakQuery {
  constructor(private readonly repository: ReadingStreakReadModel) {}

  async execute(userId: string): Promise<ReadingStreakDto | null> {
    try {
      const data = await this.repository.getReadingStreak(userId);
      return data;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch reading streak.");
    }
  }
}
