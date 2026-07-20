export class GetSearchResultsQuery {
  constructor(
    public readonly query: string,
    public readonly page: number,
    public readonly pageSize: number,
    public readonly sort: "relevance" | "newest" | "popularity" | "rating",
    public readonly filters: Record<string, string[]>,
    public readonly cursor?: string,
  ) {}
}
