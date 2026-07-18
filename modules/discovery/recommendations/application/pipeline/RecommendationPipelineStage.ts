import { RecommendationScenario } from '../../domain/value-objects/RecommendationScenario';

export interface PipelineExecutionContext {
    readonly correlationId: string;
    readonly requestId: string;
    readonly userId: string;
    readonly scenario: RecommendationScenario;
    readonly startedAt: Date;
    readonly cancellationToken?: AbortSignal;
}

export interface RecommendationPipelineObserver {
    stageStarted(stageName: string, context: PipelineExecutionContext): void;
    stageCompleted(stageName: string, context: PipelineExecutionContext, durationMs: number): void;
}

export interface RecommendationPipelineStage<TInput, TOutput> {
    execute(input: TInput, context: PipelineExecutionContext): Promise<TOutput> | TOutput;
}
