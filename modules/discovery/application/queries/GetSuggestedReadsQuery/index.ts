import { SuggestedReadsDto } from "./dto";

export interface SuggestedReadsReadModel {
  getSuggestedReads(userId: string): Promise<SuggestedReadsDto | null>;
}

export class GetSuggestedReadsQuery {
  constructor(private readonly repository: SuggestedReadsReadModel) {}

  async execute(userId: string): Promise<SuggestedReadsDto | null> {
    try {
      const data = await this.repository.getSuggestedReads(userId);
      return data;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch suggested reads.");
    }
  }
}
