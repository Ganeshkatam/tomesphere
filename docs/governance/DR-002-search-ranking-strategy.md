# DR-002: Search Domain Model and Ranking Strategy

**Date:** 2026-07-20
**Status:** Enacted

## Context
As we transition from architecture to product execution, we are implementing **Milestone 9: Search & Discovery Intelligence**. This requires a stable foundation for the search projection database schema and the algorithm used to determine relevance.

## Decision 1: Projection Model Separation
We will separate **searchable text fields** from **ranking signals** in the projection schema. The complete structure is:

```typescript
interface SearchDocument {
    bookId: string; // PK
    slug: string;
    
    // Searchable Fields
    title: string;
    subtitle?: string;
    description?: string;
    authors: string[];
    genres: string[];
    subjects: string[];
    language: string;
    publicationYear?: number;
    isPublic: boolean;

    // Analytics / Ranking signals (updated periodically)
    popularityScore: number;
    downloadCount: number;
    viewCount: number;
    averageRating: number;
    ratingCount: number;

    // Search Engine Data
    ftsTokens: string; // tsvector column
    projectionVersion: number;
    indexedBy: string; // 'system-indexer'
    sourceUpdatedAt: Date;
    indexedAt: Date;
}
```

## Decision 2: PostgreSQL Full-Text Search (FTS) Trigger
To maintain a single source of truth for the projection while leveraging database-level text processing:
1. The `SearchIndexer` (Projection Worker) is responsible for aggregating all fields and upserting the row.
2. A PostgreSQL database trigger on `discovery_search_documents` automatically updates the `fts_tokens` column upon insert/update.
3. The trigger uses **Weighted TSVectors**:
   - **Weight A (Highest):** `title` and `authors`
   - **Weight B (Medium):** `genres` and `subjects`
   - **Weight C (Lowest):** `description`

## Decision 3: Ranking Formula and Future Independence
Relevance will be a combination of text similarity (FTS) and normalized popularity metrics.

**V1 Formula:**
`rank = textScore + 0.15 * popularitySignal`
*(Where `popularitySignal = ln(downloads + 1) + 0.5 * ln(views + 1) + ratingBoost`)*

**Core Principle:** 
Ranking is composed of independent signals. New signals (freshness, trending, personalized relevance) may be added in future versions **without changing the projection schema or indexing pipeline**. 

## Decision 4: Indexes
To support efficient faceted filtering, B-Tree indexes are required on commonly filtered fields: `is_public`, `language`, `publication_year`, and `projection_version`. A GIN index is required on `fts_tokens`.
