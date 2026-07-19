import { ReadingCalendarDto } from "./dto";

export interface ReadingCalendarReadModel {
  getReadingCalendar(userId: string): Promise<ReadingCalendarDto | null>;
}

export class GetReadingCalendarQuery {
  constructor(private readonly repository: ReadingCalendarReadModel) {}

  async execute(userId: string): Promise<ReadingCalendarDto | null> {
    try {
      const data = await this.repository.getReadingCalendar(userId);
      return data;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch reading calendar." );
    }
  }
}
