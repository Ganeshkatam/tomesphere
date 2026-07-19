import { CandidateFilter } from "./CandidateFilter";
import { RecommendationCandidate } from "../value-objects/RecommendationCandidate";
import { RecommendationContext } from "../value-objects/RecommendationContext";

export class OwnershipFilter implements CandidateFilter {
  filter(
    candidates: readonly RecommendationCandidate[],
    context: RecommendationContext,
  ): readonly RecommendationCandidate[] {
    const excludedIds = new Set(context.excludedBookIds);
    return candidates.filter((c) => !excludedIds.has(c.bookId));
  }
}
