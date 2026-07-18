import { CandidateProvider } from '../providers/CandidateProvider';
import { CandidateFilter } from '../../domain/policies/CandidateFilter';
import { RecommendationStrategy } from '../../domain/strategies/RecommendationStrategy';
import { DiversificationPolicy } from '../../domain/policies/DiversificationPolicy';
import { RecommendationScenario } from '../../domain/value-objects/RecommendationScenario';

export interface RecommendationPlan {
    readonly scenario: RecommendationScenario;
    readonly providers: readonly CandidateProvider[];
    readonly filters: readonly CandidateFilter[];
    readonly strategy: RecommendationStrategy;
    readonly diversification: DiversificationPolicy;
}
