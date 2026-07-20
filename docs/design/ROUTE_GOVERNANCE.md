# Route Governance

This document establishes the canonical routing architecture for TomeSphere, organizing routes by **user intent** rather than underlying entities. The application exposes a minimal set of primary top-level experiences. All variations are handled internally via modes, tabs, or shared components.

## Canonical Primary Routes

| Route          | Purpose        | Layout    | Search        | Auth |
| -------------- | -------------- | --------- | ------------- | ---- |
| `/`            | Marketing      | Marketing | Global        | No   |
| `/discover`    | Explore        | App       | Global + Page | No   |
| `/search`      | Search         | App       | Global + Page | No   |
| `/book/[slug]` | Book details   | App       | Global        | No   |
| `/library`     | Personal books | App       | Global + Page | Yes  |
| `/read/[id]`   | Reader         | Reader    | No            | No   |
| `/account`     | Settings       | App       | Global        | Yes  |

## Principles

1. **Intent-Driven**: Organize by what the user wants to accomplish (e.g., "Library") rather than raw data models (e.g., "Saved Books", "History").
2. **Consolidated Experiences**: Avoid fragmenting related views into multiple Next.js pages. Use tabs, query parameters (`?view=authors`), or parallel routes pointing to shared components instead of creating dozens of distinct routes.
3. **No ID Exposure for Identity**: Routes that depend on the authenticated user (e.g., profile setup or dashboard) should infer the user from the session, not from the URL path.
4. **Isolated Reader**: The reading experience is immersive and deliberately isolated from the standard app layout.
