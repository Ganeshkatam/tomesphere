import { SearchQuery } from "../value-objects/SearchQuery";

// Read Model representing a search result (this will be returned by our capability folder,
// but the ranking policy evaluates raw documents to produce scores)
// We'll define a simple generic interface for the scoring subject here.
export interface RankableDocument {
  title: string;
  description?: string;
  authors: string[];
  matchScore: number; // base score from the DB (e.g. FTS rank or pgvector distance)
  publishDate?: Date;
  popularityScore?: number;
}

export interface RankingPolicy {
  /**
   * Calculates a normalized relevance score for a document against a given query.
   */
  calculateScore(query: SearchQuery, document: RankableDocument): number;
}

export class DefaultRankingPolicy implements RankingPolicy {
  calculateScore(query: SearchQuery, document: RankableDocument): number {
    let score = document.matchScore;

    // In Phase 7A (Keyword search only), matchScore is likely the FTS rank.
    // We can boost it based on exact title matches or popularity.
    if (
      query.text &&
      document.title.toLowerCase().includes(query.text.toLowerCase())
    ) {
      score *= 1.5; // Title boost
    }

    if (document.popularityScore) {
      score += document.popularityScore * 0.1; // Slight popularity boost
    }

    return score;
  }
}
