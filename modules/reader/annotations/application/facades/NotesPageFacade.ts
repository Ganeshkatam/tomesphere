import { NotesReadModel } from "../ports/read-models/NotesReadModel";
import { NotesPageDto } from "../dto/response/NotesPageDto";

export class NotesPageFacade {
  constructor(private readModel: NotesReadModel) {}

  async execute(userId: string, limit: number = 24, cursor: string | null = null): Promise<NotesPageDto> {
    return this.readModel.getNotesPage(userId, limit, cursor);
  }
}
