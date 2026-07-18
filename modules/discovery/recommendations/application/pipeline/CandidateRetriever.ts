import { RecommendationPipelineStage, PipelineExecutionContext } from './RecommendationPipelineStage';
import { RecommendationCandidate } from '../../domain/value-objects/RecommendationCandidate';
import { CandidateProvider } from '../providers/CandidateProvider';

export class CandidateRetriever implements RecommendationPipelineStage<void, RecommendationCandidate[]> {
    constructor(private readonly providers: readonly CandidateProvider[]) {}

    async execute(input: void, context: PipelineExecutionContext): Promise<RecommendationCandidate[]> {
        // Step 1: Collector
        const rawPool = await this.collect();

        // Step 2: Deduplicator
        const dedupedPool = this.deduplicate(rawPool);

        // Step 3: Normalizer
        const normalizedPool = this.normalize(dedupedPool);

        return normalizedPool;
    }

    private async collect(): Promise<RecommendationCandidate[]> {
        const collectPromises = this.providers.map(provider => 
            // In a real application, we might request specific sizes or intents.
            // For general personalized recommendation pool, we query for a substantial limit.
            provider.retrieveCandidates('Popular', 100).catch(err => {
                console.error(`CandidateProvider error:`, err);
                return [] as RecommendationCandidate[];
            })
        );
        const results = await Promise.all(collectPromises);
        return results.flat();
    }

    private deduplicate(candidates: RecommendationCandidate[]): RecommendationCandidate[] {
        const seen = new Set<string>();
        const unique: RecommendationCandidate[] = [];

        for (const candidate of candidates) {
            if (!seen.has(candidate.bookId)) {
                seen.add(candidate.bookId);
                unique.push(candidate);
            } else {
                // Duplicate found. We could optionally merge scores here.
            }
        }

        return unique;
    }

    private normalize(candidates: RecommendationCandidate[]): RecommendationCandidate[] {
        return candidates.map(c => {
            // Strictly structural/data normalization (lowercasing lang codes, sorting authors, ensuring defaults)
            // No recommendation logic or candidate removal occurs here.
            return {
                ...c,
                language: c.language ? c.language.toLowerCase().trim() : 'en',
                authors: (c.authors || []).map(a => a.trim()).sort(),
                categories: (c.categories || []).map(cat => cat.trim()).sort(),
                popularity: Math.max(0, Math.min(100, c.popularity || 0)) // popularity scaled between 0 and 100
            };
        });
    }
}
