import { GetRecentSearchesQuery } from "./query";
import { SupabaseSearchReadModel } from "../../../infrastructure/read-models/SupabaseSearchReadModel";

export class GetRecentSearchesHandler {
  constructor(private readonly searchReadModel: SupabaseSearchReadModel) {}

  async handle(query: GetRecentSearchesQuery): Promise<string[]> {
    return this.searchReadModel.getRecentSearches(query.userId);
  }
}
