# TomeSphere Product Roadmap 2026

With the core architecture officially frozen, TomeSphere has transitioned from **Architecture-Driven Development** to **Feature-Driven Development**.

All future development is organized into capabilities and product epics, building upon the established Domain-Driven Design (DDD) and CQRS foundations.

---

## The Product Milestones (Incremental Releases)

Rather than completing entire epics sequentially, work is bundled into cross-epic releases to deliver cohesive user value.

| Milestone | Focus                   | Key Deliverables                            | Target Success Metrics                                                                |
| :-------- | :---------------------- | :------------------------------------------ | :------------------------------------------------------------------------------------ |
| **M1**    | **MVP Reader**          | Session Resume, Highlights, Reading Timer   | 80% of users resume reading successfully; average session length increases.           |
| **M2**    | **Personalized Home**   | Continue Reading, Trending, Recommendations | Higher recommendation click-through; increased library additions.                     |
| **M3**    | **Library Power Tools** | Custom Shelves, Bulk Operations, Import     | More shelves created; successful Goodreads imports; reduced manual organization time. |
| **M4**    | **Insights**            | Reading Dashboard, Heatmap, Year in Review  | Increased dashboard engagement and report views at end of month.                      |
| **M5**    | **AI Companion**        | Chapter Summaries, Conversational Search    | High AI feature adoption and repeat usage during reading sessions.                    |
| **M6**    | **Platform Operations** | Admin Dashboard, Projection Health          | 99.9% relay success rate, projection freshness < 1s, optimal uptime.                  |

---

## ️ Platform

_The foundational domains that support the entire application._

### Epic 1: Catalog & Content Management

_The canonical source of truth for books._

- [ ] **ISBN Lookup & Ingest:** Automated metadata fetching (Open Library, Google Books).
- [ ] **Metadata Enrichment:** Multi-edition support, publisher data.
- [ ] **Author Pages:** Dedicated views for authors and their bibliography.
- [ ] **Series Support:** Grouping and ordering books within a series.
- [ ] **Duplicate Merge Workflows:** Catalog deduplication.

### Epic 2: Operations & Internal Tooling

_Ensuring the platform remains healthy and scalable._

- [ ] **Monitoring & Alerting:** System-wide health checks.
- [ ] **Outbox Dashboard:** Relay health and failed event replay.
- [ ] **Projection Management:** Manual projection rebuilds and lag monitoring.
- [ ] **Audit Logs & Feature Flags:** Internal tooling for safe rollouts.

---

##  Core Product

_The essential daily-use features for readers._

### Epic 3: Reader Experience

_The core loop of the application._

- [ ] **Session Resume:** Seamlessly jump back into the exact position.
- [ ] **Reading Timer:** Real-time, observed tracking (not estimated).
- [ ] **Highlights & Annotations:** Rich text selection and note-taking.
- [ ] **Note Editor:** Markdown support for reader thoughts.
- [ ] **Reading Goals & Streaks:** Gamification and tracking for consecutive days.

### Epic 4: Discovery UX

_Surfacing books using the robust recommendation engine._

- [ ] **Continue Reading:** Quick-access for current library items.
- [ ] **Personalized Shelves:** Dynamic home screen layout based on user signals.
- [ ] **Because You Read...:** Contextual recommendations based on past ratings.
- [ ] **Recommendation Explanations:** e.g., _"Recommended because you rated Atomic Habits "_.
- [ ] **Trending & New Releases:** Leveraging the `analytics_book_statistics` projection.

### Epic 5: Library Organization

_Empowering power-users to manage massive collections._

- [ ] **Custom Shelves:** Drag-and-drop shelf management.
- [ ] **Bulk Operations:** Multi-select editing and moving.
- [ ] **Import / Export:** Goodreads CSV ingest to populate Outbox events.
- [ ] **Archive & Favorites:** Deep library curation tools.

---

##  Intelligence

_Differentiating capabilities that make TomeSphere smart._

### Epic 6: Analytics UI

_Visualizing the facts captured in our Analytics Projections._

- [ ] **Reading Dashboard:** Centralized view of reading habits.
- [ ] **Reading Heatmap:** GitHub-style activity contribution graphs.
- [ ] **Genre Evolution:** Visualizing genre preference shifts over time.
- [ ] **Year in Review:** Spotify Wrapped for books.
- [ ] **Completion Rate & Velocity:** Insights into reading speed and follow-through.

### Epic 7: AI Assistant

_Integrating LLMs natively into the reading experience._

- **AI for Reading:** Explain difficult passages, chapter summaries, definitions, and contextual lore.
- **AI for Learning:** Auto-generate flashcards, quizzes, and study plans.
- **AI for Discovery:** Conversational search ("Books like X but set in space") and personalized recommendations.

---

##  Future

_Capabilities reserved for long-term growth._

### Epic 8: Social

_Connecting readers with communities._

- [ ] **Public Profiles & Following:** Build a network of readers.
- [ ] **Reviews & Reading Activity Feed:** See what friends are reading.
- [ ] **Shared Shelves & Book Clubs:** Collaborative curation and reading challenges.
