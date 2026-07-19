export interface CurrentReadingBookDto {
  bookId: string;
  title: string;
  author: string;
  coverUrl?: string;
  progressPercentage: number;
}

export interface CurrentReadingDto {
  books: CurrentReadingBookDto[];
}
