import { AnnotationsReadModel } from "../ports/read-models/AnnotationsReadModel";
import { AnnotationsPageDto } from "../dto/response/AnnotationsPageDto";

export class AnnotationsPageFacade {
  constructor(private readModel: AnnotationsReadModel) {}

  async execute(userId: string, limit: number = 24, cursor: string | null = null): Promise<AnnotationsPageDto> {
    return this.readModel.getAnnotationsPage(userId, limit, cursor);
  }
}
