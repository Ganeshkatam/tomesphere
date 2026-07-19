export interface ContinueReadingDto {
  bookId: string;
  title: string;
  author: string;
  coverUrl?: string;
  progressPercentage: number;
  lastReadAt: string;
}
