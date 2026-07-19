import { RankedRecommendation } from "../strategies/RecommendationStrategy";

export interface DiversificationResult {
  readonly recommendations: readonly RankedRecommendation[];
  readonly removedDuplicatesCount: number;
  readonly reorderedCount: number;
  readonly appliedPolicies: readonly string[];
}

export interface DiversificationPolicy {
  diversify(ranked: readonly RankedRecommendation[]): DiversificationResult;
}
