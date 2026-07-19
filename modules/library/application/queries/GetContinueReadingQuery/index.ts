import { ContinueReadingDto } from "./dto";

export interface ContinueReadingReadModel {
  getContinueReading(userId: string): Promise<ContinueReadingDto | null>;
}

export class GetContinueReadingQuery {
  constructor(private readonly repository: ContinueReadingReadModel) {}

  async execute(userId: string): Promise<ContinueReadingDto | null> {
    try {
      const data = await this.repository.getContinueReading(userId);
      return data;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch continue reading data." );
    }
  }
}
