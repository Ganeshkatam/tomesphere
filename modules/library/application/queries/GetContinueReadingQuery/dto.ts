export interface ContinueReadingDto {
  bookId: string;
  title: string;
  author: string;
  coverUrl?: string;
  progressPercentage: number;
  currentPage?: number;
  totalPages?: number;
  lastReadAt: string;
}
