import { RecommendationContext } from "../../domain/value-objects/RecommendationContext";

/**
 * RecommendationContextProvider
 *
 * Abstracts building the user's RecommendationContext by querying other bounded contexts
 * (e.g., Library, Profile) via their Read Models.
 */
export interface RecommendationContextProvider {
  getForUser(userId: string): Promise<RecommendationContext>;
}
