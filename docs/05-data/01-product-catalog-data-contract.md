# TomeSphere — Product Catalog & Data Contract

**Document Type:** Data Contract & Schema Specification  
**Owner:** Database Architect / Backend Lead  
**Status:** Draft  
**Last Reviewed:** 2026-10-24  
**Dependencies:** `docs/04-architecture/01-system-architecture-boundaries.md`  

---

## 1. Objective & Authority

This document defines the canonical schema, data contracts, and validation rules governing product records across TomeSphere. It establishes how TomeSphere stores, validates, and serves product information without inventing, corrupting, or duplicating data.

Any change to the product data model must comply with this contract and update the corresponding validators in `server/validators/project.validator.js` and migration files in `supabase/migrations/`.

---

## 2. Canonical Product Record Schema

### Database Table: `public.projects`

| Column | Data Type | Nullable | Default | Description & Constraint |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `TEXT` | No | `proj_<hex>` | Primary key. Unique system identifier. |
| `slug` | `TEXT` | Yes (Unique) | `NULL` | Permanent, URL-safe identifier for routing. |
| `name` | `TEXT` | No | - | Product display name (2–80 characters). |
| `category` | `TEXT` | No | `'WEB APPS'` | Product classification category. Must match `ALLOWED_CATEGORIES`. |
| `tagline` | `TEXT` | Yes | `NULL` | Concise single-sentence summary (<120 characters). |
| `description` | `TEXT` | No | - | Comprehensive product description (10–500 characters). |
| `url` | `TEXT` | No | - | Primary destination/launch URL. Must be valid `http:` or `https:`. |
| `github_url` | `TEXT` | Yes | `NULL` | Public source code repository URL (or `NULL` if closed source). |
| `image` | `TEXT` | Yes | `NULL` | URL or asset path to primary screenshot/preview image. |
| `accent` | `TEXT` | Yes | `'lavender'` | Accent token for thematic rendering (`lavender`, `peach`, `blue`, etc.). |
| `featured` | `BOOLEAN` | No | `false` | Editorial flag for placement in homepage spotlight. |
| `status` | `TEXT` | No | `'Live'` | Operational state. Must match `ALLOWED_STATUSES`. Only `'Live'` readable publicly. |
| `year` | `TEXT` | Yes | `YEAR(NOW())` | Launch or release year string (e.g. `'2026'`). |
| `tags` | `JSONB` | No | `'[]'::jsonb` | Array of text tags (max 15 tags, max 30 chars each). |
| `display_order` | `INTEGER` | Yes | `0` | Manual ordering weight for catalog ranking. |
| `metrics` | `JSONB` | Yes | `'{}'::jsonb` | Structured activity metadata (see Section 4). |
| `created_at` | `TIMESTAMPTZ` | No | `NOW()` | Timestamp when product record was created. |
| `updated_at` | `TIMESTAMPTZ` | No | `NOW()` | Timestamp updated automatically via trigger `handle_updated_at()`. |

---

## 3. Allowed Enumerations & Format Rules

### 3.1 Allowed Categories (`ALLOWED_CATEGORIES`)
```javascript
export const ALLOWED_CATEGORIES = [
  'WEB APPS',
  'PRODUCTIVITY',
  'DEVELOPER TOOLS',
  'FINANCE',
  'COMMUNITY',
  'EDUCATION',
  'BUSINESS TOOLS',   /* Seed-supported */
  'REAL-TIME APPS',   /* Seed-supported */
  'ECOMMERCE',        /* Seed-supported */
  'MARKETPLACE',      /* Seed-supported */
  'MOBILE',           /* Seed-supported */
  'OTHER'
];
```

### 3.2 Allowed Statuses (`ALLOWED_STATUSES`)
- `'Live'`: Fully deployed, verified operational, public access enabled.
- `'In progress'`: Under active development; accessible only to administrators or beta testers.
- `'Draft'`: Newly drafted entry; hidden from all public catalog views.
- `'Archived'`: Deprecated or retired product; maintained for historical reference.

