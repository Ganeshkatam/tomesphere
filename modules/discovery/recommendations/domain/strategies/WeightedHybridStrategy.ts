import {
  RecommendationStrategy,
  RankedRecommendation,
} from "./RecommendationStrategy";
import { RecommendationContext } from "../value-objects/RecommendationContext";
import { RecommendationCandidate } from "../value-objects/RecommendationCandidate";
import {
  RecommendationScorer,
  ScoreContribution,
} from "./RecommendationScorer";

export class WeightedHybridStrategy implements RecommendationStrategy {
  constructor(
    private readonly scorers: readonly {
      scorer: RecommendationScorer;
      weight: number;
    }[],
  ) {}

  rank(
    candidates: readonly RecommendationCandidate[],
    context: RecommendationContext,
  ): readonly RankedRecommendation[] {
    const recommendations: RankedRecommendation[] = [];

    for (const candidate of candidates) {
      const contributions: ScoreContribution[] = [];
      let totalScore = 0;

      for (const { scorer, weight } of this.scorers) {
        const contribution = scorer.score(candidate, context);
        const weightedScore = contribution.score * weight;

        contributions.push({
          scorerName: contribution.scorerName,
          score: weightedScore,
          confidence: contribution.confidence,
          reason: contribution.reason,
        });

        totalScore += weightedScore;
      }

      recommendations.push({
        candidate,
        score: totalScore,
        contributions,
      });
    }

    return recommendations.sort((a, b) => b.score - a.score);
  }
}
