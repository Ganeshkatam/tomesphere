import { SearchFacetDto } from "./SearchFacetDto";

export interface SearchResult {
  id: string; // book_id
  slug: string;
  title: string;
  subtitle?: string;
  authors: string[];
  genres: string[];
  subjects: string[];
  language: string;
  averageRating: number;
  ratingCount: number;
  popularityScore: number;
  relevanceScore: number;
}

export interface SearchResponse {
  results: SearchResult[];
  totalCount: number;
  totalPages: number;
  facets: SearchFacetDto[]; // Always returned, empty for Sprint 2
  page: number;
  pageSize: number;
  executionTimeMs: number;
  isTypoFallback?: boolean;
  suggestedQuery?: string;
}
