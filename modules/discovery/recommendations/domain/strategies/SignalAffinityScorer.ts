import { RecommendationScorer, ScoreContribution } from './RecommendationScorer';
import { RecommendationCandidate } from '../value-objects/RecommendationCandidate';
import { RecommendationContext } from '../value-objects/RecommendationContext';
import { RecommendationReason } from '../value-objects/RecommendationReason';

export class SignalAffinityScorer implements RecommendationScorer {
    score(candidate: RecommendationCandidate, context: RecommendationContext): ScoreContribution {
        const interaction = context.interactions?.find(i => i.bookId === candidate.bookId);
        const feature = context.bookFeatures?.find(f => f.bookId === candidate.bookId);

        let finalScore = 0;

        // Base score from book features
        if (feature) {
            finalScore += feature.popularityScore * 0.2;
            finalScore += feature.trendingScore * 0.3;
        }

        // Apply interaction boosts
        if (interaction) {
            let interactionScore = 0;
            if (interaction.liked) {
                interactionScore += 1.0;
            }
            if (interaction.rating) {
                interactionScore += (interaction.rating / 5.0);
            }
            if (interaction.completionPercent > 0) {
                interactionScore += (interaction.completionPercent / 100.0) * 0.5;
            }
            
            // Recency decay for interaction relevance
            if (interaction.lastActivityAt) {
                const daysSinceActivity = (Date.now() - interaction.lastActivityAt.getTime()) / (1000 * 60 * 60 * 24);
                // 30 day half-life
                const recencyMultiplier = Math.exp(-daysSinceActivity / 30);
                interactionScore *= (0.5 + (0.5 * recencyMultiplier)); 
            }

            finalScore += interactionScore;
        }

        const reason: RecommendationReason = { type: 'signal-affinity' };

        return {
            scorerName: 'SignalAffinity',
            score: finalScore,
            reason
        };
    }
}
