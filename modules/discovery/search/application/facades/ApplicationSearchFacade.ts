import { SearchFacade } from "./SearchFacade";
import { SearchRequest } from "../dto/SearchRequestDto";
import { SearchResponse } from "../dto/SearchResultDto";
import { SearchSuggestionDto } from "../dto/SearchSuggestionDto";
import { GetSearchResultsHandler } from "../queries/GetSearchResults/handler";
import { GetAutocompleteSuggestionsQuery } from "../queries/GetAutocompleteSuggestions/query";
import { GetAutocompleteSuggestionsHandler } from "../queries/GetAutocompleteSuggestions/handler";
import { GetRecentSearchesQuery } from "../queries/GetRecentSearches/query";
import { GetRecentSearchesHandler } from "../queries/GetRecentSearches/handler";
import { GetTrendingSearchesQuery } from "../queries/GetTrendingSearches/query";
import { GetTrendingSearchesHandler } from "../queries/GetTrendingSearches/handler";
import { IEventBus } from "@/shared/core/events/types";
import { randomUUID } from "crypto";

export class ApplicationSearchFacade implements SearchFacade {
  constructor(
    private readonly searchResultsHandler: GetSearchResultsHandler,
    private readonly autocompleteHandler: GetAutocompleteSuggestionsHandler,
    private readonly recentSearchesHandler: GetRecentSearchesHandler,
    private readonly trendingSearchesHandler: GetTrendingSearchesHandler,
    private readonly eventBus: IEventBus,
  ) {}

  async search(request: SearchRequest): Promise<SearchResponse> {
    const response = await this.searchResultsHandler.handle(request);

    // Fire-and-forget analytics event
    const searchId = randomUUID();
    setImmediate(() => {
      try {
        this.eventBus.emit("discovery.search.executed", {
          searchId,
          query: request.query,
          executionTimeMs: response.executionTimeMs,
          resultCount: response.totalCount,
          filters: request.filters || {},
          sort: request.sort || "relevance",
          timestamp: new Date().toISOString(),
        });
      } catch (err) {
        console.error(
          "[ApplicationSearchFacade] Failed to emit search analytics event",
          err,
        );
      }
    });

    return response;
  }

  async autocomplete(query: string): Promise<SearchSuggestionDto[]> {
    return this.autocompleteHandler.handle(
      new GetAutocompleteSuggestionsQuery(query),
    );
  }

  async recentSearches(userId: string): Promise<string[]> {
    return this.recentSearchesHandler.handle(
      new GetRecentSearchesQuery(userId),
    );
  }

  async trendingSearches(): Promise<string[]> {
    return this.trendingSearchesHandler.handle(new GetTrendingSearchesQuery());
  }
}
