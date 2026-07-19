# Decision Record: `/profile`

## Scope & Ownership

- **Candidate:** `/profile`
- **Included:**
  - Routes: `app/(workspace)/profile/page.tsx`, `app/(workspace)/profile/[id]/page.tsx`
  - Active Components: `PublicProfileScreen.tsx`, `PublicProfileClient.tsx`, `NotificationCenter.tsx`, `ProfileEditForm.tsx`
  - Orphaned Components: `ProfileScreen.tsx`, `ProfileClient.tsx`, `ProfileHeader.tsx`, `ProfileOverview.tsx`, `ProfileStats.tsx`, `ProfileNetwork.tsx`
  - Actions: `getNetworkData`
- **Excluded:** `/me/profile`
- **Primary Owner:** User / Profile

## Product Investigation

- **Purpose:** Serve as the user's public identity (via `/profile/[id]`) and their own dashboard (legacy).
- **UX Overlap:** The "own profile" view (`/profile` base route) overlaps with `/me/profile`. However, the `/me/profile` view currently _only_ contains an edit form (`ProfileEditScreen`). It is missing the Stats, Overview, and Network (followers/following) capabilities that existed in the legacy `/profile` implementation.
- **Replacement Target:** `/me/profile` for "own profile". `/profile/[id]` stays active for public profiles.

**Capability Parity**

| Capability                       | Legacy Profile | Me (`/me/profile`) | Result              |
| :------------------------------- | :------------: | :----------------: | :------------------ |
| Profile Editing                  |       ✓        |         ✓          | Duplicate           |
| Profile Stats                    |       ✓        |         ✗          | **Capability Lost** |
| Profile Network (Followers)      |       ✓        |         ✗          | **Capability Lost** |
| Public Profile (`/profile/[id]`) |       ✓        |        N/A         | Retain              |

## Technical Investigation

- **Entry Points:**
  - `Footer.tsx` checks for `'/profile'`.
  - `CommandPalette.tsx` pushes to `/profile`.
  - `VerificationStatus.tsx` pushes to `/profile/verify-phone` (broken link, should be `/me/security`).
  - _Critical Discovery:_ Because `ProfileNetwork.tsx` is orphaned, there are currently **no inbound links** in the UI to `/profile/[id]`. The public profile feature is structurally active but completely unreachable by normal navigation.

**Dependency Graph**

```text
/profile (base)
    ↓
page.tsx
    ↓
redirect('/me/profile')

/profile/[id]
    ↓
PublicProfileScreen
    ↓
PublicProfileClient (Active, but unreachable)

Legacy Implementation (Orphaned)
ProfileScreen → ProfileClient → [ProfileHeader, ProfileStats, ProfileOverview, ProfileNetwork]
```

## Analysis & Evidence

- **Static Evidence:** The legacy "Own Profile" components are entirely orphaned. `/profile/[id]` is active but has no inbound navigation since `ProfileNetwork` is dead.
- **Runtime Evidence:** Navigating to `/profile` redirects to `/me/profile`. Navigating to `/profile/[id]` successfully loads the public profile. Navigating to `/profile/verify-phone` 404s.
- **Findings:** This candidate differs materially from `/dashboard`. It contains a mix of active social routes (`/profile/[id]`) and orphaned legacy components that represent _lost capabilities_ (Network/Stats).

## Architecture Ownership

```text
Identity
    owns
        /me/profile (Private Account Management)

Community
    owns
        /profile/[id] (Public Social Presence)
```

## Decision

- **Status:** Closed
- **Options:** 1. Delete, 2. Merge, 3. RESTORE → CONSOLIDATE
- **Alternatives Considered:**
  - _Option 2 (Delete & Archive):_ Rejected because it would result in a permanent capability loss (network, stats, overview) and sever all UX discoverability to public profiles.
- **Migration Strategy:** RESTORE → CONSOLIDATE
  - **Stage A — Capability Restoration:** Extract missing capabilities (Stats, Overview, Network) from the orphaned `ProfileClient.tsx` and integrate them into `/me/profile` without rewriting them.
  - **Stage B — Public Profile Recovery:** Retain `/profile/[id]` as a distinct product capability owned by Community.
  - **Stage C — Discoverability:** Investigate and establish a navigation path for `/profile/[id]` (tracked in DR-008).
  - **Stage D — Redirect:** Set up 308 redirect from `/profile` to `/me/profile`. Fix broken links (e.g. `VerificationStatus.tsx`).
  - **Stage E — Archive:** Archive `ProfileScreen` and `ProfileClient` only after all capabilities have replacements.

## Capability Matrix

| Capability                       | Expected Result                   |
| :------------------------------- | :-------------------------------- |
| Edit profile                     | Present                           |
| Overview                         | Present                           |
| Stats                            | Present                           |
| Security                         | Only available via `/me/security` |
| Followers                        | Deferred                          |
| Following                        | Deferred                          |
| Network                          | Deferred                          |
| Public profile                   | Deferred                          |
| Duplicate profile implementation | None                              |

## Success Criteria

- `/me/profile` displays User Stats, Overview, and Network.
- `/profile/[id]` remains active.
- `VerificationStatus.tsx` broken link is fixed.
- **Decision:** **RESTORE → CONSOLIDATE**

## Confidence Rule

| Confidence | Requirement                                         | Action                      |
| :--------- | :-------------------------------------------------- | :-------------------------- |
| **High**   | Capability loss identified; strategy prevents loss. | May implement Stage A and D |
