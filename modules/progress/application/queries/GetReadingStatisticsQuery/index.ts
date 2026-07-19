import { ReadingStatisticsDto } from "./dto";

export interface ReadingStatisticsReadModel {
  getReadingStatistics(userId: string): Promise<ReadingStatisticsDto | null>;
}

export class GetReadingStatisticsQuery {
  constructor(private readonly repository: ReadingStatisticsReadModel) {}

  async execute(userId: string): Promise<ReadingStatisticsDto | null> {
    try {
      const data = await this.repository.getReadingStatistics(userId);
      return data;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch reading statistics." );
    }
  }
}
