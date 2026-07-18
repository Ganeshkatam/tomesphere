import { RecommendationContextProvider } from '../application/providers/RecommendationContextProvider';
import { RecommendationContext } from '../domain/value-objects/RecommendationContext';

import { SignalRepository } from '../domain/repositories/SignalRepository';

export class UserRecommendationContextProvider implements RecommendationContextProvider {
    constructor(private readonly signalRepository: SignalRepository) {}

    async getForUser(userId: string): Promise<RecommendationContext> {
        const interactions = await this.signalRepository.getUserInteractions(userId);
        
        const completedBookIds = interactions.filter(i => i.completionPercent >= 100).map(i => i.bookId);
        const currentlyReadingBookIds = interactions.filter(i => i.completionPercent > 0 && i.completionPercent < 100).map(i => i.bookId);
        
        return new RecommendationContext({
            favoriteCategories: [],
            favoriteAuthors: [],
            completedBookIds,
            currentlyReadingBookIds,
            wishlistBookIds: [],
            preferredLanguages: ['en'],
            interactions,
        });
    }
}
