export interface GetPersonalizedRecommendationsQuery {
  userId: string;
  limit?: number; // Target number of recommendations to return
}
