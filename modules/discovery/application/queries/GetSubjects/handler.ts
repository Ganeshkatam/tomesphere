import { DiscoveryReadModel } from "../../ports/read-models/DiscoveryReadModel";
import { GetSubjectsQuery } from "./query";
import { GetSubjectsResponseDto } from "./response";

export class GetSubjectsHandler {
  constructor(private readonly readModel: DiscoveryReadModel) {}

  async execute(query: GetSubjectsQuery): Promise<GetSubjectsResponseDto> {
    return this.readModel.getSubjects(query);
  }
}
