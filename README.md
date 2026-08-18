# TomeSphere

TomeSphere is a next-generation digital reading platform and knowledge archive built with clean architecture, domain-driven design, and a modern web technology stack.

---

## Overview

TomeSphere provides readers, students, and researchers with a focused, distraction-free environment to discover, read, annotate, and organize literature. The platform combines full-text catalog search, normalized subject taxonomies, customizable personal bookshelves, and an integrated reader experience with cross-device reading progress.

---

## Core Capabilities

- **Catalog Discovery & Search**: High-performance full-text search with typo tolerance, verified author directories, and multi-facet filtering across subjects and genres.
- **Distraction-Free Reader**: Dedicated reader shell supporting PDF and EPUB formats with custom typography, font sizing, line height controls, and theme modes.
- **Reading Annotations & Highlights**: Inline text highlighting, color coding, page bookmarks, and markdown study notes anchored to book positions.
- **Personal Bookshelves**: User-curated custom reading shelves, library reading status queues (Want to Read, Currently Reading, Completed), and annual reading goals.
- **Granular Security & Privacy**: 100% Row Level Security (RLS) enforcement across all database tables, isolated background workers, and automated GDPR data export packages.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router, Server Components, Turbopack) |
| **Language** | TypeScript 5 (Strict Mode) |
| **Styling** | Tailwind CSS with Semantic Theme Tokens (Light & Dark modes) |
| **Database** | PostgreSQL 17.6 via Supabase |
| **ORM & Client** | Supabase SSR Client with strictly generated TypeScript database types |
| **Icons** | Lucide React |

---

## Architectural Principles

The repository adheres to strict architectural decision records:

- **ADR-001 (Application Boundary Rule)**: The frontend is a presentation layer only. Business rules, domain calculations, authorization decisions, and persistence logic execute exclusively in backend Application and Domain services exposed via Server Actions and DTOs.
- **ADR-002 (Database Authority)**: The live Supabase PostgreSQL database is the authoritative persistence model. Generated database types are synchronized automatically.
- **ADR-003 (Application Service Authority)**: All business workflows pass through dedicated Command/Query Handlers.
- **ADR-004 (Architectural Freeze)**: Bounded contexts and layers are structured according to Domain-Driven Design (DDD).
- **ADR-005 (Route Topology Freeze)**: Public discovery routes, authentication routes, and workspace shells follow a frozen topological hierarchy.

---

## Database Architecture Invariants

- **DB-INV-01 (Discovery Projection)**: Search and discovery interfaces consume lightweight projection DTOs and never retrieve raw book file payloads.
- **DB-INV-02 (Resource Isolation)**: Digital binaries (PDFs/EPUBs) are retrieved only through explicit resource workflows upon opening the reader.
- **DB-INV-03 (Worker Authorization)**: Background tasks and outbox relays execute via narrowly scoped worker privileges.
- **DB-INV-04 (Internal Schema Isolation)**: Internal database schemas are never exposed through the public Data API.
- **DB-INV-07 (DTO Boundary)**: Database rows are mapped through domain mappers before crossing to presentation components.
- **DB-INV-08 (Canonical Search)**: `execute_book_search_v1` is the canonical discovery search RPC.

---

## Project Structure

```
tomesphere-app/
├── app/                              # Next.js App Router (Layouts & Routes)
│   ├── (app)/                        # Public application routes (/discover, /search, /book)
│   ├── (public)/                     # Informational & Auth routes (/about, /support, /login)
│   ├── (reader)/                     # Standalone reader shell (/read/[id])
│   ├── (workspace)/                  # Authenticated workspace (/library, /dashboard, /account)
│   └── api/                          # API route handlers & background cron endpoints
├── modules/                          # Bounded Contexts (Clean Architecture)
│   ├── account/                      # User account preferences, security & profile screens
│   ├── authentication/               # Auth workflows (Magic links, password, MFA)
│   ├── books/                        # Book catalog repository, entities & mappers
│   ├── discovery/                    # Search documents, autocomplete & facet services
│   ├── library/                      # Personal shelves, reading progress & bookmarks
│   ├── reader/                       # Reader presentation components & toolbar
│   └── support/                      # Knowledge base & FAQ read models
├── shared/                           # Shared infrastructure & presentation utilities
│   ├── core/                         # Supabase clients, database types, and domain primitives
│   ├── layout/                       # AppHeader, Footer, and responsive wrappers
│   ├── providers/                    # Theme, auth, and state providers
│   └── ui/                           # Base UI atoms, animations, and modals
├── styles/                           # Global stylesheets & semantic theme tokens
│   ├── globals.css                   # Tailwind entry & utility definitions
│   └── themes/                       # light.css & dark.css variables
└── supabase/                         # Database schema & versioned migrations
    └── migrations/                   # Sequential version-controlled migrations
```

---

## Getting Started

### Prerequisites

- Node.js 18.17.0 or higher
- npm 9 or higher
- A configured Supabase project (PostgreSQL 15+)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Ganeshkatam/tomesphere.git
   cd tomesphere
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

4. Run database migrations:
   Apply migrations through the Supabase CLI or management dashboard.

5. Start the development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## Scripts

- `npm run dev`: Starts the Next.js development server with Turbopack.
- `npm run build`: Compiles and builds the production application.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint checks across the codebase.
- `npx tsc --noEmit`: Validates TypeScript type checking without emitting files.

---

## License

This project is licensed under the MIT License.
