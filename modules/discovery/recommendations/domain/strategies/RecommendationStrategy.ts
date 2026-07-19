import { RecommendationContext } from "../value-objects/RecommendationContext";
import { RecommendationCandidate } from "../value-objects/RecommendationCandidate";
import { ScoreContribution } from "./RecommendationScorer";

export interface RankedRecommendation {
  readonly candidate: RecommendationCandidate;
  readonly score: number;
  readonly contributions: readonly ScoreContribution[];
}

export interface RecommendationStrategy {
  rank(
    candidates: readonly RecommendationCandidate[],
    context: RecommendationContext,
  ): readonly RankedRecommendation[];
}
