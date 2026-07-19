import { CandidateFilter } from "./CandidateFilter";
import { RecommendationCandidate } from "../value-objects/RecommendationCandidate";
import { RecommendationContext } from "../value-objects/RecommendationContext";

export class LanguageFilter implements CandidateFilter {
  filter(
    candidates: readonly RecommendationCandidate[],
    context: RecommendationContext,
  ): readonly RecommendationCandidate[] {
    const preferredLangs = new Set(context.preferredLanguages);
    if (preferredLangs.size === 0) {
      return candidates;
    }
    return candidates.filter(
      (c) => c.language && preferredLangs.has(c.language),
    );
  }
}
