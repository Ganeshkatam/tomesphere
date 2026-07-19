import { RecommendationReason } from "../../../domain/value-objects/RecommendationReason";
import { RecommendationSource } from "../../../domain/value-objects/RecommendationSource";

export interface RecommendationReadModel {
  bookId: string;
  title: string;
  authors: string[];
  coverUrl?: string;
  score: number;
  reason?: RecommendationReason;
  source: RecommendationSource;
  explanation?: string;
}
