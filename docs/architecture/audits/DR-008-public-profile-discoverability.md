# Decision Record: Public Profile Discoverability

## Scope & Ownership

- **Candidate:** `/profile/[id]`
- **Included:**
  - Discoverability and navigation paths to public profiles.
- **Excluded:**
  - Internal components of `PublicProfileScreen.tsx`.
- **Primary Owner:** Community

## Product Investigation

- **Purpose:** Determine how users should discover and navigate to public profiles of other users.
- **Current State:** The `PublicProfileScreen` exists and functions correctly. However, following the deprecation of the legacy `ProfileNetwork` component (which previously linked to `/profile/[id]`), there are currently zero inbound navigation links within the application UI to reach a public profile. The feature is completely undiscoverable unless a user manually inputs the URL.
- **Potential Origins:**
  - Followers / Following lists
  - Book Reviews / Ratings
  - Shared Notes or Annotations
  - Community Activity Feeds
  - Study Groups
  - Search (User Directory)

## Technical Investigation

- **Entry Points:** None currently.
- **Dependencies:**
  - Relies on `ProfileNetwork` restoration (tracked in DR-003) to provide at least one navigation path from `/me/profile` (Followers/Following).

## Analysis & Evidence

- **Findings:** A public profile capability exists but is unreachable. This is an architectural and UX flaw where a bounded context (Community) has no entry points from the rest of the application.

## Decision

- **Status:** Draft / Investigation Needed
- **Options to Evaluate:**
  - 1. Restore `ProfileNetwork` links (Ongoing via DR-003).
  - 2. Implement User Search functionality.
  - 3. Add author links to book reviews and shared notes.
- **Migration Strategy:** TBD pending investigation.
- **Decision:** **Pending Investigation**

## Confidence Rule

| Confidence | Requirement                                         | Action        |
| :--------- | :-------------------------------------------------- | :------------ |
| **Low**    | Requires further product design on social features. | Keep as Draft |
