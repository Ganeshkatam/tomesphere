import { SearchRequest } from "../dto/SearchRequestDto";
import { SearchResponse } from "../dto/SearchResultDto";
import { SearchSuggestionDto } from "../dto/SearchSuggestionDto";

export interface SearchFacade {
  search(request: SearchRequest): Promise<SearchResponse>;
  autocomplete(query: string): Promise<SearchSuggestionDto[]>;
  recentSearches(userId: string): Promise<string[]>;
  trendingSearches(): Promise<string[]>;
}