### 3.3 Slug Specification
- **Format**: Lowercase alphanumeric characters separated by single hyphens (`^[a-z0-9]+(?:-[a-z0-9]+)*$`).
- **Immutability**: Once published, a product slug must not be modified to avoid breaking external backlinks and search engine indexation.
- **Uniqueness**: Enforced via PostgreSQL unique constraint `UNIQUE (slug)`.

---

## 4. Structured Metrics & Telemetry Contract

The `metrics` column allows storing verified product signals without database schema alterations.

### Schema Contract for `projects.metrics`
```json
{
  "active_users": {
    "count": 1250,
    "period": "30d",
    "verified_at": "2026-10-20T00:00:00Z"
  },
  "github_stars": {
    "count": 42,
    "synced_at": "2026-10-24T00:00:00Z"
  },
  "uptime_percent": {
    "value": 99.95,
    "window": "90d"
  }
}
```

### Enforcement Rules
1. Unverified or fabricated numbers are strictly prohibited.
2. If metrics for a product are uncollected or unavailable, `metrics` must remain an empty object `{}`.
3. The frontend must not render placeholder metric badges (e.g. "10k+ users") unless backed by an explicit metric entry in the database.

---

## 5. API Request & Response Contracts

### 5.1 Public Read Catalog: `GET /api/v1/projects`
- **Query Parameters**:
  - `category` (string, optional): Filter by category.
  - `status` (string, optional, defaults to `'Live'` under public RLS).
  - `featured` (boolean string, optional): Filter by featured flag (`'true'` or `'false'`).
  - `q` (string, optional): Substring query matched against name, category, description, and tags.
  - `limit` (number, optional, max 100, default 50).
- **Response Format**:
```json
{
  "success": true,
  "count": 7,
  "data": [
    {
      "id": "proj_bookgarden",
      "slug": "bookgarden",
      "name": "BookGarden",
      "category": "WEB APPS",
      "tagline": "Digital Reading Platform & Knowledge Archive",
      "description": "TomeSphere digital reading platform...",
      "url": "https://bookgarden.tomesphere.in",
      "github_url": null,
      "image": null,
      "accent": "lavender",
      "featured": true,
      "status": "Live",
      "year": "2026",
      "tags": ["TypeScript", "Next.js", "Clean Architecture"],
      "display_order": 1,
      "metrics": {},
      "created_at": "2026-10-23T18:00:00.000Z",
      "updated_at": "2026-10-23T18:00:00.000Z"
    }
  ]
}
```

### 5.2 Public Read by Slug: `GET /api/v1/projects/slug/:slug` (Approved for Phase 2)
- **Path Parameter**: `:slug` (string, URL-safe slug).
- **Response Format**:
```json
{
  "success": true,
  "data": {
    "id": "proj_bookgarden",
    "slug": "bookgarden",
    "name": "BookGarden",
    "...": "..."
  }
}
```
- **Error Response** (when not found):
```json
{
  "error": {
    "code": "PROJECT_NOT_FOUND",
    "message": "Product with slug 'bookgarden' was not found."
  }
}
```

---

## 6. Three-Tier Status Classification

### 6.1 Verified Current State
- Schema implemented in `supabase/migrations/20261023000000_init_tomesphere_schema.sql`.
- Seed records for 7 production ecosystem products in `supabase/seed.sql`.
- Server payload validator in `server/validators/project.validator.js` enforcing length and type checks.
- 29 security and validator test cases passing in `tests/security.test.js`.

### 6.2 Approved Decisions
- Extend `server/validators/project.validator.js` to ensure `ALLOWED_CATEGORIES` covers all 11 active seed categories.
- Introduce `GET /api/v1/projects/slug/:slug` endpoint in Express backend.
- Expose `apiClient.projects.getBySlug(slug)` in `lib/api-client.js`.

### 6.3 Proposals (Subject to Further Review)
- Ingest real-time GitHub repository stats (stars, latest release tag) via periodic background worker.
- Expand `projects` schema with explicit `screenshots` array (`JSONB`) for product gallery carousels.
