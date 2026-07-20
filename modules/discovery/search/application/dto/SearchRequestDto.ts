export interface SearchRequest {
  query: string;
  page: number;
  pageSize: number;
  sort: "relevance" | "popular" | "rating" | "newest";
  filters: {
    genres?: string[];
    subjects?: string[];
    language?: string[];
    publicationYear?: number[];
  };
  includeUnavailable?: boolean;
}
