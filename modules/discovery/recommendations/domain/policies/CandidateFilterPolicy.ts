import { RecommendationCandidate } from "../value-objects/RecommendationCandidate";
import { RecommendationContext } from "../value-objects/RecommendationContext";

export interface CandidateFilterPolicy {
  filter(
    candidates: readonly RecommendationCandidate[],
    context: RecommendationContext,
  ): RecommendationCandidate[];
}

export class DefaultCandidateFilterPolicy implements CandidateFilterPolicy {
  filter(
    candidates: readonly RecommendationCandidate[],
    context: RecommendationContext,
  ): RecommendationCandidate[] {
    const excludedIds = new Set(context.excludedBookIds);
    const preferredLangs = new Set(context.preferredLanguages);

    return candidates.filter((c) => {
      if (excludedIds.has(c.bookId)) return false;

      if (
        preferredLangs.size > 0 &&
        c.language &&
        !preferredLangs.has(c.language)
      ) {
        return false;
      }

      return true;
    });
  }
}
