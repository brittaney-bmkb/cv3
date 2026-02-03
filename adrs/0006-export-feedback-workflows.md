# ADR 0006: Export and feedback workflows in layout

## Status
Accepted

## Context
Users need to export parcel data and submit feedback directly from the app. These workflows must be accessible from the primary layout without losing map context.

## Decision
Render `Export` and `Feedback` components at the layout level so they can be triggered from anywhere in the UI.

## Consequences
- Export/feedback dialogs are always available.
- Layout remains the central orchestration point for cross-cutting workflows.

## References
- `documentation/Requirements.md`
- `src/Layout.jsx`
