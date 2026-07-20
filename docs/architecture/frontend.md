# Frontend Architecture

## Purpose

This document defines the frontend architecture of TomeSphere.

It establishes rendering boundaries, module organization, component responsibilities, styling rules, state management, and frontend engineering standards.

---

# Technology Stack

Framework

- Next.js App Router

Language

- TypeScript

Styling

- Tailwind CSS
- CSS Modules
- Native CSS Cascade Layers

UI Primitives

- modules/shared/ui

Icons

- Lucide React

Database

- Supabase

Deployment

- Vercel

---

# Frontend Philosophy

The frontend follows three principles:

1. Server-first rendering.
2. Domain-driven organization.
3. Component composition over duplication.

Rendering logic, styling, and business domains remain clearly separated.

---

# Directory Structure

```
app/
modules/
styles/
public/
architecture/
```

Responsibilities:

```
app/
```

Routing.

```
modules/
```

Business domains.

```
styles/
```

Design language.

```
public/
```

Static assets.

```
architecture/
```

Documentation.

---

# Domain Architecture

```
modules/

reading/

learning/

platform/

shared/
```

Reading is the primary domain.

Learning builds on Reading.

Platform provides infrastructure.

Shared contains reusable code.

Dependencies:

```
Shared

↓

Platform

↓

Reading

↓

Learning
```

No cyclic dependencies are allowed.

---

# App Router

The App Router is intentionally thin.

Responsibilities:

- routing
- layouts
- metadata
- redirects
- loading
- error boundaries

Business logic belongs inside modules.

Example:

```
app/books/[id]/page.tsx

↓

modules/reading/books/presentation/screens/BookDetailScreen.tsx
```

---

# Rendering Strategy

Default

Server Components

Use Client Components only when required.

Examples:

Server

- pages
- layouts
- data loading
- metadata

Client

- forms
- dialogs
- dropdowns
- drag and drop
- browser APIs

---

# Route Layouts

```
Root Layout

↓

Workspace Layout

↓

Me Layout

↓

Reader Layout
```

Each layout owns only shared UI.

Individual pages fetch their own data.

---

# Personal Center

```
/me
```

acts as an integration layer.

It composes existing domains.

It is **not** its own business domain.

Example:

```
Reading

↓

Learning

↓

Platform

↓

Personal Center
```

---

# Component Architecture

Hierarchy

```
Shared UI

↓

Domain Components

↓

Screens

↓

Routes
```

Example

```
Button

↓

BookCard

↓

BookRail

↓

HomeScreen

↓

/home
```

---

# Shared UI

Location

```
modules/shared/ui/
```

Contains reusable primitives.

Examples

- Button
- Card
- Input
- Modal
- Dropdown
- Icon

Shared UI must never import domain modules.

---

# Feature Components

Feature components belong beside their domain.

Example

```
modules/

reading/

books/

BookCard

BookDetail

BookRail
```

Avoid generic folders like

```
components/
```

inside the project root.

---

# State Management

Priority

1. URL
2. Server
3. Local Component State
4. Context

Avoid global state unless necessary.

Examples

URL

- search
- filters
- pagination

Server

- books
- notes
- profile

Context

- theme
- authentication

Component State

- dialog visibility
- form input
- hover

---

# Data Fetching

Server Components fetch data by default.

Example

```
Page

↓

Server Action

↓

Supabase

↓

Component
```

Avoid client-side fetching unless interaction requires it.

---

# Server Actions

Business operations use Server Actions.

Responsibilities

- validation
- authorization
- database mutations

Client components should not perform database writes directly.

---

# Styling

Layers

```
Foundation

↓

Themes

↓

Base

↓

Layouts

↓

Utilities
```

Components use CSS Modules.

Tailwind is used for:

- layout
- spacing
- responsive behavior

CSS Modules are used for:

- appearance
- animations
- interactions

---

# Theme System

React controls:

- theme preference
- system detection

CSS controls:

- colors
- surfaces
- typography
- shadows

Components consume semantic variables only.

Never reference palette colors directly.

---

# Layout Primitives

Reusable compositions

- Container
- Page
- Grid
- Stack
- Cluster
- Sidebar
- Rail

Feature layouts compose these primitives.

---

# Navigation

Primary Navigation

```
🏠 Home

🔍 Discover

📚 Library

👤 Me
```

Reader navigation is contextual.

---

# Performance

Prioritize

- Server Components
- Streaming
- Route-level code splitting
- Optimized images
- Local fonts
- Partial hydration

Avoid unnecessary client bundles.

---

# Images

Use Next.js Image.

Requirements

- optimized
- responsive
- sizes attribute
- lazy loading where appropriate

---

# Fonts

Use

```
next/font
```

Only load required font weights.

---

# Error Handling

Each route should provide

- error.tsx
- loading.tsx

where appropriate.

Avoid global loading states.

---

# Accessibility

Requirements

- keyboard navigation
- focus visibility
- semantic HTML
- ARIA where needed
- reduced motion support

Accessibility is a baseline requirement.

---

# Testing

Frontend verification includes

- TypeScript
- ESLint
- Stylelint
- Production build
- Visual regression
- Lighthouse

---

# Engineering Rules

Always

- reuse shared UI
- reuse layout primitives
- use semantic tokens
- prefer Server Components
- colocate feature components
- respect module boundaries

Never

- hardcode colors
- create root-level feature folders
- bypass shared UI without justification
- introduce cross-domain imports
- duplicate existing components

---

# Architecture Review Checklist

Before adding a new feature, verify:

- Does it belong to an existing domain?
- Can an existing component be reused?
- Is the route thin?
- Is data fetched on the server?
- Does styling use semantic tokens?
- Are module boundaries respected?
- Is the component accessible?
- Is the feature responsive?
- Does it increase the client bundle unnecessarily?
