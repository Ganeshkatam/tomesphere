import { NotesPageDto } from "../../dto/response/NotesPageDto";

export interface NotesReadModel {
  getNotesPage(
    userId: string,
    limit: number,
    cursor: string | null,
  ): Promise<NotesPageDto>;
}
