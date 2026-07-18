import { RecommendationCandidate } from '../value-objects/RecommendationCandidate';
import { RecommendationContext } from '../value-objects/RecommendationContext';

export interface CandidateFilter {
    filter(candidates: readonly RecommendationCandidate[], context: RecommendationContext): readonly RecommendationCandidate[];
}
