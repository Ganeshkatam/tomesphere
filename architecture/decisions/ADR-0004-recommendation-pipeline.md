# ADR-0004: Modular Recommendation Pipeline Architecture

## Status
Approved

## Context
TomeSphere requires a personalized recommendation capability. Previously, search ranking and recommendations were highly coupled. To support multiple discovery scenarios (e.g., personalized feeds, trending books, editorial picks, similar books), we need a flexible, decoupled, and testable recommendation engine that is open for algorithmic extensions (Phase 8B, vector search, collaborative filtering) but closed for structural changes.

## Decision
We implement a **Pipes and Filters** architectural pattern for candidate recommendation. The recommendation flow is structured as a pipeline of independent, immutable, and testable stages orchestrated under an execution context.

```text
RecommendationRequest -> contextProvider -> RecommendationContext
                                                │
                                                ▼
RecommendationPlan ──► RecommendationPipeline.execute(plan, context, execContext)
                                                │
       ┌────────────────────────────────────────┴────────────────────────────────────────┐
       ▼                                        ▼                                        ▼
Stage 1: CandidateRetriever             Stage 2: CompositeFilter                 Stage 3: WeightedHybridStrategy
(Collect -> Normalize -> Deduplicate)  (Chains CandidateFilters)                (Scores via RecommendationScorers)
                                                                                         │
                                                                                         ▼
                                                                                Stage 4: CompositeDiversifier
                                                                                (Author/Category variety policies)
                                                                                         │
                                                                                         ▼
RankedRecommendation[] ◄── ExplanationService ◄──────────────────────────────────────────┘
```

### Core Design Rules
1. **Immutability**: Every pipeline stage receives an immutable input and returns a new immutable output. No stage mutates candidate collections in place.
2. **Decoupled Retrieval**: Recommendations never query search repositories directly. They depend on the abstract `CandidateProvider` interface returning `RecommendationCandidate` objects.
3. **Execution Context & Telemetry**: Pipeline stages accept a `PipelineExecutionContext` which carries correlation IDs, timestamps, and cancellation signals. Telemetry is handled passively by attaching a `RecommendationPipelineObserver`.
4. **Diagnostic Preservation**: The scoring stage preserves diagnostic `ScoreContribution` metadata (scorer name, score, confidence, reason) on the `RankedRecommendation`. This metadata is consumed later by `RecommendationExplanationService` to generate localized explanation strings.

## Consequences
- **High Composability**: Adding a new recommendation algorithm (e.g. collaborative filtering) only requires implementing a new `RecommendationScorer` or `CandidateProvider` and registering it in a declarative `RecommendationPlan`.
- **Testability**: Every scorer, filter, and diversifier can be unit-tested in isolation without mocking large repository layers.
- **Observability**: Execution performance and quality metrics (duplicate rates, reordered counts) are easily recorded via stage observers.
