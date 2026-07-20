# Phase 2B: Experience Principles

While Product Vision defines *what* TomeSphere is, Experience Principles define *how* it feels to use. These principles serve as a strict evaluation checklist for every screen and interaction we design. If a design violates these principles, it must be revised.

## 1. Respect the Reader's Focus
- **Rule**: Reading is never interrupted by unnecessary UI.
- **Application**: The immersive reader strips away all navigation. Alerts and notifications never pop up while a user is inside the reader unless they are critical system errors.

## 2. Predictable and Shallow Navigation
- **Rule**: Navigation should not feel like a maze. Users should always know exactly where they are.
- **Application**: The hierarchy is flat. We do not bury features four menus deep. The global layout shells (Discovery, Workspace) provide constant grounding.

## 3. The "Two-Interaction" Rule
- **Rule**: Every important action is reachable within two interactions.
- **Application**: A user should be able to resume their current book in 2 clicks from the homepage. A user should be able to start searching in 1 click from anywhere in the app.

## 4. Ubiquitous Search
- **Rule**: Search is always one interaction away.
- **Application**: The global search bar is persistently available in the header of both the Discovery and Workspace layouts.

## 5. Progressive Disclosure
- **Rule**: The interface reveals complexity progressively rather than all at once.
- **Application**: Advanced search filters are hidden behind a "Filters" toggle. Reading settings (font size, theme) are tucked in a menu that only appears when requested.

## 6. Instructive Empty States
- **Rule**: Empty states must teach rather than merely inform.
- **Application**: If a user's library is empty, we do not just say "No books found." We provide a button that says "Explore Trending Books" and explain how to add a book to the library.

## 7. Layout Stability
- **Rule**: Loading states must preserve layout stability. No layout shift.
- **Application**: We use skeletons that perfectly match the dimensions of the final content. A book grid skeleton takes up the exact same vertical space as the loaded book grid.

## 8. Purposeful Motion
- **Rule**: Motion communicates state change, not decoration.
- **Application**: We do not use bouncy, flashy animations. We use subtle fades (e.g., 150ms crossfades) to indicate data loading, and simple slide transitions to show a drawer opening. Animation exists to help the user understand what just happened.
