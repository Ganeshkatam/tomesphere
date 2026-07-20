# TomeSphere V1 Product Roadmap & Feature Freeze

The platform architecture is **100% frozen**. The focus is now entirely on delivering the following Product Features, strictly in this order.

## Delivery Roadmap

### Phase 1 — Search & Discovery Intelligence
*Divided into 5 discrete sprints.*

**Sprint 1 — Search Foundation**
- Search index projection
- Search document model
- Incremental indexing
- Full rebuild job
- Projection versioning
- Index health verification

**Sprint 2 — Query Engine**
- Full-text search
- Ranking
- Pagination
- Sorting
- URL state
- Search API
- Result highlighting

**Sprint 3 — Filters**
- Genre, Language, Author, Collection, Publication status, Availability
- Multi-select facets

**Sprint 4 — Intelligence**
- Autocomplete, Typo tolerance, Prefix search, Synonyms
- Popular queries, Trending, Recent searches

**Sprint 5 — Optimization**
- Query caching
- Projection tuning
- Explain/debug mode
- Search metrics
- Ranking adjustments

#### Definition of Done (Phase 1)
- [ ] No table scans on search endpoints
- [ ] Projection rebuild completes successfully
- [ ] Incremental indexing verified
- [ ] Facets operate correctly
- [ ] Autocomplete latency <100 ms (warm cache)
- [ ] Search endpoint p95 <300 ms (target)
- [ ] Playwright coverage for core search flows
- [ ] Ranking rules documented
- [ ] Search analytics operational

### Phase 2 — Admin / Backoffice
*Required early to populate the catalog and test search quality.*
- Book management
- Author management
- Genres
- Languages
- Collections
- Featured content
- Editorial announcements
- Search re-index controls
- Projection rebuild tools

### Phase 3 — Authentication Polish
- Email verification
- Password reset
- Session recovery
- Onboarding
- Profile completion
- Redirect handling

### Phase 4 — Background Processing
*Wiring the operational infrastructure.*
- Search indexing worker bindings
- Statistics projections
- Export generation
- Email delivery
- Cache invalidation
- Scheduled maintenance

### Phase 5 — Notifications
*Consuming domain events.*
- Map `catalog.book.published` → `notification.created`
- Map `account.export.completed` → `notification.created`

### Phase 6 — Production Hardening
- Structured logging
- Distributed tracing & Metrics
- Health checks
- Rate limiting
- Retry policies & Circuit breakers
- Caching strategy
- Backup validation
- Disaster recovery drills
- Security review (OWASP, RLS, Dependencies)

### Phase 7 — Testing
*Comprehensive test pyramid.*
- E2E (Playwright)
- Integration (Server Actions, RLS, Jobs, Projections)
- Application (Query/Command Handlers)
- Domain (Aggregates, Domain Services, Value Objects)

---

## V1 Feature Freeze

To avoid scope creep, the following capabilities are explicitly included or excluded from the V1 release.

### INCLUDED in V1
- Public catalog browsing
- Search
- Reader
- Personal library
- Authentication
- Notifications
- Admin
- Background jobs
- Exports
- Analytics
- Production readiness

### DEFERRED to V2
- Reviews and ratings
- Social features
- Following users
- Reading groups
- Collaborative collections
- Recommendations powered by ML
- Gamification
- Real-time collaboration
- Marketplace features
- Plugin ecosystem
- Mobile-specific enhancements beyond responsive support
