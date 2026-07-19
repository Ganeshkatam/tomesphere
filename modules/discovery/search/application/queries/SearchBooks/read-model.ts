export interface SearchResultReadModel {
  bookId: string;
  title: string;
  subtitle?: string;
  authors: string[];
  coverUrl?: string; // In a real app we might fetch this from a CDN or join
  descriptionSnippet?: string;
  categories?: string[];
  language?: string;
  score: number;
  matchedTerms?: string[];
  highlights?: string[]; // E.g., snippets where terms matched
}

export interface SearchResponseReadModel {
  results: SearchResultReadModel[];
  totalCount: number;
  hasMore: boolean;
}
