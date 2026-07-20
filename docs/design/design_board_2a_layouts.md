# Phase 2A: Layout Architecture

This board defines the macro structural "shells" of TomeSphere. Every page in the application MUST use one of these predefined layouts. No ad hoc layouts are permitted.

## Core Layouts & Responsibilities

| Layout | Responsibility | Primary Routes |
| :--- | :--- | :--- |
| **Marketing** | Brand awareness and conversion. | `/`, `/about`, `/contact`, `/terms` |
| **Discovery** | Broad exploration, persistent search, and contextual filtering. | `/discover/*`, `/search` |
| **Workspace** | Managing personal data, reading activity, and private collections. | `/home`, `/library`, `/account` |
| **Reader** | Pure immersive reading. | `/read/[id]` |
| **Admin** | Operations, content ingestion, and platform management. | Admin App |

---

## 1. Marketing Layout

**Structure**:
```text
+------------------------------------------------------+
| Header (Brand Logo, Global Nav, Login/CTA)           |
+------------------------------------------------------+
|                                                      |
|                                                      |
| Main Content (Full width, centered constraints)      |
|                                                      |
|                                                      |
+------------------------------------------------------+
| Footer (Sitemap, Legal, Socials)                     |
+------------------------------------------------------+
```

**Key Traits**: High visual impact, full bleed sections, clear call-to-actions.

---

## 2. Discovery Layout

**Structure**:
```text
+------------------------------------------------------+
| Header (Logo, Global Search Bar, Login/Profile)      |
+------------------------------------------------------+
|          |                                           |
| Sidebar  | Main Content (Grids, Lists)               |
| (Nav,    |                                           |
| Filters) |                                           |
|          |                                           |
|          |                                           |
+------------------------------------------------------+
```

**Key Traits**: 
- **Persistent Search**: Search is always visible in the header.
- **Contextual Sidebar**: The sidebar provides quick navigation between discovery modes (Trending, Featured, Authors) and eventually houses facet filters (Genres, Languages).
- **Infinite Browsing**: The main content area prioritizes grids of books optimized for scanning.

---

## 3. Workspace Layout

**Structure**:
```text
+------------------------------------------------------+
| Header (Logo, Search, Notification Bell, Profile)    |
+------------------------------------------------------+
|          |                                           |
| Sidebar  | Main Content (Dashboard, Library)         |
| (Home,   |                                           |
| Library, |                                           |
| Account) |                                           |
|          |                                           |
+------------------------------------------------------+
```

**Key Traits**:
- Very similar structure to Discovery to minimize cognitive load, but the Sidebar shifts focus to personal navigation rather than global catalog exploration.
- Header includes user-specific tools (Notifications).

---

## 4. Reader Layout

**Structure**:
```text
+------------------------------------------------------+
| Top Bar (Hidden by default, Back, TOC, Settings)     |
+------------------------------------------------------+
|                                                      |
|                                                      |
| Main Content (The Book Text, Centered, Max-Width)    |
|                                                      |
|                                                      |
+------------------------------------------------------+
| Progress Bar (Persistent but subtle, or hidden)      |
+------------------------------------------------------+
```

**Key Traits**:
- **Distraction-Free**: All chrome disappears when actively reading.
- **Typography-Centric**: The layout exists purely to serve the legibility of the text (line length, line height, margins).

---

## 5. Admin Layout (Reference)

**Structure**:
```text
+------------------------------------------------------+
| Sidebar (Fixed, Nav) | Topbar (Breadcrumbs, Actions) |
|                      +-------------------------------+
|                      |                               |
|                      | Main Content (Data Tables,    |
|                      | Forms, Dashboards)            |
|                      |                               |
+------------------------------------------------------+
```

**Key Traits**:
- Data-dense, utility-focused. Uses standard enterprise patterns (tables, complex forms) distinct from the consumer-facing public application.
