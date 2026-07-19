import {
  RecommendationScorer,
  ScoreContribution,
} from "./RecommendationScorer";
import { RecommendationContext } from "../value-objects/RecommendationContext";
import { RecommendationCandidate } from "../value-objects/RecommendationCandidate";

export class PopularityScorer implements RecommendationScorer {
  score(
    candidate: RecommendationCandidate,
    context: RecommendationContext,
  ): ScoreContribution {
    return {
      scorerName: "PopularityScorer",
      score: candidate.popularity || 0,
      reason: { type: "trending" },
    };
  }
}
