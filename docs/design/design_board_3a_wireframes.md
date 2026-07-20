# Phase 3A: Structural Wireframes

> **RULE:** No colors. No typography choices. No shadows. No icons. Only hierarchy and bounding boxes.

This board establishes the structural blueprints for the core screens. We are defining the skeletal hierarchy of content.

## 1. Landing Page (Marketing)

```text
+-------------------------------------------------------------+
|  [Logo]                                [Discover] [Sign In] |
+-------------------------------------------------------------+
|                                                             |
|                          [H1: Hero Title]                   |
|                      [Subhead: Value Prop]                  |
|                      [Primary CTA: Start]                   |
|                                                             |
|                      [Search Bar Input]                     |
|                                                             |
|  +-------------------------------------------------------+  |
|  |                [Hero Image / Graphic]                 |  |
|  +-------------------------------------------------------+  |
|                                                             |
+-------------------------------------------------------------+
|  [H2: Trending Now]                               [View All]|
|  +----+ +----+ +----+ +----+ +----+ +----+                  |
|  |Book| |Book| |Book| |Book| |Book| |Book|                  |
|  +----+ +----+ +----+ +----+ +----+ +----+                  |
+-------------------------------------------------------------+
```

## 2. Discovery Overview Page

```text
+-------------------------------------------------------------+
|  [Logo]              [ Global Search Bar ]        [Profile] |
+-------------------------------------------------------------+
|             |                                               |
| [Nav]       |  [H1: Discover]                               |
| - Overview  |  [Subtitle]                                   |
| - Featured  |                                               |
| - Trending  |  [H2: Trending Books]             [View All]  |
| - New       |  +----+ +----+ +----+ +----+ +----+           |
| - Authors   |  |Book| |Book| |Book| |Book| |Book|           |
| - Colls     |  +----+ +----+ +----+ +----+ +----+           |
|             |                                               |
|             |  [H2: Curated Collections]        [View All]  |
|             |  +----------+ +----------+ +----------+       |
|             |  |Collection| |Collection| |Collection|       |
|             |  +----------+ +----------+ +----------+       |
+-------------------------------------------------------------+
```

## 3. Book Detail Page

```text
+-------------------------------------------------------------+
|  [Logo]              [ Global Search Bar ]        [Profile] |
+-------------------------------------------------------------+
|             |                                               |
| [Nav]       |  +---------+  [H1: Book Title]                |
| - Overview  |  |         |  [Author Name]                   |
| - Featured  |  |  Cover  |                                  |
| - Trending  |  |         |  [Primary CTA: Read]             |
| - New       |  |         |  [Secondary CTA: Add to Lib]     |
| - Authors   |  |         |                                  |
| - Colls     |  +---------+  [Metadata: 320pp • Fantasy]     |
|             |                                               |
|             |  [H3: Description]                            |
|             |  [Paragraphs of description...]               |
|             |                                               |
|             |  [H3: Subjects]                               |
|             |  [Tag] [Tag] [Tag] [Tag]                      |
+-------------------------------------------------------------+
```

## 4. Workspace Dashboard (Home)

```text
+-------------------------------------------------------------+
|  [Logo]              [ Global Search Bar ]   [🔔] [Profile] |
+-------------------------------------------------------------+
|             |                                               |
| [Nav]       |  [H1: Welcome back, {Name}]                   |
| - Home      |                                               |
| - Library   |  [H2: Continue Reading]                       |
| - Account   |  +---------------------------------------+    |
|             |  | [Cover] [Title] [Progress Bar] [Read] |    |
|             |  +---------------------------------------+    |
|             |                                               |
|             |  [H2: Recently Added to Library]  [View All]  |
|             |  +----+ +----+ +----+ +----+ +----+           |
|             |  |Book| |Book| |Book| |Book| |Book|           |
|             |  +----+ +----+ +----+ +----+ +----+           |
+-------------------------------------------------------------+
```

## 5. Immersive Reader

```text
+-------------------------------------------------------------+
|  < Back   [TOC]                                 [Settings]  |
+-------------------------------------------------------------+
|                                                             |
|                                                             |
|                     [H2: Chapter 1]                         |
|                                                             |
|                     [Paragraph Text]                        |
|                     [Paragraph Text]                        |
|                     [Paragraph Text]                        |
|                                                             |
|                                                             |
|                                                             |
+-------------------------------------------------------------+
|                     [======      ] 32%                      |
+-------------------------------------------------------------+
```
