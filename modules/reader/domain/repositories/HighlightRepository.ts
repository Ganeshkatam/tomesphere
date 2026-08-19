import { HighlightRecord } from "../models/ReaderTypes";

export interface HighlightRepository {
  getHighlights(userId: string, bookId: string): Promise<HighlightRecord[]>;
  createHighlight(
    userId: string,
    bookId: string,
    location: string,
    selectedText: string,
    color?: string,
  ): Promise<HighlightRecord>;
  deleteHighlight(id: string, userId: string): Promise<boolean>;
}
