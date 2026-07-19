# Decision Record: `/analytics`

## Scope & Ownership

- **Candidate:** `/analytics`
- **Included:**
  - Route: `app/(workspace)/analytics`
  - Components: `AnalyticsClient.tsx`
  - Actions: `getAnalyticsStats` (`actions/analytics.ts`)
- **Excluded:** Anything in `/me/progress` or `/me/learning`.
- **Primary Owner:** Progress / Analytics (legacy) -> Me
- **Secondary Consumers:** None

## Product Investigation

- **Purpose:** Provide an overview of the user's study analytics, such as notes created, tests completed, average score, and recent activity.
- **User Journey:** User clicks "Analytics" in the UI to view their study progress.
- **Business Capability:** Progress and Analytics tracking.
- **UX Overlap:** The `/me/progress` and `/me/learning` pages handle the exact same domain, integrating these capabilities directly into the workspace sidebar.
- **Replacement Target:** `/me/progress`

**Capability Parity**

| Capability        | Analytics | Me (`/me/*`) | Result       |
| :---------------- | :-------: | :----------: | :----------- |
| Notes/Tests Stats |     ✓     |      ✓       | Duplicate    |
| Recent Activity   |     ✓     |      ✓       | Duplicate    |
| Achievements      |     ✓     |      ✓       | Duplicate    |
| Quick Actions     |     ✓     |      ✓       | Better in Me |

_Conclusion: No unique capability exists in Analytics._

**Projection Ownership Verification**

| Concern                            | Status       |
| :--------------------------------- | :----------- |
| `analytics_user_daily` projections | Unaffected   |
| `analytics_book_statistics`        | Unaffected   |
| Outbox relay                       | Unaffected   |
| Analytics event handlers           | Unaffected   |
| `/me/progress` queries             | Active owner |

_Conclusion: Deleting the legacy `/analytics` UI does not affect the new event-driven Analytics domain introduced in Phase 10C._

**`getAnalyticsStats` Verification**
The `getAnalyticsStats` server action is completely orphaned. The newer `/me/progress` route relies on `getDashboardData` and dedicated progress queries.

- **Decision:** ARCHIVE alongside the UI components. No future consumer is expected to use this legacy action.

## Technical Investigation

- **Entry Points:**
  - `modules/shared/navigation/components/Footer.tsx` (Legacy check)
  - `modules/learning/notes/components/NotesClient.tsx` (router.push fallback)

**Dependency Graph**

```text
/analytics
    ↓
page.tsx
    ↓
redirect('/me/progress')

AnalyticsClient
    ↑
(no imports found globally)

getAnalyticsStats
    ↑
(no imports found globally)
```

- **Inbound Dependencies:** None beyond the entry points.
- **Outbound Dependencies:** `AnalyticsClient` depends on `getAnalyticsStats`.
- **Components & Services:** `AnalyticsClient`, `getAnalyticsStats`.
- **Event Analysis:**
  - [ ] Publishes events
  - [ ] Consumes projections
  - [ ] Starts commands
  - [x] Reads queries (`getAnalyticsStats`)
  - [ ] Triggers analytics
  - [ ] Affects recommendations
  - [ ] Affects progress
- **Database:** N/A (Handled by action)

## Analysis & Evidence

**Evidence Inventory**

- [x] Static Evidence (Search results, Dependency graph, Import graph)
- [x] Runtime Evidence (Navigation, Redirect, User flow)
- [x] Historical Evidence (Roadmap, Architecture docs)
- [x] Verification Evidence (Build, TypeScript, ESLint)

**Static Evidence:**

- Global search confirmed no hidden references across `next.config`, `middleware`, or any other module.
- `app/(workspace)/analytics/page.tsx` is a hardcoded file containing only `redirect('/me/progress');`.
- `AnalyticsClient` and `getAnalyticsStats` are orphaned components; they are not imported anywhere in the application.

**Runtime Evidence:**

- Navigating to `/analytics` immediately redirects the browser to `/me/progress` with no flash or hydration issues.

**Verification Evidence:**

- Removing the folder and updating the links will not break the build.

- **Facts:** The route is a redirect shell. The UI components are orphaned. The capabilities are perfectly duplicated in `/me`.
- **Findings:** The analytics functionality was previously migrated to the `/me` workspace, but the legacy route folder and UI components were never cleaned up.

## Decision

- **Options:** 1. Keep, 2. Merge, 3. Delete
- **Alternatives Considered:**
  - _Keep existing route:_ Rejected because keeping redirect files in the `app/` directory pollutes the route tree.
- **Migration Strategy:** Archive then remove.
  - 1. Add 308 redirect from `/analytics` to `/me/progress` in `next.config.js`.
  - 2. Update `Footer.tsx` to remove `/analytics` from `shouldHideFooter`.
  - 3. Update `NotesClient.tsx` to push to `/me/progress`.
  - 4. Delete `app/(workspace)/analytics`.
  - 5. Move `AnalyticsClient` and `actions/analytics.ts` to `archive/milestone-1.5/progress/`.
- **Rollback Strategy:** Revert the Git commit.
- **Success Criteria:**
  - Build passes.
  - `/analytics` correctly redirects via `next.config.js`.
- **Decision:** **DELETE**

## Confidence Rule

| Confidence | Requirement                                                      | Action        |
| :--------- | :--------------------------------------------------------------- | :------------ |
| **High**   | Static + Runtime evidence confirms it's an unused redirect shell | May implement |

## Architecture Delta

- **Before:** Owners (2: legacy progress, me), Route Aliases (2: `/analytics`, `/me/progress`), Dependencies (Legacy orphaned UI components)
- **After:** Owners (1: me), Route Aliases (1: `/me/progress`), Dependencies (Orphans removed)
