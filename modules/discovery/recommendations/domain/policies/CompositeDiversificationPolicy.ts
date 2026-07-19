import {
  DiversificationPolicy,
  DiversificationResult,
} from "./DiversificationPolicy";
import { RankedRecommendation } from "../strategies/RecommendationStrategy";

export class CompositeDiversificationPolicy implements DiversificationPolicy {
  constructor(private readonly policies: readonly DiversificationPolicy[]) {}

  diversify(ranked: readonly RankedRecommendation[]): DiversificationResult {
    let currentRecommendations = ranked;
    let totalRemovedDuplicates = 0;
    let totalReordered = 0;
    const applied: string[] = [];

    for (const policy of this.policies) {
      const res = policy.diversify(currentRecommendations);
      currentRecommendations = res.recommendations;
      totalRemovedDuplicates += res.removedDuplicatesCount;
      totalReordered += res.reorderedCount;
      applied.push(...res.appliedPolicies);
    }

    return {
      recommendations: currentRecommendations,
      removedDuplicatesCount: totalRemovedDuplicates,
      reorderedCount: totalReordered,
      appliedPolicies: applied,
    };
  }
}
