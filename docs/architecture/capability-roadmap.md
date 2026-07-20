# TomeSphere Capability Roadmap

This document outlines the product capabilities of the TomeSphere platform. It organizes the architecture by **business capability** rather than technical layers, providing a strategic view of how the system fulfills user needs.

## Phase 1–6: The Foundations

### 1. Catalog (Reading: Books)

- **Owner**: `modules/reading/books`
- **Responsibility**: Owns the global, immutable metadata of all books available in the system.
- **Key Commands**: `AddBook`, `UpdateBookMetadata`
- **Read Models**: `BookDetailsReadModel`
- **Events Produced**: `BookAddedToCatalog`, `BookMetadataChanged`

### 2. Library (Reading: Library)

- **Owner**: `modules/reading/library`
- **Responsibility**: Owns the user's personal relationship with books (e.g., Want to Read, Currently Reading, Read).
- **Key Commands**: `AddBookToLibrary`, `MoveBookToShelf`, `RemoveBookFromLibrary`
- **Read Models**: `LibraryShelfReadModel`
- **Dependencies**: `Books` (for metadata enrichment)
- **Events Produced**: `BookAddedToLibrary`, `BookShelfChanged`

### 3. Reader (Reading: Reader)

- **Owner**: `modules/reading/reader`
- **Responsibility**: Owns the active reading session, enforcing rules around progress updates, highlighting, and bookmarking.
- **Key Commands**: `StartReadingSession`, `FinishReadingSession`, `LogHighlight`
- **Read Models**: `ActiveSessionReadModel`
- **Dependencies**: `Books` (for validation)
- **Events Produced**: `ReadingSessionCompleted`

### 4. Identity (User: Profile)

- **Owner**: `modules/user/profile`
- **Responsibility**: Owns the user's identity, display name, avatar, and core preferences.
- **Key Commands**: `CreateProfile`, `UpdateProfile`
- **Read Models**: `ProfileDashboardReadModel`
- **Events Produced**: `ProfileCreated`

### 5. Gamification (User: Progress)

- **Owner**: `modules/user/progress`
- **Responsibility**: Owns the XP system, streaks, goals, and achievements based on reading activity.
- **Key Commands**: `ApplyReadingActivity`
- **Read Models**: `UserProgressReadModel`
- **Dependencies**: None (Operates on generic activities dispatched via `ReadingActivityCoordinator`)

---

## Phase 7: Discovery Foundations

### 6. Search (Discovery: Search)

- **Owner**: `modules/discovery/search`
- **Responsibility**: Owns the search index and query capability. It is a projection domain that does not own the books themselves.
- **Key Commands**: `IndexBook`, `UpdateIndexedBook`, `RemoveIndexedBook`
- **Read Models**: `SearchResultReadModel`
- **Events Consumed**: `BookAddedToCatalog`, `BookMetadataChanged` (via `CatalogIndexingCoordinator`)

---

## Phase 8: Recommendations (Upcoming)

- **Owner**: `modules/discovery/recommendations`
- **Responsibility**: Suggests books based on user preferences, reading history, and similarity. Reuses the `SearchRepository` and provides a `PersonalizedRankingPolicy`.

## Phase 9: Offline & Sync (Upcoming)

- **Owner**: Cross-cutting (`reading`, `infrastructure`)
- **Responsibility**: Enables the `Reader` and `Library` domains to operate offline, resolving conflicts and syncing progress back to the server.

## Phase 10: Hybrid Search (Upcoming)

- **Owner**: `modules/discovery/search`
- **Responsibility**: Introduces `pgvector`, embeddings, and semantic matching to the Search Domain, operating transparently behind the `SearchRepository` contract.

## Phase 11: AI Features (Upcoming)

- **Owner**: `modules/discovery/ai` or integrated into `Reader`
- **Responsibility**: Conversational discovery, AI-generated summaries, and reading assistants.
