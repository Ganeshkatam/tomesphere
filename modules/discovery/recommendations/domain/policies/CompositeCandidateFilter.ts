import { CandidateFilter } from './CandidateFilter';
import { RecommendationCandidate } from '../value-objects/RecommendationCandidate';
import { RecommendationContext } from '../value-objects/RecommendationContext';

export class CompositeCandidateFilter implements CandidateFilter {
    constructor(private readonly filters: readonly CandidateFilter[]) {}

    filter(candidates: readonly RecommendationCandidate[], context: RecommendationContext): readonly RecommendationCandidate[] {
        let result = candidates;
        for (const f of this.filters) {
            result = f.filter(result, context);
        }
        return result;
    }
}
