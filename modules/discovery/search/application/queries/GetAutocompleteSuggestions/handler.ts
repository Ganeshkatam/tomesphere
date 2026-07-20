import { GetAutocompleteSuggestionsQuery } from "./query";
import { SearchSuggestionDto } from "../../dto/SearchSuggestionDto";
import { SupabaseSearchReadModel } from "../../../infrastructure/read-models/SupabaseSearchReadModel";

export class GetAutocompleteSuggestionsHandler {
  constructor(private readonly searchReadModel: SupabaseSearchReadModel) {}

  async handle(
    query: GetAutocompleteSuggestionsQuery,
  ): Promise<SearchSuggestionDto[]> {
    return this.searchReadModel.autocomplete(query.query);
  }
}
