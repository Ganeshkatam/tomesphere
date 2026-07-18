import { WeightedHybridStrategy } from './WeightedHybridStrategy';
import { PopularityScorer } from './PopularityScorer';
import { CategoryAffinityScorer } from './CategoryAffinityScorer';
import { RecommendationContext } from '../value-objects/RecommendationContext';
import { RecommendationCandidate } from '../value-objects/RecommendationCandidate';

describe('WeightedHybridStrategy', () => {
    it('combines scores from multiple scorers and preserves diagnostic contributions', () => {
        const popScorer = new PopularityScorer();
        const catScorer = new CategoryAffinityScorer();
        const strategy = new WeightedHybridStrategy([
            { scorer: popScorer, weight: 1.0 },
            { scorer: catScorer, weight: 2.0 }
        ]);

        const context = new RecommendationContext({
            favoriteCategories: ['Sci-Fi']
        });

        const candidates: RecommendationCandidate[] = [
            { bookId: '1', title: 'Popular Non-SciFi', authors: [], popularity: 5, categories: ['History'], language: 'en', searchScore: 0 },
            { bookId: '2', title: 'Unpopular SciFi', authors: [], popularity: 1, categories: ['Sci-Fi'], language: 'en', searchScore: 0 },
            { bookId: '3', title: 'Popular SciFi', authors: [], popularity: 4, categories: ['Sci-Fi'], language: 'en', searchScore: 0 },
        ];

        const ranked = strategy.rank(candidates, context);

        expect(ranked).toHaveLength(3);
        
        // Popular SciFi: pop 4*1 + cat 12*2 = 28
        expect(ranked[0].candidate.bookId).toBe('3');
        expect(ranked[0].score).toBe(28);
        expect(ranked[0].contributions).toHaveLength(2);
        expect(ranked[0].contributions.find(c => c.scorerName === 'CategoryAffinityScorer')?.score).toBe(24);

        // Unpopular SciFi: pop 1*1 + cat 12*2 = 25
        expect(ranked[1].candidate.bookId).toBe('2');
        expect(ranked[1].score).toBe(25);

        // Popular Non-SciFi: pop 5*1 + cat 0 = 5
        expect(ranked[2].candidate.bookId).toBe('1');
        expect(ranked[2].score).toBe(5);
    });
});
