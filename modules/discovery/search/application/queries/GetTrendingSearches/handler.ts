import { GetTrendingSearchesQuery } from "./query";
import { SupabaseSearchReadModel } from "../../../infrastructure/read-models/SupabaseSearchReadModel";

export class GetTrendingSearchesHandler {
  constructor(private readonly searchReadModel: SupabaseSearchReadModel) {}

  async handle(query: GetTrendingSearchesQuery): Promise<string[]> {
    return this.searchReadModel.getTrendingSearches();
  }
}
