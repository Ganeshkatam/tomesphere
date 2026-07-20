import { HighlightDto } from "../../application/dto/response/HighlightDto";

export interface HighlightRepository {
  getHighlights(userId: string, bookId: string): Promise<HighlightDto[]>;
  createHighlight(
    userId: string,
    bookId: string,
    location: string,
    selectedText: string,
    color?: string,
  ): Promise<HighlightDto>;
  deleteHighlight(id: string, userId: string): Promise<boolean>;
}
