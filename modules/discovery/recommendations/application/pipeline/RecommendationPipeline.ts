import { RecommendationPipelineStage, PipelineExecutionContext, RecommendationPipelineObserver } from './RecommendationPipelineStage';
import { RecommendationPlan } from './RecommendationPlan';
import { RecommendationContext } from '../../domain/value-objects/RecommendationContext';
import { RecommendationCandidate } from '../../domain/value-objects/RecommendationCandidate';
import { RankedRecommendation } from '../../domain/strategies/RecommendationStrategy';
import { DiversificationResult } from '../../domain/policies/DiversificationPolicy';
import { CandidateRetriever } from './CandidateRetriever';

export class RecommendationPipeline {
    private readonly observers: RecommendationPipelineObserver[] = [];

    constructor(observers?: RecommendationPipelineObserver[]) {
        if (observers) {
            this.observers = observers;
        }
    }

    async execute(
        plan: RecommendationPlan,
        context: RecommendationContext,
        execContext: PipelineExecutionContext
    ): Promise<readonly RankedRecommendation[]> {
        // Stage 1: Retrieval
        const retriever = new CandidateRetriever(plan.providers);
        const candidates = await this.runStage('CandidateRetriever', retriever, undefined, execContext);

        // Stage 2: Filtering
        const filteredCandidates = this.runStageSync('CompositeFilter', {
            execute: (input) => {
                let current: readonly RecommendationCandidate[] = input;
                for (const filter of plan.filters) {
                    current = filter.filter(current, context);
                }
                return current;
            }
        }, candidates, execContext);

        // Stage 3: Ranking
        const ranked = this.runStageSync('WeightedRanking', {
            execute: (input) => plan.strategy.rank(input, context)
        }, filteredCandidates, execContext);

        // Stage 4: Diversification
        const diversifiedResult = this.runStageSync('Diversification', {
            execute: (input) => plan.diversification.diversify(input)
        }, ranked, execContext);

        return diversifiedResult.recommendations;
    }

    private async runStage<TIn, TOut>(
        name: string,
        stage: RecommendationPipelineStage<TIn, TOut>,
        input: TIn,
        context: PipelineExecutionContext
    ): Promise<TOut> {
        this.notifyStarted(name, context);
        const start = Date.now();
        const output = await stage.execute(input, context);
        const duration = Date.now() - start;
        this.notifyCompleted(name, context, duration);
        return output;
    }

    private runStageSync<TIn, TOut>(
        name: string,
        stage: { execute(input: TIn, context: PipelineExecutionContext): TOut },
        input: TIn,
        context: PipelineExecutionContext
    ): TOut {
        this.notifyStarted(name, context);
        const start = Date.now();
        const output = stage.execute(input, context);
        const duration = Date.now() - start;
        this.notifyCompleted(name, context, duration);
        return output;
    }

    private notifyStarted(stageName: string, context: PipelineExecutionContext): void {
        for (const observer of this.observers) {
            observer.stageStarted(stageName, context);
        }
    }

    private notifyCompleted(stageName: string, context: PipelineExecutionContext, durationMs: number): void {
        for (const observer of this.observers) {
            observer.stageCompleted(stageName, context, durationMs);
        }
    }
}
