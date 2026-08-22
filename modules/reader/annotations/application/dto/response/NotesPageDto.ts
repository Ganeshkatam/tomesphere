export interface NoteSummaryDto {
  id: string;
  bookId: string | null;
  bookTitle?: string;
  title: string;
  content: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface NotesPageDto {
  items: NoteSummaryDto[];
  nextCursor: string | null;
}
