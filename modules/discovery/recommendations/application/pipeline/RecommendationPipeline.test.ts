import { RecommendationPipeline } from "./RecommendationPipeline";
import { RecommendationPlan } from "./RecommendationPlan";
import {
  PipelineExecutionContext,
  RecommendationPipelineObserver,
} from "./RecommendationPipelineStage";
import { RecommendationContext } from "../../domain/value-objects/RecommendationContext";
import { RecommendationScenario } from "../../domain/value-objects/RecommendationScenario";
import {
  CandidateProvider,
  CandidateIntent,
} from "../providers/CandidateProvider";
import { RecommendationCandidate } from "../../domain/value-objects/RecommendationCandidate";
import { OwnershipFilter } from "../../domain/policies/OwnershipFilter";
import { LanguageFilter } from "../../domain/policies/LanguageFilter";
import { PopularityScorer } from "../../domain/strategies/PopularityScorer";
import { WeightedHybridStrategy } from "../../domain/strategies/WeightedHybridStrategy";
import { SimpleAuthorDiversificationPolicy } from "../../domain/policies/SimpleAuthorDiversificationPolicy";

class MockObserver implements RecommendationPipelineObserver {
  public readonly startedStages: string[] = [];
  public readonly completedStages: string[] = [];

  stageStarted(stageName: string, context: PipelineExecutionContext): void {
    this.startedStages.push(stageName);
  }

  stageCompleted(
    stageName: string,
    context: PipelineExecutionContext,
    durationMs: number,
  ): void {
    this.completedStages.push(stageName);
  }
}

class MockProvider implements CandidateProvider {
  async retrieveCandidates(
    intent: CandidateIntent,
    limit: number,
  ): Promise<RecommendationCandidate[]> {
    return [
      {
        bookId: "1",
        title: "Book 1",
        authors: ["Author A"],
        popularity: 10,
        categories: [],
        language: "en",
        searchScore: 1,
      },
      {
        bookId: "2",
        title: "Book 2",
        authors: ["Author B"],
        popularity: 8,
        categories: [],
        language: "fr",
        searchScore: 1,
      },
    ];
  }
}

describe("RecommendationPipeline", () => {
  it("notifies observers of stage execution and successfully executes plan stages", async () => {
    const observer = new MockObserver();
    const pipeline = new RecommendationPipeline([observer]);

    const plan: RecommendationPlan = {
      scenario: RecommendationScenario.Personalized,
      providers: [new MockProvider()],
      filters: [new OwnershipFilter(), new LanguageFilter()],
      strategy: new WeightedHybridStrategy([
        { scorer: new PopularityScorer(), weight: 1.0 },
      ]),
      diversification: new SimpleAuthorDiversificationPolicy(),
    };

    const context = new RecommendationContext({
      preferredLanguages: ["en"], // filters out French
    });

    const execContext: PipelineExecutionContext = {
      correlationId: "corr-id",
      requestId: "req-id",
      userId: "user-id",
      scenario: RecommendationScenario.Personalized,
      startedAt: new Date(),
    };

    const results = await pipeline.execute(plan, context, execContext);

    expect(results).toHaveLength(1);
    expect(results[0].candidate.bookId).toBe("1"); // Book 2 filtered out due to language

    // Verify Observers were notified
    expect(observer.startedStages).toContain("CandidateRetriever");
    expect(observer.startedStages).toContain("CompositeFilter");
    expect(observer.startedStages).toContain("WeightedRanking");
    expect(observer.startedStages).toContain("Diversification");

    expect(observer.completedStages).toHaveLength(4);
  });
});
