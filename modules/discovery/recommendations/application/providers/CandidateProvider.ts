import { RecommendationCandidate } from '../../domain/value-objects/RecommendationCandidate';
import { AuthorId, CategoryId, BookId } from '../../domain/value-objects/RecommendationContext';

export type CandidateIntent = 
    | 'Popular' 
    | 'RecentlyAdded' 
    | { type: 'Category'; categoryId: CategoryId } 
    | { type: 'Author'; authorId: AuthorId } 
    | { type: 'Related'; bookId: BookId }
    | 'Seasonal';

export interface CandidateProvider {
    retrieveCandidates(intent: CandidateIntent, limit: number): Promise<RecommendationCandidate[]>;
}
