# Project Structure

```text
tomesphere-app
├── .agents
│   └── AGENTS.md
├── .github
│   └── workflows
│       └── ci.yml
├── .vscode
│   └── settings.json
├── app
│   ├── (public)
│   │   ├── about
│   │   │   └── page.tsx
│   │   ├── careers
│   │   │   └── page.tsx
│   │   ├── contact
│   │   │   └── page.tsx
│   │   ├── cookies
│   │   │   └── page.tsx
│   │   ├── discover
│   │   │   ├── _components
│   │   │   │   └── DiscoverSidebar.tsx
│   │   │   ├── authors
│   │   │   │   └── page.tsx
│   │   │   ├── collections
│   │   │   │   └── page.tsx
│   │   │   ├── featured
│   │   │   │   └── page.tsx
│   │   │   ├── genres
│   │   │   │   └── page.tsx
│   │   │   ├── languages
│   │   │   │   └── page.tsx
│   │   │   ├── new
│   │   │   │   └── page.tsx
│   │   │   ├── search
│   │   │   │   ├── page.tsx
│   │   │   │   └── SearchClient.tsx
│   │   │   ├── subjects
│   │   │   │   └── page.tsx
│   │   │   ├── trending
│   │   │   │   ├── page.tsx
│   │   │   │   └── TrendingClient.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── forgot-password
│   │   │   └── page.tsx
│   │   ├── guidelines
│   │   │   └── page.tsx
│   │   ├── login
│   │   │   └── page.tsx
│   │   ├── login-phone
│   │   │   └── page.tsx
│   │   ├── marketing
│   │   │   └── page.tsx
│   │   ├── mission
│   │   │   └── page.tsx
│   │   ├── press
│   │   │   └── page.tsx
│   │   ├── privacy
│   │   │   └── page.tsx
│   │   ├── reset-password
│   │   │   └── page.tsx
│   │   ├── signup
│   │   │   └── page.tsx
│   │   ├── support
│   │   │   └── page.tsx
│   │   ├── terms
│   │   │   └── page.tsx
│   │   ├── verify-email
│   │   │   └── page.tsx
│   │   └── verify-password
│   │       └── page.tsx
│   ├── (workspace)
│   │   ├── books
│   │   │   └── [id]
│   │   │       └── page.tsx
│   │   ├── home
│   │   │   └── page.tsx
│   │   ├── library
│   │   │   └── page.tsx
│   │   ├── me
│   │   │   ├── collections
│   │   │   │   └── page.tsx
│   │   │   ├── preferences
│   │   │   │   └── page.tsx
│   │   │   ├── profile
│   │   │   │   └── page.tsx
│   │   │   ├── progress
│   │   │   │   └── page.tsx
│   │   │   ├── reading
│   │   │   │   └── page.tsx
│   │   │   ├── security
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── profile-setup
│   │   │   └── [id]
│   │   │       └── page.tsx
│   │   ├── read
│   │   │   └── [id]
│   │   │       └── page.tsx
│   │   └── layout.tsx
│   ├── api
│   │   └── cron
│   │       └── process-outbox
│   │           └── route.ts
│   ├── sitemap
│   │   └── page.tsx
│   ├── error.tsx
│   ├── globals-mobile-fix.css
│   ├── globals.css
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── not-found.tsx
│   ├── page.tsx
│   ├── providers.tsx
│   ├── template.tsx
│   └── theme-init.ts
├── architecture
│   ├── decisions
│   │   ├── ADR-0002-domain-splitting.md
│   │   ├── ADR-0003-repository-pattern.md
│   │   ├── ADR-0004-recommendation-pipeline.md
│   │   └── ADR-0005-event-driven-integration.md
│   ├── templates
│   │   └── ADR_TEMPLATE.md
│   ├── architecture-health.md
│   ├── backend.md
│   ├── capability-roadmap.md
│   ├── database.md
│   ├── dependency-map.md
│   ├── dependency-rules.md
│   ├── deployment.md
│   ├── design.md
│   ├── DOMAIN_DRIVEN_DESIGN_TEMPLATE.md
│   ├── frontend.md
│   ├── module-lifecycle.md
│   ├── reader.md
│   ├── README.md
│   ├── security.md
│   └── testing.md
├── docs
│   ├── architecture
│   │   ├── audits
│   │   │   ├── DR-001-dashboard.md
│   │   │   ├── DR-002-analytics.md
│   │   │   ├── DR-003-profile.md
│   │   │   ├── DR-008-public-profile-discoverability.md
│   │   │   └── index.md
│   │   ├── governance
│   │   │   ├── ARCHITECTURE_GOVERNANCE.md
│   │   │   ├── DECISION_RECORD_TEMPLATE.md
│   │   │   ├── INVESTIGATION_PROCESS.md
│   │   │   └── TRACEABILITY_MATRIX.md
│   │   ├── milestones
│   │   │   └── MILESTONE-1.5.md
│   │   ├── ARCHITECTURE_FROZEN.md
│   │   └── PRODUCT_EVOLUTION.md
│   ├── reader
│   │   └── Reader_Experience.md
│   ├── tree
│   │   ├── project_structure_20260718_061326.md
│   │   ├── project_structure_20260718_131858.md
│   │   ├── project_structure_20260718_140508.md
│   │   ├── project_structure_20260718_143731.md
│   │   ├── project_structure_20260718_183631.md
│   │   ├── project_structure_20260718_194214.md
│   │   ├── project_structure_20260718_212327.md
│   │   ├── project_structure_20260719_110514.md
│   │   └── project_structure_20260719_115754.md
│   ├── ACTIVE_PRODUCT.md
│   ├── API_ARCHITECTURE.md
│   ├── API_ERROR_CODES.md
│   ├── API_LIFECYCLE.md
│   ├── API_STYLE_GUIDE.md
│   ├── DATABASE_LIFECYCLE.md
│   ├── LAUNCH_SCOPE.md
│   └── PRODUCT_ROADMAP.md
├── lib
│   ├── actions
│   │   └── action-result.ts
│   ├── hooks
│   │   └── useDebounce.ts
│   ├── logger.ts
│   ├── toast.tsx
│   ├── utils.ts
│   └── validators.ts
├── modules
│   ├── analytics
│   │   ├── application
│   │   │   └── event-handlers
│   │   │       └── AnalyticsEventHandlers.ts
│   │   ├── infrastructure
│   │   │   └── SupabaseAnalyticsProjectionStore.ts
│   │   └── AnalyticsModule.ts
│   ├── announcements
│   │   ├── application
│   │   │   ├── dto
│   │   │   │   └── AnnouncementDto.ts
│   │   │   ├── ports
│   │   │   │   └── read-models
│   │   │   │       └── AnnouncementReadModel.ts
│   │   │   └── queries
│   │   │       └── GetActiveAnnouncements
│   │   │           ├── handler.ts
│   │   │           └── index.ts
│   │   ├── domain
│   │   │   └── repositories
│   │   └── infrastructure
│   │       ├── read-models
│   │       │   └── SupabaseAnnouncementReadModel.ts
│   │       └── repositories
│   ├── authentication
│   │   ├── actions
│   │   │   └── auth.ts
│   │   ├── components
│   │   │   ├── LoginClient.tsx
│   │   │   ├── MFASetup.tsx
│   │   │   ├── OnboardingTour.tsx
│   │   │   ├── PhoneAuth.tsx
│   │   │   ├── PhoneInput.tsx
│   │   │   ├── SignupClient.tsx
│   │   │   ├── VerificationStatus.tsx
│   │   │   ├── VerifyPasswordClient.tsx
│   │   │   └── WelcomeTour.tsx
│   │   ├── pages
│   │   ├── presentation
│   │   │   └── screens
│   │   │       ├── LoginScreen.tsx
│   │   │       └── SignupScreen.tsx
│   │   ├── services
│   │   │   └── email-validation.ts
│   │   └── types
│   ├── authorization
│   │   ├── application
│   │   │   └── PermissionService.ts
│   │   ├── domain
│   │   │   └── AuthorizationRepository.ts
│   │   └── infrastructure
│   │       └── SupabaseAuthorizationRepository.ts
│   ├── core
│   │   └── domain
│   │       ├── AggregateRoot.ts
│   │       ├── DomainError.ts
│   │       ├── DomainEvent.ts
│   │       ├── Entity.ts
│   │       ├── UserId.ts
│   │       └── ValueObject.ts
│   ├── discovery
│   │   ├── application
│   │   │   ├── facades
│   │   │   │   ├── DiscoverPageFacade.ts
│   │   │   │   └── index.ts
│   │   │   ├── ports
│   │   │   │   └── read-models
│   │   │   │       └── DiscoveryReadModel.ts
│   │   │   ├── queries
│   │   │   │   ├── GetDiscoveryOverview
│   │   │   │   │   ├── handler.ts
│   │   │   │   │   ├── index.ts
│   │   │   │   │   └── read-model.ts
│   │   │   │   ├── GetSearchSuggestions
│   │   │   │   │   └── handler.ts
│   │   │   │   ├── GetSuggestedReadsQuery
│   │   │   │   │   ├── dto.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── GetTrendingBooks
│   │   │   │   │   ├── handler.ts
│   │   │   │   │   ├── query.ts
│   │   │   │   │   └── response.ts
│   │   │   │   └── SearchBooks
│   │   │   │       ├── handler.ts
│   │   │   │       └── read-model.ts
│   │   │   └── repositories
│   │   ├── infrastructure
│   │   │   ├── read-models
│   │   │   │   ├── SupabaseDiscoveryReadModel.ts
│   │   │   │   └── SupabaseSuggestedReadsReadModel.ts
│   │   │   └── repositories
│   │   ├── recommendations
│   │   │   ├── application
│   │   │   │   ├── event-handlers
│   │   │   │   │   ├── RecommendationHandlers.ts
│   │   │   │   │   └── RecommendationSignalEventHandlers.ts
│   │   │   │   ├── pipeline
│   │   │   │   │   ├── CandidateRetriever.ts
│   │   │   │   │   ├── RecommendationPipeline.test.ts
│   │   │   │   │   ├── RecommendationPipeline.ts
│   │   │   │   │   ├── RecommendationPipelineStage.ts
│   │   │   │   │   └── RecommendationPlan.ts
│   │   │   │   ├── projections
│   │   │   │   │   └── RecommendationContextStore.ts
│   │   │   │   ├── providers
│   │   │   │   │   ├── CandidateProvider.ts
│   │   │   │   │   └── RecommendationContextProvider.ts
│   │   │   │   ├── queries
│   │   │   │   │   ├── GetPersonalizedRecommendations
│   │   │   │   │   │   ├── handler.test.ts
│   │   │   │   │   │   ├── handler.ts
│   │   │   │   │   │   └── query.ts
│   │   │   │   │   └── read-models
│   │   │   │   │       └── RecommendationReadModel.ts
│   │   │   │   └── services
│   │   │   │       └── RecommendationExplanationService.ts
│   │   │   ├── domain
│   │   │   │   ├── policies
│   │   │   │   │   ├── CandidateFilter.ts
│   │   │   │   │   ├── CandidateFilterPolicy.ts
│   │   │   │   │   ├── CompositeCandidateFilter.ts
│   │   │   │   │   ├── CompositeDiversificationPolicy.ts
│   │   │   │   │   ├── DiversificationPolicy.ts
│   │   │   │   │   ├── LanguageFilter.ts
│   │   │   │   │   ├── OwnershipFilter.ts
│   │   │   │   │   └── SimpleAuthorDiversificationPolicy.ts
│   │   │   │   ├── repositories
│   │   │   │   │   └── SignalRepository.ts
│   │   │   │   ├── strategies
│   │   │   │   │   ├── CategoryAffinityScorer.ts
│   │   │   │   │   ├── PopularityScorer.ts
│   │   │   │   │   ├── RecommendationScorer.ts
│   │   │   │   │   ├── RecommendationStrategy.ts
│   │   │   │   │   ├── SignalAffinityScorer.ts
│   │   │   │   │   ├── WeightedHybridStrategy.test.ts
│   │   │   │   │   └── WeightedHybridStrategy.ts
│   │   │   │   └── value-objects
│   │   │   │       ├── BookFeature.ts
│   │   │   │       ├── RecommendationCandidate.ts
│   │   │   │       ├── RecommendationContext.ts
│   │   │   │       ├── RecommendationReason.ts
│   │   │   │       ├── RecommendationScenario.ts
│   │   │   │       ├── RecommendationSource.ts
│   │   │   │       └── UserInteractionFact.ts
│   │   │   ├── infrastructure
│   │   │   │   ├── SearchCandidateProvider.ts
│   │   │   │   ├── SupabaseSignalRepository.ts
│   │   │   │   └── UserRecommendationContextProvider.ts
│   │   │   └── RecommendationModule.ts
│   │   └── search
│   │       ├── application
│   │       │   ├── commands
│   │       │   │   ├── IndexBook
│   │       │   │   │   ├── command.ts
│   │       │   │   │   ├── handler.ts
│   │       │   │   │   ├── input.ts
│   │       │   │   │   └── output.ts
│   │       │   │   ├── RemoveIndexedBook
│   │       │   │   │   ├── command.ts
│   │       │   │   │   ├── handler.ts
│   │       │   │   │   ├── input.ts
│   │       │   │   │   └── output.ts
│   │       │   │   └── UpdateIndexedBook
│   │       │   │       ├── command.ts
│   │       │   │       ├── handler.ts
│   │       │   │       ├── input.ts
│   │       │   │       └── output.ts
│   │       │   ├── event-handlers
│   │       │   │   ├── EventDrivenFlow.test.ts
│   │       │   │   ├── SearchDocumentEventHandlers.ts
│   │       │   │   └── SearchHandlers.ts
│   │       │   ├── projections
│   │       │   │   └── SearchIndexProjectionBuilder.ts
│   │       │   └── queries
│   │       │       └── SearchBooks
│   │       │           ├── handler.ts
│   │       │           ├── query.ts
│   │       │           └── read-model.ts
│   │       ├── domain
│   │       │   ├── policies
│   │       │   │   └── RankingPolicy.ts
│   │       │   ├── repositories
│   │       │   │   └── SearchRepository.ts
│   │       │   └── value-objects
│   │       │       └── SearchQuery.ts
│   │       ├── infrastructure
│   │       │   ├── models
│   │       │   │   └── BookSearchDocument.ts
│   │       │   └── repositories
│   │       │       ├── ports
│   │       │       │   ├── InMemorySearchRepository.ts
│   │       │       │   └── SearchBehavior.test.ts
│   │       │       └── SupabaseSearchRepository.ts
│   │       └── SearchModule.ts
│   ├── landing
│   │   ├── actions
│   │   ├── application
│   │   │   └── facades
│   │   │       ├── index.ts
│   │   │       └── LandingPageFacade.ts
│   │   ├── components
│   │   │   ├── LandingBookGrid.tsx
│   │   │   ├── LandingClient.tsx
│   │   │   ├── LandingCuratedSections.tsx
│   │   │   ├── LandingGenreFilter.tsx
│   │   │   └── LandingHero.tsx
│   │   ├── pages
│   │   ├── services
│   │   └── types
│   ├── library
│   │   ├── application
│   │   │   ├── commands
│   │   │   │   ├── AddBookToLibrary
│   │   │   │   │   └── handler.ts
│   │   │   │   ├── CreateCollection
│   │   │   │   │   └── handler.ts
│   │   │   │   ├── DeleteCollection
│   │   │   │   │   └── handler.ts
│   │   │   │   ├── RemoveBookFromLibrary
│   │   │   │   │   └── handler.ts
│   │   │   │   └── UpdateCollection
│   │   │   │       └── handler.ts
│   │   │   ├── dto
│   │   │   │   └── response
│   │   │   │       ├── BookDetailDto.ts
│   │   │   │       ├── BookDto.ts
│   │   │   │       ├── CollectionDto.ts
│   │   │   │       └── LibraryEntryDto.ts
│   │   │   ├── mappers
│   │   │   │   ├── BookMapper.ts
│   │   │   │   └── LibraryMapper.ts
│   │   │   ├── ports
│   │   │   │   └── read-models
│   │   │   │       └── LibraryReadModel.ts
│   │   │   └── queries
│   │   │       ├── GetCollection
│   │   │       │   └── handler.ts
│   │   │       ├── GetCollections
│   │   │       │   └── handler.ts
│   │   │       └── GetLibraryBooks
│   │   │           └── handler.ts
│   │   ├── domain
│   │   │   └── repositories
│   │   │       ├── CollectionRepository.ts
│   │   │       └── LibraryWriteRepository.ts
│   │   └── infrastructure
│   │       ├── read-models
│   │       │   └── SupabaseLibraryReadModel.ts
│   │       └── repositories
│   │           ├── SupabaseCollectionRepository.ts
│   │           └── SupabaseLibraryWriteRepository.ts
│   ├── me
│   │   ├── application
│   │   │   ├── ports
│   │   │   │   └── read-models
│   │   │   │       └── DashboardReadModel.ts
│   │   │   ├── queries
│   │   │   │   ├── GetDashboardOverview
│   │   │   │   │   ├── handler.ts
│   │   │   │   │   └── read-model.ts
│   │   │   │   └── GetRecentActivityQuery
│   │   │   │       ├── dto.ts
│   │   │   │       └── index.ts
│   │   │   └── repositories
│   │   ├── infrastructure
│   │   │   ├── read-models
│   │   │   │   ├── SupabaseDashboardReadModel.ts
│   │   │   │   └── SupabaseRecentActivityReadModel.ts
│   │   │   └── repositories
│   │   └── presentation
│   │       ├── components
│   │       │   └── TodayLayoutShell.tsx
│   │       ├── hooks
│   │       └── screens
│   │           ├── CollectionsScreen.tsx
│   │           ├── InboxScreen.tsx
│   │           ├── PreferencesScreen.tsx
│   │           ├── PrivateProfileScreen.tsx
│   │           ├── ReadingScreen.tsx
│   │           └── TodayScreen.tsx
│   ├── navigation
│   │   └── global-navigation.ts
│   ├── orchestration
│   │   └── ReadingActivityCoordinator.ts
│   ├── progress
│   │   ├── analytics
│   │   │   ├── actions
│   │   │   ├── components
│   │   │   │   ├── ReadingGoalProgress.tsx
│   │   │   │   └── ReadingStreak.tsx
│   │   │   ├── presentation
│   │   │   │   └── screens
│   │   │   ├── services
│   │   │   │   └── view-history.ts
│   │   │   └── types
│   │   ├── application
│   │   │   ├── commands
│   │   │   │   └── UpdateReadingGoalCommand.ts
│   │   │   ├── dto
│   │   │   │   └── response
│   │   │   │       ├── ReadingGoalDto.ts
│   │   │   │       ├── ReadingProgressDto.ts
│   │   │   │       ├── ReadingStatisticsDto.ts
│   │   │   │       └── StreakDataDto.ts
│   │   │   ├── mappers
│   │   │   │   └── ProgressMapper.ts
│   │   │   └── queries
│   │   │       ├── GetReadingCalendarQuery
│   │   │       │   ├── dto.ts
│   │   │       │   └── index.ts
│   │   │       ├── GetReadingGoalQuery
│   │   │       │   ├── dto.ts
│   │   │       │   └── index.ts
│   │   │       ├── GetReadingStatisticsQuery
│   │   │       │   ├── dto.ts
│   │   │       │   └── index.ts
│   │   │       ├── GetReadingStreakQuery
│   │   │       │   ├── dto.ts
│   │   │       │   └── index.ts
│   │   │       ├── CalculateReadingProgressQuery.ts
│   │   │       └── GetReadingGoalsQuery.ts
│   │   ├── domain
│   │   │   ├── entities
│   │   │   │   ├── ActivityLog.ts
│   │   │   │   ├── ReadingGoal.ts
│   │   │   │   └── ReadingStreak.ts
│   │   │   └── repositories
│   │   │       ├── ReadingActivityRepository.ts
│   │   │       └── ReadingGoalRepository.ts
│   │   └── infrastructure
│   │       ├── read-models
│   │       │   ├── SupabaseReadingCalendarReadModel.ts
│   │       │   ├── SupabaseReadingGoalReadModel.ts
│   │       │   ├── SupabaseReadingStatisticsReadModel.ts
│   │       │   └── SupabaseReadingStreakReadModel.ts
│   │       └── repositories
│   │           ├── SupabaseReadingActivityRepository.ts
│   │           └── SupabaseReadingGoalRepository.ts
│   ├── reading
│   │   ├── books
│   │   │   ├── actions
│   │   │   │   ├── get-book.ts
│   │   │   │   └── trending.ts
│   │   │   ├── application
│   │   │   │   ├── commands
│   │   │   │   ├── queries
│   │   │   │   │   ├── GetBook
│   │   │   │   │   │   ├── handler.ts
│   │   │   │   │   │   └── query.ts
│   │   │   │   │   ├── GetTrendingBooks
│   │   │   │   │   │   └── handler.ts
│   │   │   │   │   └── SearchBooks
│   │   │   │   │       ├── handler.ts
│   │   │   │   │       └── query.ts
│   │   │   │   └── types.ts
│   │   │   ├── components
│   │   │   │   ├── BookCard.tsx
│   │   │   │   ├── BookDetailClient.tsx
│   │   │   │   ├── ExploreClient.tsx
│   │   │   │   ├── RandomBookButton.tsx
│   │   │   │   └── RecentlyViewed.tsx
│   │   │   ├── domain
│   │   │   │   ├── entities
│   │   │   │   │   └── Book.ts
│   │   │   │   ├── events
│   │   │   │   │   └── BookEvents.ts
│   │   │   │   ├── repositories
│   │   │   │   │   ├── ports
│   │   │   │   │   │   └── BookRepositoryContract.ts
│   │   │   │   │   └── BookRepository.ts
│   │   │   │   └── value-objects
│   │   │   │       └── index.ts
│   │   │   ├── infrastructure
│   │   │   │   ├── mappers
│   │   │   │   │   ├── BookMapper.spec-ref.ts
│   │   │   │   │   └── BookMapper.ts
│   │   │   │   ├── models
│   │   │   │   │   └── BookRow.ts
│   │   │   │   ├── SupabaseBookRepository.spec-ref.ts
│   │   │   │   └── SupabaseBookRepository.ts
│   │   │   ├── presentation
│   │   │   │   └── screens
│   │   │   │       ├── BookDetailScreen.tsx
│   │   │   │       └── ExploreScreen.tsx
│   │   │   ├── services
│   │   │   │   └── random-book.ts
│   │   │   └── types
│   │   │       └── genres.ts
│   │   ├── home
│   │   │   ├── actions
│   │   │   ├── application
│   │   │   │   └── facades
│   │   │   │       ├── HomePageFacade.ts
│   │   │   │       └── index.ts
│   │   │   ├── components
│   │   │   │   ├── widgets
│   │   │   │   │   ├── ActivityWidget.tsx
│   │   │   │   │   ├── ContinueReadingWidget.tsx
│   │   │   │   │   ├── CurrentReadingWidget.tsx
│   │   │   │   │   ├── GoalWidget.tsx
│   │   │   │   │   ├── LibraryWidget.tsx
│   │   │   │   │   ├── QuickActionsWidget.tsx
│   │   │   │   │   ├── ReadingCalendarWidget.tsx
│   │   │   │   │   ├── StatisticsWidget.tsx
│   │   │   │   │   ├── StreakWidget.tsx
│   │   │   │   │   ├── SuggestedReadsWidget.tsx
│   │   │   │   │   └── WelcomeWidget.tsx
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   ├── HomeCuratedSections.tsx
│   │   │   │   ├── HomeGenreFilter.tsx
│   │   │   │   └── HomeSidebar.tsx
│   │   │   ├── presentation
│   │   │   │   └── screens
│   │   │   │       └── HomeScreen.tsx
│   │   │   ├── services
│   │   │   └── types
│   │   ├── library
│   │   │   ├── actions
│   │   │   │   └── library.ts
│   │   │   ├── application
│   │   │   │   ├── commands
│   │   │   │   │   ├── AddBookToLibrary
│   │   │   │   │   │   ├── handler.ts
│   │   │   │   │   │   └── input.ts
│   │   │   │   │   ├── ChangeReadingState
│   │   │   │   │   │   ├── handler.ts
│   │   │   │   │   │   └── input.ts
│   │   │   │   │   └── UpdateReadingProgress
│   │   │   │   │       ├── handler.ts
│   │   │   │   │       └── input.ts
│   │   │   │   └── queries
│   │   │   │       ├── GetAllLibraryBooks
│   │   │   │       │   └── handler.ts
│   │   │   │       ├── GetContinueReadingQuery
│   │   │   │       │   ├── dto.ts
│   │   │   │       │   └── index.ts
│   │   │   │       ├── GetCurrentlyReading
│   │   │   │       │   └── handler.ts
│   │   │   │       ├── GetCurrentReadingQuery
│   │   │   │       │   ├── dto.ts
│   │   │   │       │   └── index.ts
│   │   │   │       ├── GetFinishedBooks
│   │   │   │       │   └── handler.ts
│   │   │   │       ├── GetLibrarySnapshotQuery
│   │   │   │       │   ├── dto.ts
│   │   │   │       │   └── index.ts
│   │   │   │       └── GetWantToRead
│   │   │   │           └── handler.ts
│   │   │   ├── components
│   │   │   │   └── LibraryClient.tsx
│   │   │   ├── domain
│   │   │   │   ├── entities
│   │   │   │   │   └── LibraryBook.ts
│   │   │   │   ├── errors
│   │   │   │   │   └── index.ts
│   │   │   │   ├── events
│   │   │   │   │   ├── index.ts
│   │   │   │   │   └── LibraryEvents.ts
│   │   │   │   ├── repositories
│   │   │   │   │   ├── ports
│   │   │   │   │   │   └── LibraryRepositoryContract.ts
│   │   │   │   │   └── LibraryRepository.ts
│   │   │   │   └── value-objects
│   │   │   │       └── index.ts
│   │   │   ├── infrastructure
│   │   │   │   ├── mappers
│   │   │   │   │   └── LibraryMapper.ts
│   │   │   │   ├── read-models
│   │   │   │   │   ├── SupabaseContinueReadingReadModel.ts
│   │   │   │   │   ├── SupabaseCurrentReadingReadModel.ts
│   │   │   │   │   └── SupabaseLibrarySnapshotReadModel.ts
│   │   │   │   ├── repositories
│   │   │   │   └── SupabaseLibraryRepository.ts
│   │   │   ├── presentation
│   │   │   │   └── screens
│   │   │   │       └── LibraryScreen.tsx
│   │   │   ├── services
│   │   │   └── types
│   │   ├── reader
│   │   │   ├── actions
│   │   │   │   └── reader.ts
│   │   │   ├── annotations
│   │   │   │   ├── actions
│   │   │   │   │   └── sync.ts
│   │   │   │   ├── components
│   │   │   │   │   └── AnnotationLayer.tsx
│   │   │   │   ├── services
│   │   │   │   │   └── annotation-sync.ts
│   │   │   │   ├── state
│   │   │   │   │   └── annotation-store.ts
│   │   │   │   └── types
│   │   │   │       └── models.ts
│   │   │   ├── application
│   │   │   │   ├── commands
│   │   │   │   │   ├── FinishReadingSession
│   │   │   │   │   │   ├── command.ts
│   │   │   │   │   │   ├── handler.ts
│   │   │   │   │   │   ├── input.ts
│   │   │   │   │   │   └── output.ts
│   │   │   │   │   ├── LogHighlight
│   │   │   │   │   │   ├── command.ts
│   │   │   │   │   │   ├── handler.ts
│   │   │   │   │   │   ├── input.ts
│   │   │   │   │   │   └── output.ts
│   │   │   │   │   ├── StartReadingSession
│   │   │   │   │   │   ├── command.ts
│   │   │   │   │   │   ├── handler.ts
│   │   │   │   │   │   ├── input.ts
│   │   │   │   │   │   └── output.ts
│   │   │   │   │   ├── CompleteReadingSessionCommand.ts
│   │   │   │   │   ├── CreateBookmarkCommand.ts
│   │   │   │   │   ├── CreateHighlightCommand.ts
│   │   │   │   │   ├── CreateNoteCommand.ts
│   │   │   │   │   ├── DeleteBookmarkCommand.ts
│   │   │   │   │   ├── DeleteHighlightCommand.ts
│   │   │   │   │   ├── DeleteNoteCommand.ts
│   │   │   │   │   ├── UpdateNoteCommand.ts
│   │   │   │   │   └── UpdateReaderPositionCommand.ts
│   │   │   │   ├── dto
│   │   │   │   │   └── response
│   │   │   │   │       ├── BookmarkDto.ts
│   │   │   │   │       ├── HighlightDto.ts
│   │   │   │   │       ├── ReaderPositionDto.ts
│   │   │   │   │       └── ReadingSessionDto.ts
│   │   │   │   ├── mappers
│   │   │   │   │   └── ReaderMapper.ts
│   │   │   │   ├── queries
│   │   │   │   │   ├── GetActiveSession
│   │   │   │   │   │   ├── handler.ts
│   │   │   │   │   │   ├── query.ts
│   │   │   │   │   │   └── read-model.ts
│   │   │   │   │   ├── GetSessionById
│   │   │   │   │   ├── GetBookmarksQuery.ts
│   │   │   │   │   ├── GetHighlightsQuery.ts
│   │   │   │   │   ├── GetNotesQuery.ts
│   │   │   │   │   └── GetReaderPositionQuery.ts
│   │   │   │   └── ReaderService.ts
│   │   │   ├── components
│   │   │   │   ├── Sidebar
│   │   │   │   │   └── AnnotationSidebar.tsx
│   │   │   │   ├── toolbar
│   │   │   │   │   └── Toolbar.tsx
│   │   │   │   ├── viewer
│   │   │   │   │   └── Viewer.tsx
│   │   │   │   ├── HighlightContextMenu.tsx
│   │   │   │   ├── HighlightPopup.tsx
│   │   │   │   ├── NoteEditor.tsx
│   │   │   │   └── ReaderShell.tsx
│   │   │   ├── domain
│   │   │   │   ├── events
│   │   │   │   │   └── ReaderEvents.ts
│   │   │   │   ├── repositories
│   │   │   │   │   ├── BookmarkRepository.ts
│   │   │   │   │   ├── HighlightRepository.ts
│   │   │   │   │   └── ReaderPositionRepository.ts
│   │   │   │   ├── Bookmark.ts
│   │   │   │   ├── BookmarkCollection.ts
│   │   │   │   ├── Events.ts
│   │   │   │   ├── Highlight.ts
│   │   │   │   ├── HighlightCollection.ts
│   │   │   │   ├── ReaderSession.test.ts
│   │   │   │   ├── ReaderSession.ts
│   │   │   │   └── ReadingPosition.ts
│   │   │   ├── infrastructure
│   │   │   │   ├── repositories
│   │   │   │   │   ├── SupabaseBookmarkRepository.ts
│   │   │   │   │   ├── SupabaseHighlightRepository.ts
│   │   │   │   │   └── SupabaseReaderPositionRepository.ts
│   │   │   │   ├── ReaderRepository.ts
│   │   │   │   ├── ReaderRepositoryContract.test.ts
│   │   │   │   └── SupabaseReaderRepository.ts
│   │   │   ├── ports
│   │   │   │   ├── AnnotationAnchor.ts
│   │   │   │   ├── DocumentEngine.ts
│   │   │   │   ├── ReaderRenderer.ts
│   │   │   │   └── ReaderSession.ts
│   │   │   ├── presentation
│   │   │   │   └── screens
│   │   │   │       └── ReadingScreen.tsx
│   │   │   ├── services
│   │   │   │   └── parser
│   │   │   │       ├── epub
│   │   │   │       │   ├── EpubEngine.ts
│   │   │   │       │   └── EpubJsRenderer.ts
│   │   │   │       └── pdf
│   │   │   │           └── PdfJsEngine.ts
│   │   │   ├── state
│   │   │   │   └── reader-store.ts
│   │   │   └── ARCHITECTURE.md
│   │   └── search
│   │       ├── actions
│   │       │   └── search.ts
│   │       ├── components
│   │       │   ├── CommandPalette.tsx
│   │       │   ├── SearchClient.tsx
│   │       │   ├── SearchSuggestions.tsx
│   │       │   └── VoiceInput.tsx
│   │       ├── presentation
│   │       │   └── screens
│   │       │       └── SearchScreen.tsx
│   │       ├── services
│   │       │   └── input-detection.ts
│   │       └── types
│   ├── security
│   │   ├── application
│   │   │   ├── BearerAuthGuard.ts
│   │   │   ├── requireAuth.ts
│   │   │   └── SecurityService.ts
│   │   ├── domain
│   │   │   ├── AuditLogger.ts
│   │   │   ├── AuthenticationProvider.ts
│   │   │   ├── MfaPolicy.ts
│   │   │   └── RateLimiter.ts
│   │   └── infrastructure
│   │       ├── PostgresAuditLogger.ts
│   │       ├── SupabaseAuthenticationProvider.ts
│   │       └── SupabaseRateLimiter.ts
│   ├── shared
│   │   ├── application
│   │   │   ├── dto
│   │   │   │   └── AuthenticatedUser.ts
│   │   │   ├── events
│   │   │   │   ├── DomainEventPublisher.ts
│   │   │   │   ├── EventBus.ts
│   │   │   │   ├── EventEnvelope.ts
│   │   │   │   ├── EventHandler.ts
│   │   │   │   ├── EventMetadata.ts
│   │   │   │   ├── EventModule.ts
│   │   │   │   └── EventRegistry.ts
│   │   │   ├── ports
│   │   │   │   └── identity
│   │   │   │       └── IdentityProvider.ts
│   │   │   └── projections
│   │   │       └── ProjectionBuilder.ts
│   │   ├── config
│   │   ├── constants
│   │   ├── core
│   │   │   ├── application
│   │   │   │   └── UseCaseResult.ts
│   │   │   ├── components
│   │   │   │   └── GlobalErrorBoundary.tsx
│   │   │   ├── database
│   │   │   │   ├── admin.ts
│   │   │   │   ├── client.ts
│   │   │   │   └── server.ts
│   │   │   ├── events
│   │   │   │   ├── EventBus.ts
│   │   │   │   └── types.ts
│   │   │   ├── infrastructure
│   │   │   │   └── outbox
│   │   │   │       └── outbox.ts
│   │   │   ├── jobs
│   │   │   │   └── outbox-relay.ts
│   │   │   └── types
│   │   │       ├── database.ts
│   │   │       ├── LibraryReadModels.ts
│   │   │       └── supabase.ts
│   │   ├── domain
│   │   │   └── events
│   │   │       └── DomainEvent.ts
│   │   ├── feedback
│   │   │   └── components
│   │   │       └── AppToaster.tsx
│   │   ├── hooks
│   │   ├── infrastructure
│   │   │   ├── events
│   │   │   │   ├── DomainEventPublisher.test.ts
│   │   │   │   ├── EventDispatcher.ts
│   │   │   │   ├── InProcessEventBus.test.ts
│   │   │   │   └── InProcessEventBus.ts
│   │   │   ├── identity
│   │   │   │   └── SupabaseIdentityProvider.ts
│   │   │   └── outbox
│   │   │       └── serializeStagedEvents.ts
│   │   ├── kernel
│   │   │   ├── navigation
│   │   │   │   └── AppRoutes.ts
│   │   │   └── security
│   │   │       ├── Permission.ts
│   │   │       └── SecurityAction.ts
│   │   ├── navigation
│   │   │   ├── actions
│   │   │   ├── components
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── PWAUpdatePrompt.tsx
│   │   │   │   ├── QuickAccessSidebar.tsx
│   │   │   │   └── SidebarNavigation.tsx
│   │   │   ├── pages
│   │   │   ├── services
│   │   │   └── types
│   │   ├── providers
│   │   │   ├── pwa-context.tsx
│   │   │   └── theme-context.tsx
│   │   ├── ui
│   │   │   ├── Button
│   │   │   │   ├── Button.module.css
│   │   │   │   ├── Button.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Card
│   │   │   │   ├── Card.module.css
│   │   │   │   ├── Card.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Dropdown
│   │   │   │   ├── Dropdown.module.css
│   │   │   │   ├── Dropdown.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Icon
│   │   │   │   ├── Icon.module.css
│   │   │   │   ├── Icon.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Input
│   │   │   │   ├── index.ts
│   │   │   │   ├── Input.module.css
│   │   │   │   └── Input.tsx
│   │   │   ├── Modal
│   │   │   │   ├── index.ts
│   │   │   │   ├── Modal.module.css
│   │   │   │   └── Modal.tsx
│   │   │   ├── animations.tsx
│   │   │   ├── BackButton.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── FormError.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── motion.tsx
│   │   │   ├── PlaceholderScreen.tsx
│   │   │   ├── SkeletonLoader.tsx
│   │   │   ├── skeletons.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── tokens.ts
│   │   └── utils
│   ├── statistics
│   │   ├── application
│   │   │   ├── ports
│   │   │   │   └── read-models
│   │   │   │       └── PlatformStatisticsReadModel.ts
│   │   │   └── queries
│   │   │       └── GetPlatformStatistics
│   │   │           ├── handler.ts
│   │   │           ├── index.ts
│   │   │           └── read-model.ts
│   │   ├── domain
│   │   │   └── repositories
│   │   └── infrastructure
│   │       ├── read-models
│   │       │   └── SupabasePlatformStatisticsReadModel.ts
│   │       └── repositories
│   ├── storage
│   │   ├── actions
│   │   │   └── storage.ts
│   │   ├── components
│   │   │   └── UniversalFileUpload.tsx
│   │   ├── pages
│   │   ├── services
│   │   │   └── pdf-description-generator.ts
│   │   └── types
│   ├── support
│   │   ├── application
│   │   │   ├── dto
│   │   │   │   └── FaqDto.ts
│   │   │   ├── ports
│   │   │   │   └── read-models
│   │   │   │       └── SupportReadModel.ts
│   │   │   └── queries
│   │   │       └── GetFaqs
│   │   │           └── handler.ts
│   │   ├── domain
│   │   │   └── repositories
│   │   └── infrastructure
│   │       ├── read-models
│   │       │   └── SupabaseSupportReadModel.ts
│   │       └── repositories
│   └── user
│       ├── profile
│       │   ├── actions
│       │   │   └── notifications.ts
│       │   ├── application
│       │   │   ├── commands
│       │   │   │   ├── DeleteAccount
│       │   │   │   │   ├── DeleteAccountCommand.ts
│       │   │   │   │   └── handler.ts
│       │   │   │   ├── SetupProfile
│       │   │   │   │   ├── command.ts
│       │   │   │   │   └── handler.ts
│       │   │   │   └── UpdateProfile
│       │   │   │       ├── command.ts
│       │   │   │       └── handler.ts
│       │   │   └── queries
│       │   │       ├── ExportUserData
│       │   │       │   ├── ExportUserDataQuery.ts
│       │   │       │   └── handler.ts
│       │   │       ├── GetProfile
│       │   │       │   ├── handler.ts
│       │   │       │   └── read-model.ts
│       │   │       └── GetUnreadNotificationCountQuery
│       │   │           └── handler.ts
│       │   ├── domain
│       │   │   ├── entities
│       │   │   │   ├── UserProfile.test.ts
│       │   │   │   └── UserProfile.ts
│       │   │   ├── errors
│       │   │   ├── events
│       │   │   │   ├── index.ts
│       │   │   │   └── ProfileEvents.ts
│       │   │   ├── repositories
│       │   │   │   ├── ports
│       │   │   │   │   ├── InMemoryProfileRepository.ts
│       │   │   │   │   └── ProfileRepositoryContract.test.ts
│       │   │   │   ├── AccountDeletionRepository.ts
│       │   │   │   └── ProfileRepository.ts
│       │   │   └── value-objects
│       │   │       └── index.ts
│       │   ├── infrastructure
│       │   │   ├── mappers
│       │   │   │   └── ProfileMapper.ts
│       │   │   ├── read-models
│       │   │   │   └── SupabaseNotificationReadModel.ts
│       │   │   └── repositories
│       │   │       ├── SupabaseAccountDeletionRepository.ts
│       │   │       └── SupabaseProfileRepository.ts
│       │   ├── presentation
│       │   │   └── components
│       │   │       ├── ProfileEditForm.tsx
│       │   │       ├── ProfileHeader.tsx
│       │   │       ├── ProfileOverview.tsx
│       │   │       └── ProfileStats.tsx
│       │   └── services
│       └── progress
│           ├── application
│           │   ├── commands
│           │   │   └── ApplyReadingActivity
│           │   │       └── handler.ts
│           │   ├── event-handlers
│           │   │   └── ProgressHandlers.ts
│           │   └── queries
│           │       └── GetProgressDashboard
│           │           └── handler.ts
│           ├── domain
│           │   ├── collections
│           │   │   └── AchievementCollection.ts
│           │   ├── entities
│           │   │   ├── Achievement.ts
│           │   │   └── UserProgress.ts
│           │   ├── events
│           │   │   ├── index.ts
│           │   │   └── ProgressEvents.ts
│           │   ├── policies
│           │   │   └── LevelPolicy.ts
│           │   ├── repositories
│           │   │   ├── ports
│           │   │   │   └── ProgressRepositoryContract.ts
│           │   │   └── ProgressRepository.ts
│           │   ├── value-objects
│           │   │   ├── ExperiencePoints.ts
│           │   │   ├── Level.ts
│           │   │   ├── ReadingActivity.ts
│           │   │   ├── ReadingGoal.ts
│           │   │   └── ReadingStreak.ts
│           │   └── UserProgress.test.ts
│           ├── infrastructure
│           │   ├── mappers
│           │   │   └── ProgressMapper.ts
│           │   └── repositories
│           │       └── SupabaseProgressRepository.ts
│           ├── presentation
│           │   ├── actions
│           │   │   └── progress.ts
│           │   └── components
│           │       └── ProgressDashboardScreen.tsx
│           └── ProgressModule.ts
├── public
│   ├── book-placeholder.svg
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── icon.png
│   ├── library_bg.png
│   ├── logo.png
│   ├── manifest.json
│   ├── sw-update-handler.js
│   ├── sw.js
│   └── workbox-f1770938.js
├── scripts
│   ├── generate_structure.js
│   ├── generate_tree.js
│   ├── generate-tokens.js
│   ├── migrate-imports.js
│   ├── update_imports.js
│   └── update_routes.js
├── styles
│   ├── base
│   │   ├── body.css
│   │   ├── html.css
│   │   └── reset.css
│   ├── docs
│   │   ├── ACCESSIBILITY.md
│   │   ├── COMPONENTS.md
│   │   ├── CONTRIBUTING.md
│   │   ├── DECISIONS.md
│   │   ├── LAYOUTS.md
│   │   ├── NAMING.md
│   │   ├── THEMES.md
│   │   └── TOKENS.md
│   ├── foundation
│   │   ├── elevation.css
│   │   ├── motion.css
│   │   ├── palette.css
│   │   ├── radius.css
│   │   ├── spacing.css
│   │   ├── states.css
│   │   ├── surfaces.css
│   │   ├── typography.css
│   │   └── z-index.css
│   ├── layouts
│   │   ├── app-shell.css
│   │   ├── cluster.css
│   │   ├── container.css
│   │   ├── grid.css
│   │   ├── page.css
│   │   ├── rail.css
│   │   ├── sidebar.css
│   │   └── stack.css
│   ├── themes
│   │   ├── dark.css
│   │   └── light.css
│   └── utilities
│       └── global-utilities.css
├── supabase
│   ├── .temp
│   │   ├── cli-latest
│   │   └── linked-project.json
│   └── migrations
│       ├── 20260718162040_sanitize_account_logs.sql
│       ├── 20260718162100_sanitize_account_logs.sql
│       ├── 20260718163400_increment_download_count.sql
│       ├── 20260719022000_create_announcements.sql
│       └── 20260719050000_search_catalog.sql
├── templates
│   └── bounded-context
│       ├── application
│       ├── domain
│       │   ├── entities
│       │   ├── errors
│       │   ├── events
│       │   ├── repositories
│       │   └── value-objects
│       ├── infrastructure
│       │   ├── mappers
│       │   ├── models
│       │   └── repositories
│       └── presentation
├── .depcruise.js
├── .env.local
├── .gitignore
├── .unimportedrc.json
├── .vercelignore
├── ARCHITECTURE_RULES.md
├── eslint.config.mjs
├── fix_action_results_ui_2.js
├── fix_action_results_ui_3.js
├── fix_action_results_ui_4.js
├── fix_action_results_ui.js
├── fix_imports.js
├── fix_missing_imports.js
├── fix_paths.js
├── instrumentation.ts
├── jest.config.js
├── knip.json
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── project_structure.md
├── proxy.ts
├── README.md
├── refactor_library.js
├── refactor_reader_service.js
├── refactor_reader.js
├── remove_action_result.js
├── rename_content.js
├── replace_auth.js
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.tsbuildinfo
└── vercel.json
```
