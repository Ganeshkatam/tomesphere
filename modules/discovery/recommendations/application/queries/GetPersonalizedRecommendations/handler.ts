import { GetPersonalizedRecommendationsQuery } from "./query";
import { RecommendationReadModel } from "../read-models/RecommendationReadModel";
import { CandidateProvider } from "../../providers/CandidateProvider";
import { RecommendationContextProvider } from "../../providers/RecommendationContextProvider";
import { RecommendationPipeline } from "../../pipeline/RecommendationPipeline";
import { RecommendationPlan } from "../../pipeline/RecommendationPlan";
import { PipelineExecutionContext } from "../../pipeline/RecommendationPipelineStage";
import { RecommendationExplanationService } from "../../services/RecommendationExplanationService";
import { RecommendationScenario } from "../../../domain/value-objects/RecommendationScenario";
import { OwnershipFilter } from "../../../domain/policies/OwnershipFilter";
import { LanguageFilter } from "../../../domain/policies/LanguageFilter";
import { PopularityScorer } from "../../../domain/strategies/PopularityScorer";
import { CategoryAffinityScorer } from "../../../domain/strategies/CategoryAffinityScorer";
import { SignalAffinityScorer } from "../../../domain/strategies/SignalAffinityScorer";
import { WeightedHybridStrategy } from "../../../domain/strategies/WeightedHybridStrategy";
import { SimpleAuthorDiversificationPolicy } from "../../../domain/policies/SimpleAuthorDiversificationPolicy";

export class GetPersonalizedRecommendationsHandler {
  constructor(
    private readonly contextProvider: RecommendationContextProvider,
    private readonly candidateProvider: CandidateProvider,
    private readonly explanationService: RecommendationExplanationService,
  ) {}

  async execute(
    query: GetPersonalizedRecommendationsQuery,
  ): Promise<RecommendationReadModel[]> {
    try {
      // 1. Fetch user context
      const context = await this.contextProvider.getForUser(query.userId);

      // 2. Define the declarative immutable RecommendationPlan
      const plan: RecommendationPlan = {
        scenario: RecommendationScenario.Personalized,
        providers: [this.candidateProvider],
        filters: [new OwnershipFilter(), new LanguageFilter()],
        strategy: new WeightedHybridStrategy([
          { scorer: new PopularityScorer(), weight: 1.0 },
          { scorer: new CategoryAffinityScorer(), weight: 1.5 },
          { scorer: new SignalAffinityScorer(), weight: 2.0 },
        ]),
        diversification: new SimpleAuthorDiversificationPolicy(),
      };

      // 3. Define the Execution Context for pipeline orchestration/telemetry
      const execContext: PipelineExecutionContext = {
        correlationId: `corr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        requestId: `req-${Date.now()}`,
        userId: query.userId,
        scenario: RecommendationScenario.Personalized,
        startedAt: new Date(),
      };

      // 4. Execute the pipeline
      const pipeline = new RecommendationPipeline();
      const rankedRecommendations = await pipeline.execute(
        plan,
        context,
        execContext,
      );

      // 5. Format results with explanation service and map to Read Model
      const limit = query.limit || 20;
      const results: RecommendationReadModel[] = rankedRecommendations
        .slice(0, limit)
        .map((r) => ({
          bookId: r.candidate.bookId,
          title: r.candidate.title,
          authors: r.candidate.authors,
          coverUrl: r.candidate.coverUrl,
          score: r.score,
          reason: r.contributions[0]?.reason, // Keep the structured top reason for rich UI options
          source: "Personalized",
          explanation: this.explanationService.explain(r), // Add generated explanation string
        }));

      return results;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Unknown error getting recommendations",
      );
    }
  }
}
