import { RecommendationCandidate } from "../value-objects/RecommendationCandidate";
import { RecommendationContext } from "../value-objects/RecommendationContext";
import { RecommendationReason } from "../value-objects/RecommendationReason";

export interface ScoreContribution {
  readonly scorerName: string;
  readonly score: number;
  readonly confidence?: number;
  readonly reason?: RecommendationReason;
}

export interface RecommendationScorer {
  score(
    candidate: RecommendationCandidate,
    context: RecommendationContext,
  ): ScoreContribution;
}
