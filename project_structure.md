# Project Structure

`	ext
tomesphere-app
├── .depcruise.js
├── .env.local
├── .github
│   └── workflows
│       └── ci.yml
├── .gitignore
├── .swc
│   └── plugins
│       └── windows_x86_64_24.0.0
├── .vercelignore
├── .vscode
│   └── settings.json
├── app
│   ├── (marketing)
│   │   ├── about
│   │   │   └── page.tsx
│   │   ├── careers
│   │   │   └── page.tsx
│   │   ├── contact
│   │   │   └── page.tsx
│   │   ├── cookies
│   │   │   └── page.tsx
│   │   ├── forgot-password
│   │   │   └── page.tsx
│   │   ├── guidelines
│   │   │   └── page.tsx
│   │   ├── login
│   │   │   └── page.tsx
│   │   ├── login-phone
│   │   │   └── page.tsx
│   │   ├── mission
│   │   │   └── page.tsx
│   │   ├── page.tsx
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
│   │   ├── academic
│   │   │   └── page.tsx
│   │   ├── analytics
│   │   │   └── page.tsx
│   │   ├── books
│   │   │   └── [id]
│   │   │       └── page.tsx
│   │   ├── dashboard
│   │   │   └── page.tsx
│   │   ├── discover
│   │   │   └── page.tsx
│   │   ├── exam-prep
│   │   │   ├── flashcards
│   │   │   │   └── page.tsx
│   │   │   ├── page.tsx
│   │   │   ├── review
│   │   │   │   └── page.tsx
│   │   │   └── tests
│   │   │       ├── page.tsx
│   │   │       └── [id]
│   │   ├── home
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── library
│   │   │   └── page.tsx
│   │   ├── me
│   │   │   ├── collections
│   │   │   │   └── page.tsx
│   │   │   ├── inbox
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── learning
│   │   │   │   ├── citations
│   │   │   │   ├── flashcards
│   │   │   │   ├── notes
│   │   │   │   ├── page.tsx
│   │   │   │   ├── tests
│   │   │   │   └── vocabulary
│   │   │   ├── page.tsx
│   │   │   ├── preferences
│   │   │   │   └── page.tsx
│   │   │   ├── profile
│   │   │   │   └── page.tsx
│   │   │   ├── progress
│   │   │   │   └── page.tsx
│   │   │   ├── reading
│   │   │   │   └── page.tsx
│   │   │   └── security
│   │   │       └── page.tsx
│   │   ├── notes
│   │   │   ├── page.tsx
│   │   │   └── [id]
│   │   │       └── page.tsx
│   │   ├── profile
│   │   │   ├── page.tsx
│   │   │   └── [id]
│   │   │       └── page.tsx
│   │   ├── profile-setup
│   │   │   └── [id]
│   │   │       └── page.tsx
│   │   ├── read
│   │   │   └── [id]
│   │   │       └── page.tsx
│   │   └── search
│   │       └── page.tsx
│   ├── api
│   │   └── cron
│   │       └── process-activity
│   │           └── route.ts
│   ├── citations
│   │   └── page.tsx
│   ├── error.tsx
│   ├── favicon.ico
│   ├── globals-mobile-fix.css
│   ├── globals.css
│   ├── icon.png
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── not-found.tsx
│   ├── providers.tsx
│   ├── sitemap
│   │   └── page.tsx
│   ├── template.tsx
│   └── theme-init.ts
├── architecture
│   ├── architecture-health.md
│   ├── backend.md
│   ├── capability-roadmap.md
│   ├── database.md
│   ├── decisions
│   │   ├── ADR-0002-domain-splitting.md
│   │   ├── ADR-0003-repository-pattern.md
│   │   ├── ADR-0004-recommendation-pipeline.md
│   │   └── ADR-0005-event-driven-integration.md
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
│   ├── templates
│   │   └── ADR_TEMPLATE.md
│   └── testing.md
├── ARCHITECTURE_RULES.md
├── archive
│   └── modules
│       ├── community
│       │   ├── actions
│       │   │   └── community.ts
│       │   ├── components
│       │   │   ├── ActiveClubs.tsx
│       │   │   ├── ActivityFeed.tsx
│       │   │   ├── CommunityClient.tsx
│       │   │   ├── CreateClubModal.tsx
│       │   │   ├── CreateDiscussionModal.tsx
│       │   │   ├── SocialShowcase.tsx
│       │   │   ├── StudyGroupsClient.tsx
│       │   │   ├── TopReaders.tsx
│       │   │   └── TrendingReviews.tsx
│       │   ├── pages
│       │   ├── services
│       │   └── types
│       ├── contests
│       │   ├── actions
│       │   │   └── contests.ts
│       │   ├── components
│       │   │   ├── ContestCard.tsx
│       │   │   ├── ContestDetailClient.tsx
│       │   │   └── ContestsClient.tsx
│       │   ├── pages
│       │   ├── services
│       │   └── types
│       └── textbook
│           ├── actions
│           │   └── textbook.ts
│           ├── components
│           │   ├── ListingDetailClient.tsx
│           │   ├── MyListingsClient.tsx
│           │   ├── SavedListingsClient.tsx
│           │   └── TextbookExchangeClient.tsx
│           ├── pages
│           ├── services
│           └── types
├── eslint.config.mjs
├── instrumentation.ts
├── jest.config.js
├── lib
│   ├── logger.ts
│   ├── toast.tsx
│   ├── utils.ts
│   └── validators.ts
├── modules
│   ├── core
│   │   └── domain
│   │       ├── AggregateRoot.ts
│   │       ├── DomainError.ts
│   │       ├── DomainEvent.ts
│   │       ├── Entity.ts
│   │       ├── UserId.ts
│   │       └── ValueObject.ts
│   ├── discovery
│   │   ├── recommendations
│   │   │   ├── application
│   │   │   │   ├── event-handlers
│   │   │   │   ├── pipeline
│   │   │   │   ├── projections
│   │   │   │   ├── providers
│   │   │   │   ├── queries
│   │   │   │   └── services
│   │   │   ├── domain
│   │   │   │   ├── policies
│   │   │   │   ├── strategies
│   │   │   │   └── value-objects
│   │   │   ├── infrastructure
│   │   │   │   ├── SearchCandidateProvider.ts
│   │   │   │   └── UserRecommendationContextProvider.ts
│   │   │   └── RecommendationModule.ts
│   │   └── search
│   │       ├── application
│   │       │   ├── commands
│   │       │   ├── event-handlers
│   │       │   ├── projections
│   │       │   └── queries
│   │       ├── domain
│   │       │   ├── policies
│   │       │   ├── repositories
│   │       │   └── value-objects
│   │       ├── infrastructure
│   │       │   ├── models
│   │       │   └── repositories
│   │       └── SearchModule.ts
│   ├── learning
│   │   ├── citations
│   │   │   ├── actions
│   │   │   │   └── citations.ts
│   │   │   ├── components
│   │   │   │   ├── CitationCard.tsx
│   │   │   │   ├── CitationForm.tsx
│   │   │   │   ├── CitationList.tsx
│   │   │   │   └── CitationsClient.tsx
│   │   │   ├── hooks
│   │   │   ├── pages
│   │   │   ├── services
│   │   │   │   └── citations.ts
│   │   │   ├── types
│   │   │   └── types.ts
│   │   ├── foundation
│   │   │   ├── actions
│   │   │   │   └── study-plan.ts
│   │   │   ├── components
│   │   │   ├── pages
│   │   │   ├── services
│   │   │   └── types
│   │   └── notes
│   │       ├── actions
│   │       │   └── notes.ts
│   │       ├── components
│   │       │   └── NotesClient.tsx
│   │       ├── pages
│   │       ├── services
│   │       └── types
│   ├── me
│   │   ├── application
│   │   │   └── GetTodayOverview
│   │   │       ├── actions
│   │   │       ├── components
│   │   │       ├── pages
│   │   │       ├── services
│   │   │       └── types
│   │   └── presentation
│   │       ├── components
│   │       │   └── TodayLayoutShell.tsx
│   │       ├── hooks
│   │       └── screens
│   │           ├── CollectionsScreen.tsx
│   │           ├── InboxScreen.tsx
│   │           ├── PreferencesScreen.tsx
│   │           ├── ProfileEditScreen.tsx
│   │           ├── ProgressScreen.tsx
│   │           ├── ReadingScreen.tsx
│   │           └── TodayScreen.tsx
│   ├── planner
│   │   ├── academic
│   │   │   ├── actions
│   │   │   │   └── academic.ts
│   │   │   ├── components
│   │   │   │   ├── ExamPrepClient.tsx
│   │   │   │   ├── FlashcardsClient.tsx
│   │   │   │   ├── PracticeTestsClient.tsx
│   │   │   │   └── ReviewClient.tsx
│   │   │   ├── pages
│   │   │   ├── services
│   │   │   └── types
│   │   └── planner
│   │       ├── actions
│   │       ├── components
│   │       │   ├── StudentNav.tsx
│   │       │   ├── StudentSection.tsx
│   │       │   └── StudyPlanWidget.tsx
│   │       ├── pages
│   │       ├── services
│   │       └── types
│   ├── platform
│   │   ├── authentication
│   │   │   ├── actions
│   │   │   │   └── auth.ts
│   │   │   ├── components
│   │   │   │   ├── LoginClient.tsx
│   │   │   │   ├── MFASetup.tsx
│   │   │   │   ├── OnboardingTour.tsx
│   │   │   │   ├── PhoneAuth.tsx
│   │   │   │   ├── PhoneInput.tsx
│   │   │   │   ├── SignupClient.tsx
│   │   │   │   ├── VerificationStatus.tsx
│   │   │   │   ├── VerifyPasswordClient.tsx
│   │   │   │   └── WelcomeTour.tsx
│   │   │   ├── pages
│   │   │   ├── presentation
│   │   │   │   └── screens
│   │   │   ├── services
│   │   │   │   └── email-validation.ts
│   │   │   └── types
│   │   ├── authorization
│   │   │   ├── application
│   │   │   │   └── PermissionService.ts
│   │   │   ├── domain
│   │   │   │   └── AuthorizationRepository.ts
│   │   │   └── infrastructure
│   │   │       └── SupabaseAuthorizationRepository.ts
│   │   ├── landing
│   │   │   ├── actions
│   │   │   ├── components
│   │   │   │   ├── LandingBookGrid.tsx
│   │   │   │   ├── LandingClient.tsx
│   │   │   │   ├── LandingCuratedSections.tsx
│   │   │   │   ├── LandingFeatures.tsx
│   │   │   │   ├── LandingGenreFilter.tsx
│   │   │   │   ├── LandingHero.tsx
│   │   │   │   ├── LandingReaderDemo.tsx
│   │   │   │   └── LandingTrending.tsx
│   │   │   ├── pages
│   │   │   ├── services
│   │   │   └── types
│   │   ├── navigation
│   │   │   └── global-navigation.ts
│   │   ├── orchestration
│   │   │   └── ReadingActivityCoordinator.ts
│   │   ├── security
│   │   │   ├── application
│   │   │   │   └── SecurityService.ts
│   │   │   ├── domain
│   │   │   │   ├── AuditLogger.ts
│   │   │   │   ├── AuthenticationProvider.ts
│   │   │   │   └── MfaPolicy.ts
│   │   │   └── infrastructure
│   │   │       ├── PostgresAuditLogger.ts
│   │   │       └── SupabaseAuthenticationProvider.ts
│   │   └── storage
│   │       ├── actions
│   │       │   └── storage.ts
│   │       ├── components
│   │       │   └── UniversalFileUpload.tsx
│   │       ├── pages
│   │       ├── services
│   │       │   ├── pdf-description-generator.ts
│   │       │   └── pdf-export.ts
│   │       └── types
│   ├── progress
│   │   └── analytics
│   │       ├── actions
│   │       │   └── analytics.ts
│   │       ├── components
│   │       │   ├── AnalyticsClient.tsx
│   │       │   ├── DashboardClient.tsx
│   │       │   ├── ReadingGoalProgress.tsx
│   │       │   └── ReadingStreak.tsx
│   │       ├── presentation
│   │       │   └── screens
│   │       ├── services
│   │       │   ├── analytics-listener.ts
│   │       │   ├── reading-goals.ts
│   │       │   ├── streak-tracker.ts
│   │       │   └── view-history.ts
│   │       └── types
│   ├── reading
│   │   ├── books
│   │   │   ├── actions
│   │   │   │   ├── books.ts
│   │   │   │   └── trending.ts
│   │   │   ├── application
│   │   │   │   ├── commands
│   │   │   │   ├── queries
│   │   │   │   └── types.ts
│   │   │   ├── components
│   │   │   │   ├── BookCard.tsx
│   │   │   │   ├── BookDetailClient.tsx
│   │   │   │   ├── ExploreClient.tsx
│   │   │   │   ├── RandomBookButton.tsx
│   │   │   │   └── RecentlyViewed.tsx
│   │   │   ├── domain
│   │   │   │   ├── entities
│   │   │   │   ├── events
│   │   │   │   ├── repositories
│   │   │   │   └── value-objects
│   │   │   ├── infrastructure
│   │   │   │   ├── mappers
│   │   │   │   ├── models
│   │   │   │   ├── SupabaseBookRepository.spec-ref.ts
│   │   │   │   └── SupabaseBookRepository.ts
│   │   │   ├── presentation
│   │   │   │   └── screens
│   │   │   ├── services
│   │   │   │   └── random-book.ts
│   │   │   └── types
│   │   │       └── genres.ts
│   │   ├── home
│   │   │   ├── actions
│   │   │   ├── components
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   ├── HomeBookGrid.tsx
│   │   │   │   ├── HomeClient.tsx
│   │   │   │   ├── HomeCuratedSections.tsx
│   │   │   │   ├── HomeGenreFilter.tsx
│   │   │   │   ├── HomeHero.tsx
│   │   │   │   └── HomeSidebar.tsx
│   │   │   ├── presentation
│   │   │   │   └── screens
│   │   │   ├── services
│   │   │   └── types
│   │   ├── library
│   │   │   ├── actions
│   │   │   │   └── library.ts
│   │   │   ├── application
│   │   │   │   ├── commands
│   │   │   │   ├── Outputs.ts
│   │   │   │   └── queries
│   │   │   ├── components
│   │   │   │   └── LibraryClient.tsx
│   │   │   ├── domain
│   │   │   │   ├── entities
│   │   │   │   ├── errors
│   │   │   │   ├── events
│   │   │   │   ├── repositories
│   │   │   │   └── value-objects
│   │   │   ├── infrastructure
│   │   │   │   ├── mappers
│   │   │   │   └── SupabaseLibraryRepository.ts
│   │   │   ├── presentation
│   │   │   │   └── screens
│   │   │   ├── services
│   │   │   └── types
│   │   ├── reader
│   │   │   ├── actions
│   │   │   ├── annotations
│   │   │   │   ├── components
│   │   │   │   ├── services
│   │   │   │   ├── state
│   │   │   │   └── types
│   │   │   ├── application
│   │   │   │   ├── commands
│   │   │   │   └── queries
│   │   │   ├── ARCHITECTURE.md
│   │   │   ├── components
│   │   │   │   ├── Overlays
│   │   │   │   ├── ReaderShell.tsx
│   │   │   │   ├── settings
│   │   │   │   ├── Sidebar
│   │   │   │   ├── toolbar
│   │   │   │   └── viewer
│   │   │   ├── contracts
│   │   │   │   ├── AnnotationAnchor.ts
│   │   │   │   ├── DocumentEngine.ts
│   │   │   │   └── ReaderSession.ts
│   │   │   ├── domain
│   │   │   │   ├── Bookmark.ts
│   │   │   │   ├── BookmarkCollection.ts
│   │   │   │   ├── events
│   │   │   │   ├── Events.ts
│   │   │   │   ├── Highlight.ts
│   │   │   │   ├── HighlightCollection.ts
│   │   │   │   ├── ReaderSession.test.ts
│   │   │   │   ├── ReaderSession.ts
│   │   │   │   └── ReadingPosition.ts
│   │   │   ├── infrastructure
│   │   │   │   ├── ReaderRepository.ts
│   │   │   │   ├── ReaderRepositoryContract.test.ts
│   │   │   │   └── SupabaseReaderRepository.ts
│   │   │   ├── presentation
│   │   │   │   └── screens
│   │   │   ├── progress
│   │   │   ├── services
│   │   │   │   ├── parser
│   │   │   │   ├── persistence
│   │   │   │   └── sync
│   │   │   ├── state
│   │   │   │   └── reader-store.ts
│   │   │   └── types
│   │   ├── recommendations
│   │   │   ├── actions
│   │   │   ├── components
│   │   │   ├── pages
│   │   │   ├── services
│   │   │   │   └── ai-recommendations.ts
│   │   │   └── types
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
│   │       ├── services
│   │       │   └── input-detection.ts
│   │       └── types
│   ├── shared
│   │   ├── application
│   │   │   ├── events
│   │   │   │   ├── DomainEventPublisher.ts
│   │   │   │   ├── EventBus.ts
│   │   │   │   ├── EventEnvelope.ts
│   │   │   │   ├── EventHandler.ts
│   │   │   │   ├── EventMetadata.ts
│   │   │   │   ├── EventModule.ts
│   │   │   │   └── EventRegistry.ts
│   │   │   └── projections
│   │   │       └── ProjectionBuilder.ts
│   │   ├── config
│   │   ├── constants
│   │   ├── core
│   │   │   ├── components
│   │   │   │   └── GlobalErrorBoundary.tsx
│   │   │   ├── database
│   │   │   │   ├── client.ts
│   │   │   │   └── server.ts
│   │   │   ├── events
│   │   │   │   ├── EventBus.ts
│   │   │   │   └── types.ts
│   │   │   ├── jobs
│   │   │   │   └── process-activity.ts
│   │   │   └── types
│   │   │       ├── ActionResult.ts
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
│   │   │   └── events
│   │   │       ├── DomainEventPublisher.test.ts
│   │   │       ├── EventDispatcher.ts
│   │   │       ├── InProcessEventBus.test.ts
│   │   │       └── InProcessEventBus.ts
│   │   ├── kernel
│   │   │   ├── navigation
│   │   │   │   └── AppRoutes.ts
│   │   │   └── security
│   │   │       ├── Permission.ts
│   │   │       └── SecurityAction.ts
│   │   ├── navigation
│   │   │   ├── actions
│   │   │   ├── components
│   │   │   │   ├── AnnouncementBanner.tsx
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
│   │   │   ├── animations.tsx
│   │   │   ├── BackButton.tsx
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
│   │   │   ├── EmptyState.tsx
│   │   │   ├── FormError.tsx
│   │   │   ├── Icon
│   │   │   │   ├── Icon.module.css
│   │   │   │   ├── Icon.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Input
│   │   │   │   ├── index.ts
│   │   │   │   ├── Input.module.css
│   │   │   │   └── Input.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── Modal
│   │   │   │   ├── index.ts
│   │   │   │   ├── Modal.module.css
│   │   │   │   └── Modal.tsx
│   │   │   ├── motion.tsx
│   │   │   ├── SkeletonLoader.tsx
│   │   │   ├── skeletons.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── tokens.ts
│   │   └── utils
│   └── user
│       ├── profile
│       │   ├── actions
│       │   │   └── profile.ts
│       │   ├── application
│       │   │   ├── commands
│       │   │   └── queries
│       │   ├── domain
│       │   │   ├── entities
│       │   │   ├── errors
│       │   │   ├── events
│       │   │   ├── repositories
│       │   │   └── value-objects
│       │   ├── infrastructure
│       │   │   ├── mappers
│       │   │   └── repositories
│       │   ├── presentation
│       │   │   ├── components
│       │   │   ├── ProfileScreen.tsx
│       │   │   └── PublicProfileScreen.tsx
│       │   └── services
│       │       └── notifications.ts
│       └── progress
│           ├── application
│           │   ├── commands
│           │   ├── event-handlers
│           │   └── queries
│           ├── domain
│           │   ├── collections
│           │   ├── entities
│           │   ├── events
│           │   ├── policies
│           │   ├── repositories
│           │   ├── UserProgress.test.ts
│           │   └── value-objects
│           ├── infrastructure
│           │   ├── mappers
│           │   └── repositories
│           ├── presentation
│           │   ├── actions
│           │   └── components
│           └── ProgressModule.ts
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── project_structure.md
├── proxy.ts
├── public
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── library_bg.png
│   ├── manifest.json
│   ├── mock-document.pdf
│   ├── reader_mockup.png
│   ├── sw-update-handler.js
│   ├── sw.js
│   └── workbox-f1770938.js
├── README.md
├── scratch
│   └── fixProfile.js
├── scripts
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
│       ├── 20260717000000_add_biography_to_profiles.sql
│       ├── 20260717000000_security_schema.sql
│       └── 20260717000001_move_reading_goals.sql
├── tailwind.config.ts
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
├── temp_tree.txt
├── tsconfig.json
├── tsconfig.tsbuildinfo
└── vercel.json
`
