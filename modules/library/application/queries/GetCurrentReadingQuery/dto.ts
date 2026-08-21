export interface CurrentReadingBookDto {
  bookId: string;
  title: string;
  author: string;
  coverUrl?: string;
  progressPercentage: number;
  currentPage?: number;
  totalPages?: number;
}

export interface CurrentReadingDto {
  books: CurrentReadingBookDto[];
}
