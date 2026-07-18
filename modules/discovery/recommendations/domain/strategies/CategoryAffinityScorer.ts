import { RecommendationScorer, ScoreContribution } from './RecommendationScorer';
import { RecommendationContext } from '../value-objects/RecommendationContext';
import { RecommendationCandidate } from '../value-objects/RecommendationCandidate';

export class CategoryAffinityScorer implements RecommendationScorer {
    score(candidate: RecommendationCandidate, context: RecommendationContext): ScoreContribution {
        const favoriteCategories = new Set(context.favoriteCategories);

        if (favoriteCategories.size === 0) {
            return { scorerName: 'CategoryAffinityScorer', score: 0 };
        }

        const matchCount = (candidate.categories || []).filter(c => favoriteCategories.has(c)).length;
        const score = matchCount > 0 ? 10 + (matchCount * 2) : 0;
        
        return {
            scorerName: 'CategoryAffinityScorer',
            score,
            reason: matchCount > 0 ? { 
                type: 'favorite-category', 
                categoryId: candidate.categories?.find(c => favoriteCategories.has(c)) || '' 
            } : undefined
        };
    }
}
