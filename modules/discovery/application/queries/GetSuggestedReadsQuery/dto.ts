export interface SuggestedReadDto {
  bookId: string;
  title: string;
  author: string;
  coverUrl?: string;
  reason: string;
}

export interface SuggestedReadsDto {
  suggestions: SuggestedReadDto[];
}
