import { CurrentReadingDto } from "./dto";

export interface CurrentReadingReadModel {
  getCurrentReading(userId: string): Promise<CurrentReadingDto | null>;
}

export class GetCurrentReadingQuery {
  constructor(private readonly repository: CurrentReadingReadModel) {}

  async execute(userId: string): Promise<CurrentReadingDto | null> {
    try {
      const data = await this.repository.getCurrentReading(userId);
      return data;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch current reading data.");
    }
  }
}
