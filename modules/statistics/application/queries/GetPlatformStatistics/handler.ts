import { PlatformStatisticsReadModel } from "../../../application/ports/read-models/PlatformStatisticsReadModel";
import { PlatformStatisticsDto } from "./read-model";

export class GetPlatformStatisticsQueryHandler {
  constructor(private readonly repo: PlatformStatisticsReadModel) {}

  async execute(): Promise<PlatformStatisticsDto> {
    return await this.repo.getStatistics();
  }
}
