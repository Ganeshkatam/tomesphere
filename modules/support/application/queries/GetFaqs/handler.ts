import { SupportReadModel } from "../../../application/ports/read-models/SupportReadModel";
import { FaqDto } from "../../dto/FaqDto";

export class GetFaqsQueryHandler {
  constructor(private readonly repo: SupportReadModel) {}

  async execute(): Promise<FaqDto[]> {
    return await this.repo.getFaqs();
  }
}
