export interface HighlightDto {
  id: string;
  bookId: string;
  text: string;
  location: string;
  chapter?: string | null;
  color: string;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
}
