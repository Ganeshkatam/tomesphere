import { RecentActivityDto } from "./dto";

export interface RecentActivityReadModel {
  getRecentActivity(userId: string): Promise<RecentActivityDto | null>;
}

export class GetRecentActivityQuery {
  constructor(private readonly repository: RecentActivityReadModel) {}

  async execute(userId: string): Promise<RecentActivityDto | null> {
    try {
      const data = await this.repository.getRecentActivity(userId);
      return data;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch recent activity.");
    }
  }
}
