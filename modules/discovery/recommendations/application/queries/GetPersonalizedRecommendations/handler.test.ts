import { GetPersonalizedRecommendationsHandler } from './handler';
import { RecommendationContextProvider } from '../../providers/RecommendationContextProvider';
import { CandidateProvider, CandidateIntent } from '../../providers/CandidateProvider';
import { RecommendationContext } from '../../../domain/value-objects/RecommendationContext';
import { RecommendationCandidate } from '../../../domain/value-objects/RecommendationCandidate';
import { RecommendationExplanationService } from '../../services/RecommendationExplanationService';

class MockContextProvider implements RecommendationContextProvider {
    async getForUser(userId: string): Promise<RecommendationContext> {
        return new RecommendationContext({
            excludedBookIds: ['owned-1']
        });
    }
}

class MockCandidateProvider implements CandidateProvider {
    async retrieveCandidates(intent: CandidateIntent, limit: number): Promise<RecommendationCandidate[]> {
        return [
            { bookId: '1', title: 'Book 1', authors: ['Author A'], popularity: 10, categories: [], language: 'en', searchScore: 1 },
            { bookId: '2', title: 'Book 2', authors: ['Author A'], popularity: 9, categories: [], language: 'en', searchScore: 1 }, // Same author as above
            { bookId: 'owned-1', title: 'Owned Book', authors: ['Author B'], popularity: 8, categories: [], language: 'en', searchScore: 1 },
            { bookId: '3', title: 'Book 3', authors: ['Author C'], popularity: 7, categories: [], language: 'en', searchScore: 1 },
        ];
    }
}

describe('GetPersonalizedRecommendations Pipeline Orchestration', () => {
    let handler: GetPersonalizedRecommendationsHandler;

    beforeEach(() => {
        handler = new GetPersonalizedRecommendationsHandler(
            new MockContextProvider(),
            new MockCandidateProvider(),
            new RecommendationExplanationService()
        );
    });

    it('retrieves, filters, ranks, and diversifies candidates via RecommendationPipeline', async () => {
        const result = await handler.execute({ userId: 'user-123', limit: 5 });

        expect(result.success).toBe(true);
        if (result.success) {
            const recs = result.data;
            
            // Should exclude 'owned-1'
            expect(recs.some((r: any) => r.bookId === 'owned-1')).toBe(false);

            // Should filter out back-to-back Author A (Book 2 should be missing due to author diversification)
            expect(recs.some((r: any) => r.bookId === '2')).toBe(false);

            // Remaining should be Book 1 and Book 3, in that order
            expect(recs).toHaveLength(2);
            expect(recs[0].bookId).toBe('1');
            expect(recs[1].bookId).toBe('3');
            expect(recs[0].explanation).toBeDefined();
        }
    });
});
