# Decision Record: `/dashboard`

## Scope & Ownership

- **Candidate:** `/dashboard`
- **Included:**
  - Route: `app/(workspace)/dashboard`
  - Components: `DashboardScreen.tsx`, `DashboardClient.tsx`
- **Excluded:** `getDashboardData` (owned by `me/application`)
- **Primary Owner:** Progress / Analytics (legacy) -> Me
- **Secondary Consumers:** None

## Product Investigation

- **Purpose:** Provide an overview of the user's reading and learning activity.
- **User Journey:** User clicks "Knowledge Insights" in the footer or finishes a review session and returns to the dashboard.
- **Business Capability:** Progress tracking.
- **UX Overlap:** The `/me` (Today) and `/me/progress` pages provide the exact same functionality, but integrated into the workspace sidebar.
- **Replacement Target:** `/me`

**Capability Parity**

| Capability                 | Dashboard | Me (`/me/*`) | Result       |
| :------------------------- | :-------: | :----------: | :----------- |
| Reading summary            |     ✓     |      ✓       | Duplicate    |
| Recent Activity / Progress |     ✓     |      ✓       | Duplicate    |
| Reading List               |     ✓     |      ✓       | Duplicate    |
| Likes/Ratings/Comments     |     ✓     |      ✓       | Duplicate    |
| Contextual Sidebar         |     ✗     |      ✓       | Better in Me |

_Conclusion: No unique capability exists in Dashboard._

## Technical Investigation

- **Entry Points:**
  - `modules/shared/navigation/components/Footer.tsx` (Knowledge Insights link)
  - `modules/planner/academic/components/ReviewClient.tsx` (Exit review router.push)

**Dependency Graph**

```text
/dashboard
    ↓
page.tsx
    ↓
redirect('/me')

DashboardScreen
    ↑
(no imports found globally)

DashboardClient
    ↑
(no imports found globally)
```

- **Inbound Dependencies:** None beyond the entry points.
- **Outbound Dependencies:** `DashboardClient` depends on `getDashboardData`.
- **Components & Services:** `DashboardScreen` and `DashboardClient`.
- **Event Analysis:**
  - [ ] Publishes events
  - [ ] Consumes projections
  - [ ] Starts commands
  - [x] Reads queries (`getDashboardData`)
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
- `app/(workspace)/dashboard/page.tsx` is a hardcoded file containing only `redirect('/me');`.
- `DashboardScreen` and `DashboardClient` are orphaned components; they are not imported anywhere in the application.
- `Footer.tsx` and `ReviewClient.tsx` still push users to `/dashboard`, relying on the hard redirect to get them to `/me`.

**Runtime Evidence:**

- Navigating to `/dashboard` immediately redirects the browser to `/me` with no flash or hydration issues.

**Verification Evidence:**

- Removing the folder and updating the links will not break the build.

- **Facts:** The route is a redirect shell. The UI components are orphaned. The capabilities are perfectly duplicated in `/me`.
- **Findings:** The dashboard functionality was previously migrated to the `/me` workspace, but the legacy route folder and UI components were never cleaned up.

## Decision

- **Options:** 1. Keep, 2. Merge, 3. Delete
- **Alternatives Considered:**
  - _Keep existing route:_ Rejected because keeping redirect files in the `app/` directory pollutes the route tree.
- **Migration Strategy:** Archive then remove.
  - 1. Add 308 redirect from `/dashboard` to `/me` in `next.config.js`.
  - 2. Update `Footer.tsx` to link to `/me`.
  - 3. Update `ReviewClient.tsx` to push to `/me`.
  - 4. Delete `app/(workspace)/dashboard`.
  - 5. Move `DashboardScreen` and `DashboardClient` to `archive/milestone-1.5/progress/`.
- **Rollback Strategy:** Revert the Git commit.
- **Success Criteria:**
  - `Footer` links directly to `/me`.
  - Build passes.
  - `/dashboard` correctly redirects via `next.config.js`.
- **Decision:** **DELETE**

## Confidence Rule

| Confidence | Requirement                                                      | Action        |
| :--------- | :--------------------------------------------------------------- | :------------ |
| **High**   | Static + Runtime evidence confirms it's an unused redirect shell | May implement |

## Architecture Delta

- **Before:** Owners (2: legacy progress, me), Route Aliases (2: `/dashboard`, `/me`), Dependencies (Legacy orphaned UI components)
- **After:** Owners (1: me), Route Aliases (1: `/me`), Dependencies (Orphans removed)
