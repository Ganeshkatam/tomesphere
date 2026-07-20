import { SearchRequest } from "../../dto/SearchRequestDto";
import { SearchResponse } from "../../dto/SearchResultDto";
import { SupabaseSearchReadModel } from "../../../infrastructure/read-models/SupabaseSearchReadModel";

export class GetSearchResultsHandler {
  constructor(private readonly searchReadModel: SupabaseSearchReadModel) {}

  async handle(request: SearchRequest): Promise<SearchResponse> {
    return this.searchReadModel.search(request);
  }
}
