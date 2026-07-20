export interface SearchRankingDocument {
  ts_rank?: number;
  popularity_score: number;
  rating: number;
  download_count: number;
}

/**
 * Strategy for ranking search results.
 * This decoupled interface allows us to swap out ranking implementations
 * (e.g. Postgres FTS, Vector Search, Elasticsearch) without changing the read models.
 */
export interface SearchRankingStrategy {
  /**
   * Calculates a final relevance score for a document.
   */
  score(document: SearchRankingDocument): number;
}
