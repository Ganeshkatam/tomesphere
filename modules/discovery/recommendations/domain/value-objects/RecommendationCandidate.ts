import {
  AuthorId,
  CategoryId,
  BookId,
  LanguageCode,
} from "./RecommendationContext";

export interface RecommendationCandidate {
  bookId: BookId;
  title: string;
  authors: AuthorId[];
  categories: CategoryId[];
  language: LanguageCode;
  popularity: number;
  searchScore: number;
  coverUrl?: string;
}
