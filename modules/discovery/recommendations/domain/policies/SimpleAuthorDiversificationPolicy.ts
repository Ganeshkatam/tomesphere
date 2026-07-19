import {
  DiversificationPolicy,
  DiversificationResult,
} from "./DiversificationPolicy";
import { RankedRecommendation } from "../strategies/RecommendationStrategy";

export class SimpleAuthorDiversificationPolicy implements DiversificationPolicy {
  diversify(ranked: readonly RankedRecommendation[]): DiversificationResult {
    const diversified: RankedRecommendation[] = [];
    let lastAuthor = "";
    let reorderedCount = 0;

    for (const item of ranked) {
      const primaryAuthor = item.candidate.authors?.[0] || "";
      if (primaryAuthor !== lastAuthor) {
        diversified.push(item);
        lastAuthor = primaryAuthor;
      } else {
        reorderedCount++;
      }
    }

    return {
      recommendations: diversified,
      removedDuplicatesCount: 0,
      reorderedCount,
      appliedPolicies: ["SimpleAuthorDiversification"],
    };
  }
}
