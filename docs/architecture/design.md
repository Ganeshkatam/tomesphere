\# Design Architecture

\## Purpose

This document defines TomeSphere's visual language, interaction principles, layout system, and design conventions.

It serves as the single source of truth for product design decisions. Individual features should follow these principles instead of inventing new UI patterns.

\---

\# Design Philosophy

TomeSphere is a \*\*reading-first educational platform\*\*.

Every interface should help users:

1\. Discover books.

2\. Read comfortably.

3\. Learn effectively.

4\. Track personal progress.

The interface should feel like an application, not a marketing website or business dashboard.

\---

\# Core Principles

\## Reading Comes First

Reading is the primary experience.

Every other feature exists to support reading.

```

Books

&#x20;   ↓

Reader

&#x20;   ↓

Learning

&#x20;   ↓

Knowledge

```

\---

\## Calm Interfaces

Avoid unnecessary visual noise.

Prefer:

\- whitespace

\- typography

\- spacing

\- hierarchy

instead of decorative elements.

\---

\## Personalization

After sign in, TomeSphere becomes a personalized environment.

The application should surface:

\- Continue Reading

\- Learning progress

\- Recommendations

\- Personal collections

instead of generic content.

\---

\## Progressive Disclosure

Only show complexity when needed.

Example:

Learning

↓

Flashcards

↓

Review Queue

↓

Statistics

Users should never feel overwhelmed.

\---

\# Information Architecture

\## Public

```

Landing



Explore



Book Details



Authentication

```

\---

\## Reading

```

Home



Library



Reader



Search



Books

```

\---

\## Personal Center

```

Today



Reading



Learning



Collections



Progress



Inbox



Profile



Preferences



Security

```

\---

\# Navigation

Primary navigation is intentionally minimal.

```

🏠 Home



🔍 Discover



📚 Library



👤 Me

```

The Reader is entered contextually and is not part of the global navigation.

\---

\# Layout System

TomeSphere uses reusable layout primitives.

```

Container



Page



Stack



Cluster



Grid



Sidebar



Rail

```

Feature-specific layouts should compose these primitives rather than introducing new ones.

\---

\# Visual Hierarchy

Every page follows the same hierarchy.

```

Page Title



↓



Primary Action



↓



Primary Content



↓



Secondary Content



↓



Supporting Information

```

Avoid competing focal points.

\---

\# Cards

Cards represent content, not decoration.

Every card should answer one question.

Examples:

Book Card

Continue Reading Card

Learning Card

Collection Card

Achievement Card

Avoid cards containing unrelated information.

\---

\# Surface System

Surfaces use semantic tokens.

```

Surface Canvas



↓



Surface Default



↓



Surface Raised



↓



Surface Floating

```

Components must never reference raw colors.

\---

\# Typography

Fonts

\- Outfit

\- Inter

\- JetBrains Mono

Hierarchy

```

Display



↓



Heading



↓



Title



↓



Body



↓



Caption

```

Typography provides hierarchy before color.

\---

\# Color System

Foundation

↓

Semantic Tokens

↓

Components

Components must consume semantic variables only.

Example

```

\--surface-default



\--text-primary



\--border-default



\--shadow-card

```

Never hardcode palette values.

\---

\# Motion

Motion communicates state.

Allowed

\- hover

\- focus

\- loading

\- transitions

Avoid decorative animations.

All animations must respect reduced-motion preferences.

\---

\# Icons

Icons communicate actions.

Do not rely on icons alone.

Every important action should include text.

Use a single icon library throughout the application.

\---

\# Home

The authenticated Home screen answers:

1\. What should I read now?

2\. What should I learn today?

3\. Where did I stop?

4\. What should I explore next?

\---

\# Reader

The Reader is distraction-free.

Priorities:

1\. Content

2\. Navigation

3\. Annotation

4\. Settings

Everything else is secondary.

\---

\# Learning

Learning tools extend reading.

Examples:

Notes

Flashcards

Vocabulary

Practice Tests

Citations

Learning should always be contextual to books whenever possible.

\---

\# Personal Center

The Personal Center is the user's private space.

Sections

```

Today



Reading



Learning



Collections



Progress



Inbox



Profile



Preferences



Security

```

This is not an analytics dashboard.

It is a personalized control center.

\---

\# Accessibility

Minimum contrast requirements.

Keyboard navigation.

Visible focus indicators.

Screen-reader support.

Reduced-motion support.

Semantic HTML.

Accessible forms.

\---

\# Responsive Design

Desktop

Persistent sidebar.

Tablet

Collapsible sidebar.

Mobile

Bottom navigation + drawers.

Layouts should adapt without changing workflows.

\---

\# Performance

Prioritize:

\- Server Components

\- Optimized images

\- Local fonts

\- Streaming

\- Progressive loading

Avoid blocking rendering.

\---

\# Consistency Rules

Always reuse existing:

\- layouts

\- cards

\- buttons

\- dialogs

\- navigation patterns

Do not introduce new visual patterns without updating this document.

\---

\# Design Governance

Any new component must answer:

\- Can an existing component be reused?

\- Does it follow semantic tokens?

\- Does it fit TomeSphere's reading-first philosophy?

\- Does it maintain accessibility?

\- Does it work in both themes?

If the answer is no, the design should be reconsidered before implementation.
