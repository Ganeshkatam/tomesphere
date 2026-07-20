# Phase 1: Information Architecture & Content Hierarchy

This board defines "where users go" and "how information is structured." By freezing the structural relationships between objects and views, we ensure navigation is predictable and content is prioritized correctly.

## 1. Object Hierarchy

This is the mental model users should have of how content is organized in TomeSphere.

```text
Book (The atomic unit)
  ↓
Author (Creator of books)
  ↓
Series (Chronological grouping of books)
  ↓
Collection (Thematic or curated grouping of books)
  ↓
Genre (Broad categorization)
  ↓
Subject (Specific topics)
```

## 2. Navigation Hierarchy

This outlines the primary paths users can take through the public and workspace areas.

### Public Discovery
```text
Discover (Overview)
  ├── Search
  ├── Book Detail
  │     └── Read (Preview)
  ├── Trending
  ├── Featured
  ├── New Arrivals
  ├── Authors
  └── Collections
```

### Personal Workspace
```text
Home (Dashboard)
  ├── Library (Saved Books)
  ├── Read (Immersive Reader)
  └── Account
        ├── Profile
        ├── Preferences
        └── Security
```

## 3. Core User Journeys

These are the primary flows that our UI must support seamlessly.

### A. The "Discover to Read" Journey
```text
Landing 
  ↓ 
Search or Discover Overview 
  ↓ 
Book Detail 
  ↓ 
Add to Library (Workspace) 
  ↓ 
Read (Immersive Reader)
```

### B. The "Return to Reading" Journey
```text
Home (Workspace Dashboard)
  ↓
Continue Reading Widget
  ↓
Read (Immersive Reader)
```

### C. The "Deep Dive" Journey
```text
Book Detail
  ↓
Click Author Name
  ↓
Author Detail (All books by author)
  ↓
Click Series Name
  ↓
Series Detail (Books in reading order)
```

## 4. Content Hierarchy (Page-Level Structure)

This defines what content is most important on specific pages. It dictates the visual weight and order of elements before we even touch styling.

### Book Detail Page
Reading is the goal, so getting the user into the book is the primary action.

```text
1. Cover (Visual anchor)
2. Title & Author (Core identity)
3. Primary Actions (Read / Add to Library)
4. Reading Status (If saved)
5. Description (The hook)
6. Metadata (Length, Published Date, Genres)
7. Subjects & Tags (Exploration)
8. Recommendations (Similar books)
```

### Workspace Home (Dashboard)
The dashboard should immediately orient the user to their ongoing tasks.

```text
1. "Continue Reading" (Immediate resumption)
2. Reading Activity/Stats (Motivation)
3. Recent Additions to Library (Queue)
4. Personalized Recommendations (Discovery)
```

### Immersive Reader
The reader must be entirely focused on the text.

```text
1. The Text (Absolute highest priority)
2. Progress Indicator (Subtle, unobtrusive)
3. Reading Controls (Hidden by default, summoned on interaction)
4. Table of Contents (Accessible via controls)
```
