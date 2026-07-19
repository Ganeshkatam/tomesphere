export interface BookmarkDto {
  id: string;
  bookId: string;
  location: string;
  chapter?: string | null;
  name?: string | null;
  orderIndex: number;
  createdAt: string;
}
