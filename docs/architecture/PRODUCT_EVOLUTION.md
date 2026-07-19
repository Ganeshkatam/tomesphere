# TomeSphere Product Evolution Model

## Status

**Document Type:** Product Evolution Model
**Version:** 1.0
**Scope:** Product Planning & Architectural Roadmap

---

# Vision

TomeSphere is an **education-first reading and learning platform**.

Its primary purpose is to help learners transform reading into structured knowledge, academic work, and effective study.

The product is intentionally **not** a social network. Any future collaboration features must directly support learning outcomes rather than social engagement.

---

# Core Product Principles

1. Education before entertainment.
2. Reading is the foundation of every workflow.
3. Knowledge should be reusable across books and subjects.
4. Every capability has a single canonical implementation.
5. AI augments learning rather than replacing it.
6. Collaboration exists only when it improves education.
7. Minimize product complexity while maximizing learning value.

---

# Product Evolution

> **NOTE:** For the canonical definition of exactly what code ships in Version 1.0, please see [`docs/LAUNCH_SCOPE.md`](file:///d:/websites/tomesphere-app/docs/LAUNCH_SCOPE.md).

## Version 1.0 — Reader Foundation (ACTIVE)

### Objective

Deliver an excellent digital reading experience.

### Core Domains

- Reader
- Library
- Book
- Reading Session
- Highlights
- Notes (basic)
- Bookmarks
- Account
- Analytics Foundation

### Features

#### Reader

- EPUB Reader
- Resume Reading
- Reading Position
- Themes
- Typography Controls
- Search Within Book

#### Annotation

- Highlights
- Inline Notes
- Bookmarks
- Annotation Sidebar

#### Reading

- Reading Timer
- Reading Progress
- Reading Sessions
- Reading History

#### Library

- Personal Library
- Recently Read
- Collections (basic)
- Import Books

#### Account

- Profile
- Security
- Preferences

#### Analytics Foundation

- Reading Time
- Books Finished
- Reading Streak
- Progress Tracking

### Excluded

- Global Notes
- Citations
- Academic Writing
- Exam Preparation
- AI
- Social Features

---

## Version 1.5 — Product Consolidation

### Objective

Stabilize the product before expanding functionality.

### Focus Areas

- Architecture Governance
- Capability Audits
- Duplicate Removal
- Canonical Routes
- UI Consolidation
- Legacy Removal

### Deliverables

- Architecture Frozen
- Governance Process
- Decision Records
- Canonical Navigation
- Reader Cleanup

### Decision Records

- DR-001 Dashboard
- DR-002 Analytics
- DR-003 Profile
- DR-004 Notes
- DR-005 Citations
- DR-006 Academic
- DR-007 Exam Prep
- DR-008 Reader Legacy

---

## Version 2.0 — Knowledge Workspace (PLANNED)

_(Code preserved in `modules/learning` but disconnected from v1 active routes)_

### Objective

Transform reading into structured knowledge.

### New Domains

- Knowledge
- Notes
- Citations
- Research
- Academic Writing

### Features

#### Notes

- Global Notes
- Cross-Book Notes
- Rich Text
- Markdown
- Tags
- Search
- Pinning
- Organization

#### Knowledge

- Knowledge Collections
- Linked Notes
- Concepts
- References

#### Citations

- Citation Manager
- Citation Generator
- Multiple Citation Styles
- Bibliography
- Export

#### Academic

- Research Workspace
- Writing Workspace
- Sources
- References
- Reading Lists

#### Export

- Markdown
- PDF
- DOCX
- Bibliography Export

### Dependencies

Requires Version 1.x completion.

---

## Version 3.0 — Study Platform (PLANNED)

_(Code preserved in `modules/study` and `modules/planner` but disconnected from v1 active routes)_

### Objective

Support structured learning and revision.

### New Domains

- Study
- Revision
- Assessment

### Features

#### Flashcards

- Manual Flashcards
- Flashcards from Notes
- Flashcards from Highlights

#### Revision

- Spaced Repetition
- Revision Planner
- Review Queue
- Weak Topics

#### Exams

- Exam Preparation
- Practice Questions
- Mock Tests
- Progress Tracking

#### Learning

- Subjects
- Courses
- Study Goals
- Learning Plans

### Dependencies

Requires Version 2.0.

---

## Version 4.0 — Learning Intelligence

### Objective

Use AI to enhance learning.

### AI Capabilities

#### Reader

- Explain Passage
- Simplify Text
- Translate
- Definitions

#### Notes

- Summaries
- Note Refinement
- Concept Extraction
- Topic Detection

#### Study

- Quiz Generation
- Flashcard Generation
- Revision Suggestions
- Personalized Learning

#### Research

- Citation Assistance
- Literature Summaries
- Research Guidance

### AI Principles

- Human remains in control.
- AI-generated content is reviewable.
- AI never replaces primary sources.
- AI supports learning, not shortcuts.

---

## Version 5.0 — Education Collaboration (Optional)

### Objective

Enable collaborative learning.

### Features

- Shared Reading Groups
- Shared Notes
- Shared Annotations
- Classroom Workspaces
- Instructor Feedback
- Team Research
- Institutional Support

### Constraints

Collaboration must directly support educational workflows.

General-purpose social networking remains out of scope.

---

# Out of Scope

The following are intentionally excluded from the core product roadmap:

- Followers
- Following
- Public Social Profiles
- Activity Feed
- Likes
- Reactions
- Social Reputation Systems
- User Popularity Metrics
- General Messaging
- Social Discovery

---

# Domain Evolution

```
Version 1
Reader
├── Library
├── Highlights
├── Notes
├── Bookmarks
├── Sessions
└── Analytics

↓

Version 2
Knowledge
├── Global Notes
├── Citations
├── Research
└── Academic Writing

↓

Version 3
Study
├── Flashcards
├── Revision
├── Exams
└── Learning Plans

↓

Version 4
Learning Intelligence
├── AI Reader
├── AI Notes
├── AI Research
└── AI Study

↓

Version 5 (Optional)
Education Collaboration
├── Shared Workspaces
├── Classroom Support
├── Team Research
└── Collaborative Annotation
```

---

# Architectural Growth Strategy

| Version | Primary Focus            | New Bounded Contexts        |
| ------- | ------------------------ | --------------------------- |
| 1.0     | Reading                  | Reader, Library, Account    |
| 1.5     | Consolidation            | Governance                  |
| 2.0     | Knowledge                | Notes, Citations, Research  |
| 3.0     | Learning                 | Study, Revision, Assessment |
| 4.0     | Intelligence             | AI Services                 |
| 5.0     | Collaboration (Optional) | Classroom, Shared Learning  |

---

# Success Criteria

## Version 1

A user can read, annotate, organize books, and track reading progress.

## Version 2

A user can transform reading into reusable knowledge and academic resources.

## Version 3

A user can prepare effectively for learning objectives and examinations.

## Version 4

AI meaningfully improves comprehension, research, and study efficiency.

## Version 5

Multiple learners can collaborate without shifting the product toward a social network.

---

# Long-Term Product Identity

**TomeSphere is an integrated educational platform where reading becomes knowledge, knowledge becomes learning, and learning becomes mastery.**
