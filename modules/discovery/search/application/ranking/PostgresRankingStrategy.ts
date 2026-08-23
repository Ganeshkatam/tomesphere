import {
  SearchRankingStrategy,
  SearchRankingDocument,
} from "./SearchRankingStrategy";

/**
 * Default ranking strategy for PostgreSQL Full-Text Search.
 * Formula: Score = 0.50(ts_rank) + 0.30(popularity) + 0.20(rating)
 */
export class PostgresRankingStrategy implements SearchRankingStrategy {
  score(document: SearchRankingDocument): number {
    const tsRank = document.ts_rank || 0;

    // Normalize values to a reasonable 0-1 scale
    const normalizedPopularity = Math.min(document.popularity_score / 100, 1);
    const normalizedRating = (document.rating || 0) / 5;

    const score =
      0.5 * tsRank +
      0.3 * normalizedPopularity +
      0.2 * normalizedRating;

    return score;
  }
}
