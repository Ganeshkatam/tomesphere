export interface GetTrendingBooksQuery {
  readonly period: "daily" | "weekly" | "monthly" | "all-time";
  readonly genre?: string;
  readonly limit: number;
  readonly page: number;
}
