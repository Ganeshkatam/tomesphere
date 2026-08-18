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
├── admin
│   ├── public
│   │   ├── file.svg
│   │   ├── globe.svg
│   │   ├── next.svg
│   │   ├── vercel.svg
│   │   └── window.svg
│   ├── src
│   │   ├── app
│   │   │   ├── announcements
│   │   │   │   ├── [id]
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── authors
│   │   │   │   ├── [id]
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── books
│   │   │   │   └── page.tsx
│   │   │   ├── collections
│   │   │   │   ├── [id]
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── featured_books
│   │   │   │   └── page.tsx
│   │   │   ├── genres
│   │   │   │   ├── [id]
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── languages
│   │   │   │   ├── [id]
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── login
│   │   │   │   ├── actions.ts
│   │   │   │   └── page.tsx
│   │   │   ├── ops
│   │   │   │   ├── jobs
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── outbox
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── projections
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── search
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── subjects
│   │   │   │   ├── [id]
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── favicon.ico
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── features
│   │   │   ├── announcements
│   │   │   │   └── actions.ts
│   │   │   ├── authors
│   │   │   │   └── actions.ts
│   │   │   ├── books
│   │   │   │   ├── components
│   │   │   │   │   └── BookFileUpload.tsx
│   │   │   │   ├── actions.ts
│   │   │   │   └── file-actions.ts
│   │   │   ├── collections
│   │   │   │   └── actions.ts
│   │   │   ├── featured_books
│   │   │   │   └── actions.ts
│   │   │   ├── genres
│   │   │   │   └── actions.ts
│   │   │   ├── languages
│   │   │   │   └── actions.ts
│   │   │   ├── ops
│   │   │   │   ├── health-queries.ts
│   │   │   │   ├── job-actions.ts
│   │   │   │   ├── job-queries.ts
│   │   │   │   ├── outbox-actions.ts
│   │   │   │   ├── outbox-queries.ts
│   │   │   │   ├── projection-actions.ts
│   │   │   │   ├── projection-queries.ts
│   │   │   │   └── search-queries.ts
│   │   │   └── subjects
│   │   │       └── actions.ts
│   │   ├── lib
│   │   │   ├── domain
│   │   │   │   ├── announcements.ts
│   │   │   │   ├── authors.ts
│   │   │   │   ├── books.ts
│   │   │   │   ├── collections.ts
│   │   │   │   ├── featured_books.ts
│   │   │   │   ├── genres.ts
│   │   │   │   ├── infrastructure.ts
│   │   │   │   ├── languages.ts
│   │   │   │   └── subjects.ts
│   │   │   └── supabase-admin.ts
│   │   └── middleware.ts
│   ├── .gitignore
│   ├── AGENTS.md
│   ├── ARCHITECTURE.md
│   ├── CLAUDE.md
│   ├── eslint.config.mjs
│   ├── next-env.d.ts
│   ├── next.config.ts
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── README.md
│   ├── tsconfig.json
│   └── tsconfig.tsbuildinfo
├── app
│   ├── (app)
│   │   ├── book
│   │   │   └── [slug]
│   │   │       └── page.tsx
│   │   ├── discover
│   │   │   ├── _components
│   │   │   │   ├── DiscoverSidebar.tsx
│   │   │   │   └── DiscoveryPage.tsx
│   │   │   ├── authors
│   │   │   │   └── page.tsx
│   │   │   ├── collections
│   │   │   │   └── page.tsx
│   │   │   ├── featured
│   │   │   │   └── page.tsx
│   │   │   ├── new
│   │   │   │   └── page.tsx
│   │   │   ├── trending
│   │   │   │   ├── page.tsx
│   │   │   │   └── TrendingClient.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── search
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (public)
│   │   ├── about
│   │   │   └── page.tsx
│   │   ├── contact
│   │   │   └── page.tsx
│   │   ├── cookies
│   │   │   └── page.tsx
│   │   ├── forgot-password
│   │   │   └── page.tsx
│   │   ├── login
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
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── (reader)
│   │   └── read
│   │       └── [id]
│   │           └── page.tsx
│   ├── (workspace)
│   │   ├── account
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── dashboard
│   │   │   └── page.tsx
│   │   ├── library
│   │   │   ├── actions.ts
│   │   │   └── page.tsx
│   │   ├── onboarding
│   │   │   ├── [id]
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── api
│   │   └── cron
│   │       ├── process-jobs
│   │       │   └── route.ts
│   │       └── process-outbox
│   │           └── route.ts
│   ├── auth
│   │   └── callback
│   │       └── route.ts
│   ├── sitemap
│   │   └── page.tsx
│   ├── error.tsx
│   ├── globals-mobile-fix.css
│   ├── globals.css
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── not-found.tsx
│   ├── providers.tsx
│   ├── template.tsx
│   └── theme-init.ts
├── architecture
│   └── decisions
│       └── ADR-0005-code-architecture-freeze.md
├── docs
│   ├── architecture
│   │   ├── audits
│   │   │   ├── DR-001-dashboard.md
│   │   │   ├── DR-002-analytics.md
│   │   │   ├── DR-003-profile.md
│   │   │   ├── DR-008-public-profile-discoverability.md
│   │   │   └── index.md
│   │   ├── decisions
│   │   │   ├── ADR-0002-domain-splitting.md
│   │   │   ├── ADR-0003-repository-pattern.md
│   │   │   ├── ADR-0004-recommendation-pipeline.md
│   │   │   └── ADR-0005-event-driven-integration.md
│   │   ├── governance
│   │   │   ├── ARCHITECTURE_GOVERNANCE.md
│   │   │   ├── DECISION_RECORD_TEMPLATE.md
│   │   │   ├── INVESTIGATION_PROCESS.md
│   │   │   └── TRACEABILITY_MATRIX.md
│   │   ├── milestones
│   │   │   └── MILESTONE-1.5.md
│   │   ├── templates
│   │   │   └── ADR_TEMPLATE.md
│   │   ├── ARCHITECTURE_FROZEN.md
│   │   ├── architecture-health.md
│   │   ├── backend.md
│   │   ├── capability-roadmap.md
│   │   ├── database.md
│   │   ├── dependency-map.md
│   │   ├── dependency-rules.md
│   │   ├── deployment.md
│   │   ├── design.md
│   │   ├── DOMAIN_DRIVEN_DESIGN_TEMPLATE.md
│   │   ├── frontend.md
│   │   ├── module-lifecycle.md
│   │   ├── PRODUCT_EVOLUTION.md
│   │   ├── reader.md
│   │   ├── README.md
│   │   ├── security.md
│   │   └── testing.md
│   ├── design
│   │   ├── design_board_0_product_vision.md
│   │   ├── design_board_1_ia.md
│   │   ├── design_board_2a_layouts.md
│   │   ├── design_board_2b_experience.md
│   │   ├── design_board_3a_wireframes.md
│   │   ├── design_board_3b_spacing.md
│   │   ├── DESIGN_GOVERNANCE.md
│   │   ├── design_system.md
│   │   ├── README.md
│   │   ├── ROUTE_GOVERNANCE.md
│   │   └── UI_IMPLEMENTATION_GUIDE.md
│   ├── governance
│   │   ├── DR-001-post-architecture-execution-policy.md
│   │   └── DR-002-search-ranking-strategy.md
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
│   │   ├── project_structure_20260719_115754.md
│   │   ├── project_structure_20260719_124638.md
│   │   ├── project_structure_20260719_234056.md
│   │   └── project_structure_20260720_224925.md
│   ├── ACTIVE_PRODUCT.md
│   ├── API_ARCHITECTURE.md
│   ├── API_ERROR_CODES.md
│   ├── API_LIFECYCLE.md
│   ├── API_STYLE_GUIDE.md
│   ├── database_decisions_v1.md
│   ├── database_erd_v1.md
│   ├── DATABASE_LIFECYCLE.md
│   ├── database_schema_v1.md
│   ├── LAUNCH_SCOPE.md
│   ├── PRODUCT_ROADMAP.md
│   ├── V1-ROADMAP.md
│   └── visual_erd_v1.md
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
│   ├── account
│   │   ├── application
│   │   │   ├── dto
│   │   │   ├── facades
│   │   │   │   ├── AccountDashboardFacade.ts
│   │   │   │   └── index.ts
│   │   │   ├── ports
│   │   │   │   └── read-models
│   │   │   │       └── DashboardReadModel.ts
│   │   │   └── queries
│   │   │       ├── GetDashboardOverview
│   │   │       │   ├── handler.ts
│   │   │       │   └── read-model.ts
│   │   │       └── GetRecentActivityQuery
│   │   │           ├── dto.ts
│   │   │           └── index.ts
│   │   ├── deletion
│   │   │   ├── application
│   │   │   │   ├── commands
│   │   │   │   │   └── DeleteAccount
│   │   │   │   │       ├── handler.ts
│   │   │   │   │       └── index.ts
│   │   │   │   └── validators
│   │   │   │       └── deleteAccountSchema.ts
│   │   │   ├── domain
│   │   │   │   └── repositories
│   │   │   │       └── AccountDeletionRepository.ts
│   │   │   └── infrastructure
│   │   │       └── repositories
│   │   │           └── SupabaseAccountDeletionRepository.ts
│   │   ├── export
│   │   │   ├── application
│   │   │   │   ├── commands
│   │   │   │   │   └── RequestExport
│   │   │   │   │       ├── handler.ts
│   │   │   │   │       └── index.ts
│   │   │   │   ├── dto
│   │   │   │   │   └── ExportPayloadSpec.ts
│   │   │   │   └── validators
│   │   │   │       └── requestExportSchema.ts
│   │   │   ├── domain
│   │   │   │   ├── entities
│   │   │   │   │   └── ExportRequest.ts
│   │   │   │   └── repositories
│   │   │   │       └── ExportRequestRepository.ts
│   │   │   └── infrastructure
│   │   │       └── repositories
│   │   │           └── SupabaseExportRequestRepository.ts
│   │   ├── infrastructure
│   │   │   ├── read-models
│   │   │   │   ├── SupabaseDashboardReadModel.ts
│   │   │   │   └── SupabaseRecentActivityReadModel.ts
│   │   │   └── repositories
│   │   ├── preferences
│   │   │   ├── application
│   │   │   │   ├── commands
│   │   │   │   │   └── UpdatePreferences
│   │   │   │   │       ├── handler.ts
│   │   │   │   │       └── index.ts
│   │   │   │   ├── dto
│   │   │   │   │   └── PreferencesPageDto.ts
│   │   │   │   ├── facades
│   │   │   │   │   └── PreferencesPageFacade.ts
│   │   │   │   ├── ports
│   │   │   │   │   └── ReaderPreferencesPort.ts
│   │   │   │   ├── queries
│   │   │   │   │   └── GetPreferences
│   │   │   │   │       └── index.ts
│   │   │   │   └── validators
│   │   │   │       └── updatePreferencesSchema.ts
│   │   │   ├── domain
│   │   │   │   ├── entities
│   │   │   │   │   └── UserPreferences.ts
│   │   │   │   └── repositories
│   │   │   │       └── PreferencesRepository.ts
│   │   │   ├── infrastructure
│   │   │   │   ├── read-models
│   │   │   │   │   └── SupabasePreferencesReadModel.ts
│   │   │   │   └── repositories
│   │   │   │       └── SupabasePreferencesRepository.ts
│   │   │   └── presentation
│   │   │       ├── actions
│   │   │       │   └── preferences.ts
│   │   │       └── components
│   │   │           └── PreferencesForm.tsx
│   │   ├── presentation
│   │   │   ├── actions
│   │   │   │   └── profile.ts
│   │   │   ├── components
│   │   │   │   ├── AccountLayoutShell.tsx
│   │   │   │   ├── AccountSidebar.tsx
│   │   │   │   └── TodayLayoutShell.tsx
│   │   │   ├── hooks
│   │   │   ├── screens
│   │   │   │   ├── CollectionsScreen.tsx
│   │   │   │   ├── InboxScreen.tsx
│   │   │   │   ├── PreferencesScreen.tsx
│   │   │   │   ├── ReadingScreen.tsx
│   │   │   │   └── TodayScreen.tsx
│   │   │   └── navigation.ts
│   │   └── security
│   │       ├── application
│   │       │   ├── commands
│   │       │   │   ├── ChangePassword
│   │       │   │   │   ├── handler.ts
│   │       │   │   │   └── index.ts
│   │       │   │   └── SignOutEverywhere
│   │       │   │       ├── handler.ts
│   │       │   │       └── index.ts
│   │       │   ├── dto
│   │       │   │   └── SecurityPageDto.ts
│   │       │   ├── facades
│   │       │   │   └── SecurityPageFacade.ts
│   │       │   ├── ports
│   │       │   │   └── SecurityReadModel.ts
│   │       │   └── validators
│   │       │       └── changePasswordSchema.ts
│   │       ├── domain
│   │       │   └── repositories
│   │       │       └── SecurityRepository.ts
│   │       ├── infrastructure
│   │       │   ├── read-models
│   │       │   │   └── SupabaseSecurityReadModel.ts
│   │       │   └── repositories
│   │       │       └── SupabaseSecurityRepository.ts
│   │       └── presentation
│   │           ├── actions
│   │           │   └── security.ts
│   │           └── components
│   │               ├── DangerZone.tsx
│   │               ├── ExportSection.tsx
│   │               ├── PasswordSection.tsx
│   │               ├── SecurityScreen.tsx
│   │               └── SignOutSection.tsx
│   ├── analytics
│   │   ├── application
│   │   │   └── event-handlers
│   │   │       └── AnalyticsEventHandlers.ts
│   │   ├── infrastructure
│   │   │   └── SupabaseAnalyticsProjectionStore.ts
│   │   └── AnalyticsModule.ts
│   ├── announcements
│   │   ├── application
│   │   │   ├── commands
│   │   │   │   ├── CreateAnnouncementCommand.ts
│   │   │   │   ├── DeleteAnnouncementCommand.ts
│   │   │   │   ├── index.ts
│   │   │   │   └── UpdateAnnouncementCommand.ts
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
│   │   │   ├── entities
│   │   │   │   └── Announcement.ts
│   │   │   └── repositories
│   │   │       └── AnnouncementRepository.ts
│   │   └── infrastructure
│   │       ├── read-models
│   │       │   └── SupabaseAnnouncementReadModel.ts
│   │       ├── repositories
│   │       └── SupabaseAnnouncementRepository.ts
│   ├── authentication
│   │   ├── presentation
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
│   ├── authors
│   │   ├── application
│   │   │   └── commands
│   │   │       ├── CreateAuthorCommand.ts
│   │   │       ├── DeleteAuthorCommand.ts
│   │   │       ├── index.ts
│   │   │       └── UpdateAuthorCommand.ts
│   │   ├── domain
│   │   │   ├── entities
│   │   │   │   └── Author.ts
│   │   │   └── repositories
│   │   │       └── AuthorRepository.ts
│   │   └── infrastructure
│   │       └── SupabaseAuthorRepository.ts
│   ├── books
│   │   ├── application
│   │   │   ├── commands
│   │   │   │   ├── ArchiveBookCommand.ts
│   │   │   │   ├── ChangeBookLanguageCommand.ts
│   │   │   │   ├── CreateBookCommand.ts
│   │   │   │   ├── DeleteBookFileCommand.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── PublishBookCommand.ts
│   │   │   │   ├── ReplaceBookFilesCommand.ts
│   │   │   │   ├── RestoreBookCommand.ts
│   │   │   │   ├── UpdateBookCommand.ts
│   │   │   │   └── UploadBookFileCommand.ts
│   │   │   ├── facades
│   │   │   │   ├── BookPageFacade.ts
│   │   │   │   └── index.ts
│   │   │   ├── queries
│   │   │   │   ├── GetBook
│   │   │   │   │   ├── handler.ts
│   │   │   │   │   └── query.ts
│   │   │   │   ├── GetBookViewerContext
│   │   │   │   │   └── handler.ts
│   │   │   │   ├── GetTrendingBooks
│   │   │   │   │   └── handler.ts
│   │   │   │   └── SearchBooks
│   │   │   │       ├── handler.ts
│   │   │   │       └── query.ts
│   │   │   └── types.ts
│   │   ├── components
│   │   │   ├── BookCard.tsx
│   │   │   ├── BookDetailClient.tsx
│   │   │   ├── ExploreClient.tsx
│   │   │   ├── RandomBookButton.tsx
│   │   │   └── RecentlyViewed.tsx
│   │   ├── domain
│   │   │   ├── entities
│   │   │   │   ├── Book.js
│   │   │   │   └── Book.ts
│   │   │   ├── events
│   │   │   │   ├── BookEvents.js
│   │   │   │   └── BookEvents.ts
│   │   │   ├── repositories
│   │   │   │   ├── ports
│   │   │   │   │   └── BookRepositoryContract.ts
│   │   │   │   ├── BookFileRepository.ts
│   │   │   │   ├── BookRepository.js
│   │   │   │   └── BookRepository.ts
│   │   │   └── value-objects
│   │   │       ├── BookFile.js
│   │   │       ├── BookFile.ts
│   │   │       ├── index.js
│   │   │       └── index.ts
│   │   ├── infrastructure
│   │   │   ├── mappers
│   │   │   │   ├── BookFileMapper.js
│   │   │   │   ├── BookFileMapper.ts
│   │   │   │   ├── BookMapper.js
│   │   │   │   ├── BookMapper.spec-ref.ts
│   │   │   │   └── BookMapper.ts
│   │   │   ├── models
│   │   │   │   ├── BookRow.js
│   │   │   │   └── BookRow.ts
│   │   │   ├── read-models
│   │   │   │   └── BookReadModel.ts
│   │   │   ├── SupabaseBookFileRepository.ts
│   │   │   ├── SupabaseBookRepository.js
│   │   │   ├── SupabaseBookRepository.spec-ref.ts
│   │   │   └── SupabaseBookRepository.ts
│   │   ├── presentation
│   │   │   ├── actions
│   │   │   │   ├── get-book.ts
│   │   │   │   └── trending.ts
│   │   │   └── screens
│   │   │       └── ExploreScreen.tsx
│   │   ├── services
│   │   │   └── random-book.ts
│   │   └── types
│   │       └── genres.ts
│   ├── collections
│   │   ├── application
│   │   │   └── commands
│   │   │       ├── CreateCollectionCommand.ts
│   │   │       ├── DeleteCollectionCommand.ts
│   │   │       ├── index.ts
│   │   │       ├── UpdateCollectionBooksCommand.ts
│   │   │       └── UpdateCollectionCommand.ts
│   │   ├── domain
│   │   │   ├── entities
│   │   │   │   └── Collection.ts
│   │   │   └── repositories
│   │   │       └── CollectionRepository.ts
│   │   └── infrastructure
│   │       └── SupabaseCollectionRepository.ts
│   ├── discovery
│   │   ├── application
│   │   │   ├── facades
│   │   │   │   ├── DiscoveryFacade.ts
│   │   │   │   └── index.ts
│   │   │   ├── ports
│   │   │   │   └── read-models
│   │   │   │       └── DiscoveryReadModel.ts
│   │   │   ├── queries
│   │   │   │   ├── GetAuthors
│   │   │   │   │   ├── handler.ts
│   │   │   │   │   ├── query.ts
│   │   │   │   │   └── response.ts
│   │   │   │   ├── GetCollections
│   │   │   │   │   ├── handler.ts
│   │   │   │   │   ├── query.ts
│   │   │   │   │   └── response.ts
│   │   │   │   ├── GetDiscoveryOverview
│   │   │   │   │   ├── handler.ts
│   │   │   │   │   ├── index.ts
│   │   │   │   │   └── read-model.ts
│   │   │   │   ├── GetFeaturedBooks
│   │   │   │   │   ├── handler.ts
│   │   │   │   │   ├── query.ts
│   │   │   │   │   └── response.ts
│   │   │   │   ├── GetGenres
│   │   │   │   │   ├── handler.ts
│   │   │   │   │   ├── query.ts
│   │   │   │   │   └── response.ts
│   │   │   │   ├── GetLanguages
│   │   │   │   │   ├── handler.ts
│   │   │   │   │   ├── query.ts
│   │   │   │   │   └── response.ts
│   │   │   │   ├── GetNewArrivals
│   │   │   │   │   ├── handler.ts
│   │   │   │   │   ├── query.ts
│   │   │   │   │   └── response.ts
│   │   │   │   ├── GetSearchSuggestions
│   │   │   │   │   └── handler.ts
│   │   │   │   ├── GetSubjects
│   │   │   │   │   ├── handler.ts
│   │   │   │   │   ├── query.ts
│   │   │   │   │   └── response.ts
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
│   │   ├── presentation
│   │   │   └── components
│   │   │       ├── AuthorCard.tsx
│   │   │       ├── AuthorGrid.tsx
│   │   │       ├── BookCard.tsx
│   │   │       ├── BookGrid.tsx
│   │   │       ├── CollectionCard.tsx
│   │   │       ├── CollectionGrid.tsx
│   │   │       ├── CuratedSections.tsx
│   │   │       ├── DiscoverySidebar.tsx
│   │   │       ├── GenreBrowser.tsx
│   │   │       ├── GenreCard.tsx
│   │   │       ├── GenreGrid.tsx
│   │   │       ├── LanguageCard.tsx
│   │   │       ├── LanguageGrid.tsx
│   │   │       ├── SubjectCard.tsx
│   │   │       └── SubjectGrid.tsx
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
│   │       ├── actions
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
│   │       │   ├── dto
│   │       │   │   ├── SearchFacetDto.ts
│   │       │   │   ├── SearchPaginationDto.ts
│   │       │   │   ├── SearchRequestDto.ts
│   │       │   │   ├── SearchResultDto.ts
│   │       │   │   └── SearchSuggestionDto.ts
│   │       │   ├── event-handlers
│   │       │   │   ├── EventDrivenFlow.test.ts
│   │       │   │   ├── index.ts
│   │       │   │   ├── SearchAnalyticsHandler.ts
│   │       │   │   ├── SearchDocumentEventHandlers.ts
│   │       │   │   └── SearchHandlers.ts
│   │       │   ├── facades
│   │       │   │   ├── ApplicationSearchFacade.ts
│   │       │   │   └── SearchFacade.ts
│   │       │   ├── projections
│   │       │   │   └── SearchIndexProjectionBuilder.ts
│   │       │   ├── queries
│   │       │   │   ├── GetAutocompleteSuggestions
│   │       │   │   │   ├── handler.ts
│   │       │   │   │   └── query.ts
│   │       │   │   ├── GetRecentSearches
│   │       │   │   │   ├── handler.ts
│   │       │   │   │   └── query.ts
│   │       │   │   ├── GetSearchResults
│   │       │   │   │   ├── handler.ts
│   │       │   │   │   └── query.ts
│   │       │   │   ├── GetTrendingSearches
│   │       │   │   │   ├── handler.ts
│   │       │   │   │   └── query.ts
│   │       │   │   └── SearchBooks
│   │       │   │       ├── handler.ts
│   │       │   │       ├── query.ts
│   │       │   │       └── read-model.ts
│   │       │   └── ranking
│   │       │       ├── PostgresRankingStrategy.ts
│   │       │       └── SearchRankingStrategy.ts
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
│   │       │   ├── projections
│   │       │   │   └── SearchIndexer.ts
│   │       │   ├── read-models
│   │       │   │   └── SupabaseSearchReadModel.ts
│   │       │   └── repositories
│   │       │       ├── ports
│   │       │       │   ├── InMemorySearchRepository.ts
│   │       │       │   └── SearchBehavior.test.ts
│   │       │       └── SearchProjectionRepository.ts
│   │       ├── presentation
│   │       │   ├── actions
│   │       │   │   ├── search.ts
│   │       │   │   └── searchActions.ts
│   │       │   ├── components
│   │       │   │   ├── CommandPalette.tsx
│   │       │   │   ├── GlobalSearchInput.tsx
│   │       │   │   ├── SearchClient.tsx
│   │       │   │   ├── SearchFacetSidebar.tsx
│   │       │   │   ├── SearchSuggestions.tsx
│   │       │   │   └── VoiceInput.tsx
│   │       │   └── screens
│   │       │       └── SearchScreen.tsx
│   │       ├── services
│   │       │   └── input-detection.ts
│   │       ├── types
│   │       └── SearchModule.ts
│   ├── featured_books
│   │   ├── application
│   │   │   └── commands
│   │   │       ├── index.ts
│   │   │       └── UpdateFeaturedBooksCommand.ts
│   │   ├── domain
│   │   │   ├── entities
│   │   │   │   └── FeaturedBook.ts
│   │   │   └── repositories
│   │   │       └── FeaturedBookRepository.ts
│   │   └── infrastructure
│   │       └── SupabaseFeaturedBookRepository.ts
│   ├── genres
│   │   ├── application
│   │   │   └── commands
│   │   │       ├── CreateGenreCommand.ts
│   │   │       ├── DeleteGenreCommand.ts
│   │   │       ├── index.ts
│   │   │       └── UpdateGenreCommand.ts
│   │   ├── domain
│   │   │   ├── entities
│   │   │   │   └── Genre.ts
│   │   │   └── repositories
│   │   │       └── GenreRepository.ts
│   │   └── infrastructure
│   │       └── SupabaseGenreRepository.ts
│   ├── home
│   │   ├── actions
│   │   ├── application
│   │   │   └── facades
│   │   │       ├── HomePageFacade.ts
│   │   │       └── index.ts
│   │   ├── presentation
│   │   │   ├── components
│   │   │   │   ├── ActivityWidget.tsx
│   │   │   │   ├── ContinueReadingWidget.tsx
│   │   │   │   ├── CurrentReadingWidget.tsx
│   │   │   │   ├── GoalWidget.tsx
│   │   │   │   ├── HomeClient.tsx
│   │   │   │   ├── LibraryWidget.tsx
│   │   │   │   ├── QuickActionsWidget.tsx
│   │   │   │   ├── ReadingCalendarWidget.tsx
│   │   │   │   ├── StatisticsWidget.tsx
│   │   │   │   ├── StreakWidget.tsx
│   │   │   │   ├── SuggestedReadsWidget.tsx
│   │   │   │   └── WelcomeWidget.tsx
│   │   │   └── screens
│   │   ├── services
│   │   └── types
│   ├── landing
│   │   ├── actions
│   │   ├── application
│   │   │   └── facades
│   │   │       ├── index.ts
│   │   │       └── LandingPageFacade.ts
│   │   ├── presentation
│   │   │   └── components
│   │   │       ├── AnnouncementSection.tsx
│   │   │       ├── CatalogHero.tsx
│   │   │       ├── FeaturedBooksSection.tsx
│   │   │       ├── FeaturedCollectionsSection.tsx
│   │   │       ├── FeaturedItemCard.tsx
│   │   │       ├── GenreBrowserSection.tsx
│   │   │       ├── HeroSection.tsx
│   │   │       ├── LandingClient.tsx
│   │   │       ├── PopularAuthorsSection.tsx
│   │   │       ├── RecentlyAddedSection.tsx
│   │   │       ├── StatisticsSection.tsx
│   │   │       └── TrendingBooksSection.tsx
│   │   └── types
│   ├── languages
│   │   ├── application
│   │   │   └── commands
│   │   │       ├── CreateLanguageCommand.ts
│   │   │       ├── DeleteLanguageCommand.ts
│   │   │       ├── index.ts
│   │   │       └── UpdateLanguageCommand.ts
│   │   ├── domain
│   │   │   ├── entities
│   │   │   │   └── Language.ts
│   │   │   └── repositories
│   │   │       └── LanguageRepository.ts
│   │   └── infrastructure
│   │       └── SupabaseLanguageRepository.ts
│   ├── library
│   │   ├── application
│   │   │   ├── commands
│   │   │   │   ├── AddBookToCollection
│   │   │   │   │   └── handler.ts
│   │   │   │   ├── AddBookToLibrary
│   │   │   │   │   ├── handler.ts
│   │   │   │   │   └── input.ts
│   │   │   │   ├── ChangeReadingState
│   │   │   │   │   ├── handler.ts
│   │   │   │   │   └── input.ts
│   │   │   │   ├── CreateCollection
│   │   │   │   │   └── handler.ts
│   │   │   │   ├── DeleteCollection
│   │   │   │   │   └── handler.ts
│   │   │   │   ├── MoveBookToCollection
│   │   │   │   │   └── handler.ts
│   │   │   │   ├── RemoveBookFromCollection
│   │   │   │   │   └── handler.ts
│   │   │   │   ├── RemoveBookFromLibrary
│   │   │   │   │   └── handler.ts
│   │   │   │   ├── UpdateCollection
│   │   │   │   │   └── handler.ts
│   │   │   │   └── UpdateReadingProgress
│   │   │   │       ├── handler.ts
│   │   │   │       └── input.ts
│   │   │   ├── dto
│   │   │   │   └── response
│   │   │   │       ├── BookDetailDto.ts
│   │   │   │       ├── BookDto.ts
│   │   │   │       ├── CollectionDto.ts
│   │   │   │       ├── LibraryBookDto.ts
│   │   │   │       ├── LibraryEntryDto.ts
│   │   │   │       └── LibraryPageDto.ts
│   │   │   ├── facades
│   │   │   │   ├── index.ts
│   │   │   │   └── LibraryPageFacade.ts
│   │   │   ├── mappers
│   │   │   │   ├── BookMapper.ts
│   │   │   │   └── LibraryMapper.ts
│   │   │   ├── ports
│   │   │   │   └── read-models
│   │   │   │       └── LibraryReadModel.ts
│   │   │   └── queries
│   │   │       ├── GetAllLibraryBooks
│   │   │       │   └── handler.ts
│   │   │       ├── GetCollection
│   │   │       │   └── handler.ts
│   │   │       ├── GetCollections
│   │   │       │   └── handler.ts
│   │   │       ├── GetContinueReadingQuery
│   │   │       │   ├── dto.ts
│   │   │       │   └── index.ts
│   │   │       ├── GetCurrentlyReading
│   │   │       │   └── handler.ts
│   │   │       ├── GetCurrentReadingQuery
│   │   │       │   ├── dto.ts
│   │   │       │   └── index.ts
│   │   │       ├── GetFinishedBooks
│   │   │       │   └── handler.ts
│   │   │       ├── GetLibraryBooks
│   │   │       │   └── handler.ts
│   │   │       ├── GetLibraryFilters
│   │   │       │   └── handler.ts
│   │   │       ├── GetLibraryNavigation
│   │   │       │   └── handler.ts
│   │   │       ├── GetLibrarySnapshotQuery
│   │   │       │   ├── dto.ts
│   │   │       │   └── index.ts
│   │   │       ├── GetLibrarySummary
│   │   │       │   └── handler.ts
│   │   │       └── GetWantToRead
│   │   │           └── handler.ts
│   │   ├── components
│   │   │   ├── LibraryClient.tsx
│   │   │   ├── LibraryContextMenu.tsx
│   │   │   ├── LibraryGrid.tsx
│   │   │   ├── LibraryList.tsx
│   │   │   ├── LibraryOverview.tsx
│   │   │   ├── LibrarySidebar.tsx
│   │   │   └── LibraryToolbar.tsx
│   │   ├── domain
│   │   │   ├── entities
│   │   │   │   └── LibraryBook.ts
│   │   │   ├── errors
│   │   │   │   └── index.ts
│   │   │   ├── events
│   │   │   │   ├── index.ts
│   │   │   │   └── LibraryEvents.ts
│   │   │   ├── repositories
│   │   │   │   ├── ports
│   │   │   │   │   └── LibraryRepositoryContract.ts
│   │   │   │   ├── CollectionRepository.ts
│   │   │   │   ├── LibraryRepository.ts
│   │   │   │   └── LibraryWriteRepository.ts
│   │   │   └── value-objects
│   │   │       └── index.ts
│   │   ├── infrastructure
│   │   │   ├── mappers
│   │   │   │   └── LibraryMapper.ts
│   │   │   ├── read-models
│   │   │   │   ├── SupabaseContinueReadingReadModel.ts
│   │   │   │   ├── SupabaseCurrentReadingReadModel.ts
│   │   │   │   ├── SupabaseLibraryReadModel.ts
│   │   │   │   └── SupabaseLibrarySnapshotReadModel.ts
│   │   │   ├── repositories
│   │   │   │   ├── SupabaseCollectionRepository.ts
│   │   │   │   └── SupabaseLibraryWriteRepository.ts
│   │   │   └── SupabaseLibraryRepository.ts
│   │   ├── presentation
│   │   │   ├── actions
│   │   │   │   └── library.ts
│   │   │   └── screens
│   │   │       └── LibraryScreen.tsx
│   │   ├── services
│   │   ├── store
│   │   │   └── library-store.ts
│   │   └── types
│   ├── me
│   │   ├── application
│   │   │   ├── queries
│   │   │   └── repositories
│   │   └── presentation
│   ├── notifications
│   │   ├── application
│   │   │   └── event-handlers
│   │   │       └── NotificationEventHandlers.ts
│   │   ├── domain
│   │   │   └── Notification.ts
│   │   ├── presentation
│   │   │   ├── actions
│   │   │   │   └── notifications.ts
│   │   │   └── components
│   │   │       └── NotificationBell.tsx
│   │   └── NotificationsModule.ts
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
│   │   │   │   ├── ApplyReadingActivity
│   │   │   │   │   └── handler.ts
│   │   │   │   └── UpdateReadingGoalCommand.ts
│   │   │   ├── dto
│   │   │   │   └── response
│   │   │   │       ├── ReadingGoalDto.ts
│   │   │   │       ├── ReadingProgressDto.ts
│   │   │   │       ├── ReadingStatisticsDto.ts
│   │   │   │       └── StreakDataDto.ts
│   │   │   ├── event-handlers
│   │   │   │   └── ProgressHandlers.ts
│   │   │   ├── mappers
│   │   │   │   └── ProgressMapper.ts
│   │   │   ├── ports
│   │   │   │   └── read-models
│   │   │   │       └── UserAchievementsReadModel.ts
│   │   │   └── queries
│   │   │       ├── GetProgressDashboard
│   │   │       │   └── handler.ts
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
│   │   │   ├── collections
│   │   │   │   └── AchievementCollection.ts
│   │   │   ├── entities
│   │   │   │   ├── Achievement.ts
│   │   │   │   ├── ActivityLog.ts
│   │   │   │   ├── ReadingGoal.ts
│   │   │   │   ├── ReadingStreak.ts
│   │   │   │   └── UserProgress.ts
│   │   │   ├── events
│   │   │   │   ├── index.ts
│   │   │   │   └── ProgressEvents.ts
│   │   │   ├── policies
│   │   │   │   └── LevelPolicy.ts
│   │   │   ├── repositories
│   │   │   │   ├── ports
│   │   │   │   │   └── ProgressRepositoryContract.ts
│   │   │   │   ├── ProgressRepository.ts
│   │   │   │   ├── ReadingActivityRepository.ts
│   │   │   │   └── ReadingGoalRepository.ts
│   │   │   ├── value-objects
│   │   │   │   ├── ExperiencePoints.ts
│   │   │   │   ├── Level.ts
│   │   │   │   ├── ReadingActivity.ts
│   │   │   │   ├── ReadingGoal.ts
│   │   │   │   └── ReadingStreak.ts
│   │   │   └── UserProgress.test.ts
│   │   ├── infrastructure
│   │   │   ├── mappers
│   │   │   │   └── ProgressMapper.ts
│   │   │   ├── read-models
│   │   │   │   ├── SupabaseReadingCalendarReadModel.ts
│   │   │   │   ├── SupabaseReadingGoalReadModel.ts
│   │   │   │   ├── SupabaseReadingStatisticsReadModel.ts
│   │   │   │   ├── SupabaseReadingStreakReadModel.ts
│   │   │   │   └── SupabaseUserAchievementsReadModel.ts
│   │   │   └── repositories
│   │   │       ├── SupabaseProgressRepository.ts
│   │   │       ├── SupabaseReadingActivityRepository.ts
│   │   │       └── SupabaseReadingGoalRepository.ts
│   │   ├── presentation
│   │   │   ├── actions
│   │   │   │   └── progress.ts
│   │   │   └── components
│   │   │       └── ProgressDashboardScreen.tsx
│   │   └── ProgressModule.ts
│   ├── reader
│   │   ├── annotations
│   │   │   ├── actions
│   │   │   │   └── sync.ts
│   │   │   ├── components
│   │   │   │   └── AnnotationLayer.tsx
│   │   │   ├── services
│   │   │   │   └── annotation-sync.ts
│   │   │   ├── state
│   │   │   │   └── annotation-store.ts
│   │   │   └── types
│   │   │       └── models.ts
│   │   ├── application
│   │   │   ├── commands
│   │   │   │   ├── FinishReadingSession
│   │   │   │   │   ├── command.ts
│   │   │   │   │   ├── handler.ts
│   │   │   │   │   ├── input.ts
│   │   │   │   │   └── output.ts
│   │   │   │   ├── LogHighlight
│   │   │   │   │   ├── command.ts
│   │   │   │   │   ├── handler.ts
│   │   │   │   │   ├── input.ts
│   │   │   │   │   └── output.ts
│   │   │   │   ├── StartReadingSession
│   │   │   │   │   ├── command.ts
│   │   │   │   │   ├── handler.ts
│   │   │   │   │   ├── input.ts
│   │   │   │   │   └── output.ts
│   │   │   │   ├── CompleteReadingSessionCommand.ts
│   │   │   │   ├── CreateBookmarkCommand.ts
│   │   │   │   ├── CreateHighlightCommand.ts
│   │   │   │   ├── CreateNoteCommand.ts
│   │   │   │   ├── DeleteBookmarkCommand.ts
│   │   │   │   ├── DeleteHighlightCommand.ts
│   │   │   │   ├── DeleteNoteCommand.ts
│   │   │   │   ├── UpdateNoteCommand.ts
│   │   │   │   └── UpdateReaderPositionCommand.ts
│   │   │   ├── dto
│   │   │   │   ├── response
│   │   │   │   │   ├── BookmarkDto.ts
│   │   │   │   │   ├── HighlightDto.ts
│   │   │   │   │   ├── ReaderPositionDto.ts
│   │   │   │   │   └── ReadingSessionDto.ts
│   │   │   │   └── ReaderPageDto.ts
│   │   │   ├── facades
│   │   │   │   ├── index.ts
│   │   │   │   ├── ReaderFacade.ts
│   │   │   │   └── ReaderSessionFacade.ts
│   │   │   ├── mappers
│   │   │   │   └── ReaderMapper.ts
│   │   │   ├── ports
│   │   │   │   ├── AnnotationAnchor.ts
│   │   │   │   ├── DocumentEngine.ts
│   │   │   │   ├── ReaderRenderer.ts
│   │   │   │   └── ReaderSession.ts
│   │   │   ├── queries
│   │   │   │   ├── GetActiveSession
│   │   │   │   │   ├── handler.ts
│   │   │   │   │   ├── query.ts
│   │   │   │   │   └── read-model.ts
│   │   │   │   ├── GetSessionById
│   │   │   │   ├── GetBookmarksQuery.ts
│   │   │   │   ├── GetHighlightsQuery.ts
│   │   │   │   ├── GetNotesQuery.ts
│   │   │   │   └── GetReaderPositionQuery.ts
│   │   │   └── ReaderService.ts
│   │   ├── components
│   │   │   ├── Sidebar
│   │   │   │   └── AnnotationSidebar.tsx
│   │   │   ├── toolbar
│   │   │   │   ├── AnnotationToolbar.tsx
│   │   │   │   ├── NavigationToolbar.tsx
│   │   │   │   ├── ProgressToolbar.tsx
│   │   │   │   ├── SettingsToolbar.tsx
│   │   │   │   └── Toolbar.tsx
│   │   │   ├── viewer
│   │   │   │   └── Viewer.tsx
│   │   │   ├── HighlightContextMenu.tsx
│   │   │   ├── HighlightPopup.tsx
│   │   │   ├── NoteEditor.tsx
│   │   │   └── ReaderShell.tsx
│   │   ├── domain
│   │   │   ├── events
│   │   │   │   └── ReaderEvents.ts
│   │   │   ├── repositories
│   │   │   │   ├── BookmarkRepository.ts
│   │   │   │   ├── HighlightRepository.ts
│   │   │   │   └── ReaderPositionRepository.ts
│   │   │   ├── Bookmark.ts
│   │   │   ├── BookmarkCollection.ts
│   │   │   ├── Events.ts
│   │   │   ├── Highlight.ts
│   │   │   ├── HighlightCollection.ts
│   │   │   ├── ReaderSession.test.ts
│   │   │   ├── ReaderSession.ts
│   │   │   └── ReadingPosition.ts
│   │   ├── infrastructure
│   │   │   ├── repositories
│   │   │   │   ├── SupabaseBookmarkRepository.ts
│   │   │   │   ├── SupabaseHighlightRepository.ts
│   │   │   │   └── SupabaseReaderPositionRepository.ts
│   │   │   ├── ReaderRepository.ts
│   │   │   ├── ReaderRepositoryContract.test.ts
│   │   │   └── SupabaseReaderRepository.ts
│   │   ├── presentation
│   │   │   ├── actions
│   │   │   │   └── reader.ts
│   │   │   └── screens
│   │   ├── services
│   │   │   └── parser
│   │   │       ├── epub
│   │   │       │   ├── EpubEngine.ts
│   │   │       │   └── EpubJsRenderer.ts
│   │   │       ├── pdf
│   │   │       │   ├── PdfJsEngine.ts
│   │   │       │   └── PdfJsRenderer.ts
│   │   │       └── RendererFactory.ts
│   │   ├── state
│   │   │   └── reader-store.ts
│   │   └── ARCHITECTURE.md
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
│   │   ├── components
│   │   │   └── UniversalFileUpload.tsx
│   │   ├── pages
│   │   ├── presentation
│   │   │   └── actions
│   │   │       └── storage.ts
│   │   ├── services
│   │   │   └── pdf-description-generator.ts
│   │   └── types
│   ├── subjects
│   │   ├── application
│   │   │   └── commands
│   │   │       ├── CreateSubjectCommand.ts
│   │   │       ├── DeleteSubjectCommand.ts
│   │   │       ├── index.ts
│   │   │       └── UpdateSubjectCommand.ts
│   │   ├── domain
│   │   │   ├── entities
│   │   │   │   └── Subject.ts
│   │   │   └── repositories
│   │   │       └── SubjectRepository.ts
│   │   └── infrastructure
│   │       └── SupabaseSubjectRepository.ts
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
│       └── profile
│           ├── application
│           │   ├── commands
│           │   │   ├── DeleteAccount
│           │   │   │   ├── DeleteAccountCommand.ts
│           │   │   │   └── handler.ts
│           │   │   ├── SetupProfile
│           │   │   │   ├── command.ts
│           │   │   │   └── handler.ts
│           │   │   └── UpdateProfile
│           │   │       ├── command.ts
│           │   │       └── handler.ts
│           │   ├── facades
│           │   │   ├── index.ts
│           │   │   └── ProfilePageFacade.ts
│           │   ├── ports
│           │   │   └── repositories
│           │   │       ├── InMemoryProfileRepository.ts
│           │   │       └── ProfileRepositoryContract.test.ts
│           │   ├── queries
│           │   │   ├── ExportUserData
│           │   │   │   ├── ExportUserDataQuery.ts
│           │   │   │   └── handler.ts
│           │   │   ├── GetProfile
│           │   │   │   ├── handler.ts
│           │   │   │   └── read-model.ts
│           │   │   └── GetUnreadNotificationCountQuery
│           │   │       └── handler.ts
│           │   └── validators
│           │       └── updateProfileSchema.ts
│           ├── domain
│           │   ├── entities
│           │   │   ├── UserProfile.test.ts
│           │   │   └── UserProfile.ts
│           │   ├── errors
│           │   ├── events
│           │   │   ├── index.ts
│           │   │   └── ProfileEvents.ts
│           │   ├── repositories
│           │   │   ├── AccountDeletionRepository.ts
│           │   │   └── ProfileRepository.ts
│           │   └── value-objects
│           │       └── index.ts
│           ├── infrastructure
│           │   ├── mappers
│           │   │   └── ProfileMapper.ts
│           │   ├── read-models
│           │   │   └── SupabaseNotificationReadModel.ts
│           │   └── repositories
│           │       ├── SupabaseAccountDeletionRepository.ts
│           │       └── SupabaseProfileRepository.ts
│           ├── presentation
│           │   ├── actions
│           │   │   ├── notifications.ts
│           │   │   └── profile.ts
│           │   └── components
│           │       ├── ProfileEditForm.tsx
│           │       ├── ProfileHeader.tsx
│           │       ├── ProfileOverview.tsx
│           │       └── ProfileStats.tsx
│           └── services
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
│   ├── dev.js
│   ├── generate_structure.js
│   ├── generate_tree.js
│   ├── generate-tokens.js
│   ├── migrate-imports.js
│   ├── update_imports.js
│   └── update_routes.js
├── shared
│   ├── application
│   │   ├── dto
│   │   │   └── AuthenticatedUser.ts
│   │   ├── events
│   │   │   ├── DomainEventPublisher.ts
│   │   │   ├── EventBus.ts
│   │   │   ├── EventEnvelope.ts
│   │   │   ├── EventHandler.ts
│   │   │   ├── EventMetadata.ts
│   │   │   ├── EventModule.ts
│   │   │   └── EventRegistry.ts
│   │   ├── ports
│   │   │   └── identity
│   │   │       └── IdentityProvider.ts
│   │   └── projections
│   │       └── ProjectionBuilder.ts
│   ├── config
│   ├── constants
│   ├── core
│   │   ├── application
│   │   │   └── UseCaseResult.ts
│   │   ├── components
│   │   │   └── GlobalErrorBoundary.tsx
│   │   ├── database
│   │   │   ├── admin.ts
│   │   │   ├── client.ts
│   │   │   └── server.ts
│   │   ├── events
│   │   │   ├── EventBus.ts
│   │   │   └── types.ts
│   │   ├── infrastructure
│   │   │   └── outbox
│   │   │       └── outbox.ts
│   │   ├── jobs
│   │   │   └── outbox-relay.ts
│   │   ├── types
│   │   │   ├── database.ts
│   │   │   ├── LibraryReadModels.ts
│   │   │   └── supabase.ts
│   │   └── utils
│   │       └── redirect.ts
│   ├── domain
│   │   └── events
│   │       └── DomainEvent.ts
│   ├── feedback
│   │   ├── components
│   │   │   └── AppToaster.tsx
│   │   └── PWAUpdatePrompt
│   │       └── PWAUpdatePrompt.tsx
│   ├── hooks
│   ├── infrastructure
│   │   ├── events
│   │   │   ├── DomainEventPublisher.test.ts
│   │   │   ├── EventDispatcher.ts
│   │   │   ├── IdempotencyGuard.ts
│   │   │   ├── InProcessEventBus.test.ts
│   │   │   └── InProcessEventBus.ts
│   │   ├── identity
│   │   │   └── SupabaseIdentityProvider.ts
│   │   ├── jobs
│   │   │   ├── JobDispatcher.ts
│   │   │   ├── JobHandler.ts
│   │   │   ├── JobHandlerRegistry.ts
│   │   │   ├── JobQueue.ts
│   │   │   ├── JobRepository.ts
│   │   │   ├── MaterializedViewRefreshJobHandler.ts
│   │   │   ├── ProjectionRebuildJobHandler.ts
│   │   │   ├── SupabaseJobRepository.ts
│   │   │   └── types.ts
│   │   ├── outbox
│   │   │   └── serializeStagedEvents.ts
│   │   └── projections
│   │       └── ProjectionRegistry.ts
│   ├── kernel
│   │   ├── navigation
│   │   │   └── AppRoutes.ts
│   │   ├── security
│   │   │   ├── Permission.ts
│   │   │   └── SecurityAction.ts
│   │   ├── AggregateRoot.ts
│   │   ├── DomainError.ts
│   │   ├── DomainEvent.ts
│   │   ├── Entity.ts
│   │   ├── UserId.ts
│   │   └── ValueObject.ts
│   ├── layout
│   │   ├── AppHeader
│   │   │   ├── AppHeader.tsx
│   │   │   └── index.ts
│   │   ├── Footer
│   │   │   └── Footer.tsx
│   │   └── index.ts
│   ├── navigation
│   │   ├── actions
│   │   ├── pages
│   │   ├── services
│   │   ├── types
│   │   └── README.md
│   ├── providers
│   │   ├── pwa-context.tsx
│   │   └── theme-context.tsx
│   ├── ui
│   │   ├── Button
│   │   │   ├── Button.module.css
│   │   │   ├── Button.tsx
│   │   │   └── index.ts
│   │   ├── Card
│   │   │   ├── Card.module.css
│   │   │   ├── Card.tsx
│   │   │   └── index.ts
│   │   ├── components
│   │   │   ├── AuthGuard.tsx
│   │   │   └── Card.tsx
│   │   ├── Dropdown
│   │   │   ├── Dropdown.module.css
│   │   │   ├── Dropdown.tsx
│   │   │   └── index.ts
│   │   ├── Icon
│   │   │   ├── Icon.module.css
│   │   │   ├── Icon.tsx
│   │   │   └── index.ts
│   │   ├── Input
│   │   │   ├── index.ts
│   │   │   ├── Input.module.css
│   │   │   └── Input.tsx
│   │   ├── Modal
│   │   │   ├── index.ts
│   │   │   ├── Modal.module.css
│   │   │   └── Modal.tsx
│   │   ├── animations.tsx
│   │   ├── BackButton.tsx
│   │   ├── EmptyState.tsx
│   │   ├── FormError.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── motion.tsx
│   │   ├── PlaceholderScreen.tsx
│   │   ├── SkeletonLoader.tsx
│   │   ├── skeletons.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── tokens.ts
│   └── utils
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
│       ├── 20260716221802_domain_schema_normalization.sql
│       ├── 20260717000000_add_biography_to_profiles.sql
│       ├── 20260717000000_security_schema.sql
│       ├── 20260717000001_move_reading_goals.sql
│       ├── 20260717020054_discovery_recommendation_signals.sql
│       ├── 20260717081000_discovery_read_models.sql
│       ├── 20260717090000_drop_legacy_tables.sql
│       ├── 20260717091500_outbox_pattern.sql
│       ├── 20260717150000_analytics_projections.sql
│       ├── 20260717150001_analytics_rpcs.sql
│       ├── 20260717150002_analytics_backfill.sql
│       ├── 20260717160000_performance_tuning.sql
│       ├── 20260717170000_legacy_cleanup.sql
│       ├── 20260718000000_clean_retired_schema.sql
│       ├── 20260718000000_reader_m1.sql
│       ├── 20260718100000_reader_bookmarks.sql
│       ├── 20260718162040_sanitize_account_logs.sql
│       ├── 20260718162100_sanitize_account_logs.sql
│       ├── 20260718163400_increment_download_count.sql
│       ├── 20260718200000_security_hardening.sql
│       ├── 20260718300000_profile_setup_rpc.sql
│       ├── 20260719022000_create_announcements.sql
│       ├── 20260719050000_search_catalog.sql
│       ├── 20260719053000_create_export_requests.sql
│       ├── 20260719060000_discovery_search_infrastructure.sql
│       ├── 20260719070000_v1_architecture_simplification.sql
│       ├── 20260719080000_v1_database_freeze.sql
│       ├── 20260720000000_search_projection_schema.sql
│       ├── 20260720000001_search_projection_metadata.sql
│       ├── 20260720000002_database_globalization.sql
│       ├── 20260720000003_search_rpc.sql
│       ├── 20260720000004_search_analytics_schema.sql
│       ├── 20260720000005_search_facets_rpc.sql
│       ├── 20260720000006_search_autocomplete_rpc.sql
│       ├── 20260720000007_search_history_rpc.sql
│       ├── 20260720000008_trending_searches_projection.sql
│       ├── 20260720000009_synonym_expansion.sql
│       ├── 20260720000010_typo_tolerance.sql
│       ├── 20260720000011_trgm_indexes.sql
│       ├── 20260720000012_search_rpc_fixes.sql
│       ├── 20260720000013_book_admin_rpc.sql
│       ├── 20260720000014_book_lifecycle_columns.sql
│       ├── 20260720000015_book_rpc_optimistic_concurrency.sql
│       ├── 20260720120443_sprint_4_editorial_domains.sql
│       └── 20260720132624_notifications_read_model.sql
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
├── sql.json
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.tsbuildinfo
└── vercel.json
```
