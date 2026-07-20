import {
  SearchRankingStrategy,
  SearchRankingDocument,
} from "./SearchRankingStrategy";

/**
 * Default ranking strategy for PostgreSQL Full-Text Search.
 * Formula: Score = 0.45(ts_rank) + 0.20(popularity) + 0.15(rating) + 0.20(downloads_normalized)
 */
export class PostgresRankingStrategy implements SearchRankingStrategy {
  score(document: SearchRankingDocument): number {
    const tsRank = document.ts_rank || 0;

    // Normalize values to a reasonable scale (0 to 1 ideally)
    // For popularity/rating, we assume 0-5 for rating, and 0-100 for popularity (or similar)
    // Adjust weights based on actual data distribution in production
    const normalizedPopularity = Math.min(document.popularity_score / 100, 1);
    const normalizedRating = document.rating / 5;
    const normalizedDownloads = Math.min(document.download_count / 1000, 1);

    const score =
      0.45 * tsRank +
      0.2 * normalizedPopularity +
      0.15 * normalizedRating +
      0.2 * normalizedDownloads;

    return score;
  }
}
