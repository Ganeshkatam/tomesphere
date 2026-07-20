"use server";

import { supabase } from "@/shared/core/database/client";
import { ApplicationSearchFacade } from "../../application/facades/ApplicationSearchFacade";
import { GetSearchResultsHandler } from "../../application/queries/GetSearchResults/handler";
import { GetAutocompleteSuggestionsHandler } from "../../application/queries/GetAutocompleteSuggestions/handler";
import { GetRecentSearchesHandler } from "../../application/queries/GetRecentSearches/handler";
import { GetTrendingSearchesHandler } from "../../application/queries/GetTrendingSearches/handler";
import { SupabaseSearchReadModel } from "../../infrastructure/read-models/SupabaseSearchReadModel";
import { SearchRequest } from "../../application/dto/SearchRequestDto";
import { eventBus } from "@/shared/core/events/EventBus";

async function getFacade() {
  const readModel = new SupabaseSearchReadModel(supabase);

  return new ApplicationSearchFacade(
    new GetSearchResultsHandler(readModel),
    new GetAutocompleteSuggestionsHandler(readModel),
    new GetRecentSearchesHandler(readModel),
    new GetTrendingSearchesHandler(readModel),
    eventBus,
  );
}

export async function searchAction(request: SearchRequest) {
  const facade = await getFacade();
  return facade.search(request);
}

export async function autocompleteAction(query: string) {
  const facade = await getFacade();
  return facade.autocomplete(query);
}

export async function getTrendingSearchesAction() {
  const facade = await getFacade();
  return facade.trendingSearches();
}

export async function getRecentSearchesAction() {
  // In a real SSR environment, you would use createServerClient and pass cookies
  // to get the auth user. We fall back to standard client for now.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const facade = await getFacade();
  return facade.recentSearches(user.id);
}
