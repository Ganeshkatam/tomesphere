import { RankedRecommendation } from "../../domain/strategies/RecommendationStrategy";

export class RecommendationExplanationService {
  explain(recommendation: RankedRecommendation): string {
    const contributions = recommendation.contributions || [];
    if (contributions.length === 0) {
      return "Recommended for you";
    }

    // Find the scorer that contributed the highest score to this recommendation
    const sorted = [...contributions].sort((a, b) => b.score - a.score);
    const topContribution = sorted[0];

    if (!topContribution.reason) {
      return "Recommended for you";
    }

    switch (topContribution.reason.type) {
      case "favorite-author":
        return `Because you enjoy books by ${topContribution.reason.authorName || "this author"}`;
      case "favorite-category":
        return `Because you frequently read ${topContribution.reason.categoryName || topContribution.reason.categoryId || "this genre"}`;
      case "similar-book":
        return `Similar to ${topContribution.reason.sourceBookTitle || "a book you read"}`;
      case "trending":
        return "Popular and trending among readers";
      case "new-release":
        return "Recently released";
      case "highly-rated":
        return "Highly rated by the community";
      default:
        return "Recommended for you";
    }
  }
}
