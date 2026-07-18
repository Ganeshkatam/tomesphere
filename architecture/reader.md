# Reader Architecture

## Purpose

This document defines the architecture of TomeSphere's Reader.

The Reader is the core experience of the platform. Every supporting feature—including notes, highlights, vocabulary, reading progress, citations, and learning tools—extends the Reader rather than replacing it.

The Reader must remain fast, distraction-free, extensible, and independent of learning-specific functionality.

---

# Reader Philosophy

The Reader exists for one purpose:

> Help users read comfortably while enabling learning without interrupting the reading flow.

Reading always takes priority.

Everything else is secondary.

---

# Design Principles

The Reader should be:

- immersive
- responsive
- distraction-free
- offline-friendly
- keyboard accessible
- extensible

Avoid turning the Reader into a dashboard.

---

# Architecture

```
Book

↓

Reader Engine

↓

Reading Session

↓

Extensions

↓

Learning Systems
```

Learning features should plug into the Reader instead of being embedded inside it.

---

# Responsibilities

The Reader owns:

- rendering book content
- pagination
- scrolling
- reading progress
- bookmarks
- highlights
- annotations
- navigation
- reading preferences

The Reader does **not** own:

- notes management
- flashcards
- vocabulary lists
- citations
- achievements

Those belong to their respective domains.

---

# Reader Pipeline

```
Book

↓

Parser

↓

Normalized Document

↓

Renderer

↓

Reader UI

↓

User Interaction
```

Every supported file format should produce the same normalized document structure.

---

# Supported Formats

Current

- PDF
- EPUB

Future

- HTML
- Markdown
- TXT

New formats should implement the parser contract rather than modifying the renderer.

---

# Parser Layer

Every parser returns a common document model.

Example

```
Document

↓

Pages

↓

Blocks

↓

Inline Elements
```

The renderer should never know the original file format.

---

# Rendering Engine

Responsibilities

- page rendering
- virtual scrolling
- lazy loading
- image loading
- text selection

Rendering should be independent from business logic.

---

# Reading Session

A session tracks:

- current position
- total progress
- last opened
- active duration

The session is persisted independently from the renderer.

---

# Reading Progress

Progress updates should be:

- incremental
- throttled
- resilient

Avoid writing to the database on every scroll event.

Example

```
Reader

↓

Progress Buffer

↓

Server Action

↓

Database
```

---

# Navigation

Reader navigation includes:

- table of contents
- page navigation
- chapter navigation
- search within book

Navigation state should survive page refreshes.

---

# Bookmarks

Bookmarks belong to Reading.

Each bookmark stores:

- book
- location
- optional label
- created time

Bookmarks should never depend on annotations.

---

# Highlights

Highlights represent text ranges.

They store:

- document reference
- start position
- end position
- color
- created time

Highlights remain lightweight.

---

# Annotations

Annotations extend highlights.

They may contain:

- note
- tags
- references

Annotations should reference highlights rather than duplicate text.

---

# Selection Pipeline

```
Text Selection

↓

Highlight

↓

Optional Annotation

↓

Optional Learning Action
```

The same selection should support multiple workflows.

---

# Learning Integration

Learning tools consume Reader data.

Examples

Highlight

↓

Vocabulary

Highlight

↓

Flashcard

Highlight

↓

Note

Highlight

↓

Citation

The Reader never owns these systems.

---

# Reader Preferences

Reader-specific settings include:

- font size
- font family
- line height
- page width
- margins
- scrolling mode
- pagination
- theme
- brightness

Preferences belong under:

```
/me/preferences/reader
```

---

# Offline Support

The Reader should continue functioning when offline.

Requirements

- cached books
- cached progress
- queued updates

Synchronization occurs once connectivity returns.

---

# Performance

Requirements

- virtual rendering
- lazy images
- incremental progress updates
- minimal re-renders

Avoid rendering entire books into the DOM.

---

# Accessibility

Requirements

- keyboard navigation
- adjustable typography
- screen reader support
- reduced motion
- high contrast themes

Reading comfort is the primary accessibility goal.

---

# Security

Protected books require:

- authenticated user
- authorization checks
- secure storage URLs

Reader state should never expose protected resources.

---

# Future Extensions

The Reader should support additional capabilities without architectural changes.

Examples

- AI summaries
- AI explanations
- AI translation
- dictionary lookup
- pronunciation
- collaborative annotations

These are extensions—not core reader responsibilities.

---

# Dependency Rules

The Reader may depend on:

- Books
- Shared UI
- Platform

Learning modules may depend on the Reader.

The Reader must never depend on Learning.

Allowed

```
Books

↓

Reader

↓

Learning
```

Not allowed

```
Reader

↓

Flashcards

↓

Notes

↓

Vocabulary
```

---

# Engineering Standards

Always

- separate parsing from rendering
- normalize document structures
- throttle progress updates
- isolate reader state
- keep the UI distraction-free

Never

- mix learning logic into the renderer
- write progress on every scroll
- expose file-format-specific rendering logic
- tightly couple parser and renderer

---

# Reader Review Checklist

Before implementing a Reader feature, verify:

- Does it improve the reading experience?
- Can it be implemented as an extension?
- Does it keep the renderer format-agnostic?
- Does it preserve reading performance?
- Does it work offline?
- Does it respect accessibility?
- Does it avoid coupling to learning modules?
- Is progress synchronization efficient?