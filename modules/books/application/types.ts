export interface SearchBooksInput {
  readonly query: string;
  readonly limit?: number;
  readonly offset?: number;
}

export interface SearchBooksOutput<T> {
  readonly items: T[];
  readonly totalCount?: number;
  readonly page?: number;
}

export interface TrendingOptions {
  readonly limit: number;
  readonly timeframe?: "day" | "week" | "month" | "all-time";
  readonly category?: string;
}
