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

import { SearchAnalyticsHandler } from "../event-handlers/SearchAnalyticsHandler";

export class ApplicationSearchFacade implements SearchFacade {
  constructor(
    private readonly searchResultsHandler: GetSearchResultsHandler,
    private readonly autocompleteHandler: GetAutocompleteSuggestionsHandler,
    private readonly recentSearchesHandler: GetRecentSearchesHandler,
    private readonly trendingSearchesHandler: GetTrendingSearchesHandler,
    private readonly eventBus: IEventBus,
    private readonly analyticsHandler?: SearchAnalyticsHandler,
  ) {}

  async search(
    request: SearchRequest,
    userPromise?: Promise<any>,
  ): Promise<SearchResponse> {
    const searchPromise = this.searchResultsHandler.handle(request);

    let resolvedUserId = request.userId;
    let response: SearchResponse;

    if (userPromise) {
      const [res, userResult] = await Promise.all([
        searchPromise,
        userPromise.catch(() => null),
      ]);
      response = res;
      if (!resolvedUserId && userResult?.data?.user?.id) {
        resolvedUserId = userResult.data.user.id;
      }
    } else {
      response = await searchPromise;
    }

    // Prepare search analytics payload
    const searchId = randomUUID();
    const payload = {
      searchId,
      userId: resolvedUserId,
      query: request.query,
      executionTimeMs: response.executionTimeMs,
      resultCount: response.totalCount,
      filters: request.filters || {},
      sort: request.sort || "relevance",
      timestamp: new Date().toISOString(),
    };

    // 1. Emit to EventBus
    try {
      this.eventBus.emit("discovery.search.executed", payload);
    } catch (err) {
      console.error(
        "[ApplicationSearchFacade] Failed to emit search analytics event",
        err,
      );
    }

    // 2. Direct durable persistence to search_history if analytics handler is injected
    if (this.analyticsHandler && request.query && request.query.trim().length > 0) {
      void this.analyticsHandler.handle(payload);
    }

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
