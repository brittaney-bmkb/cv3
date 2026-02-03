# ADR 0001: Context-based state management

## Status
Accepted

## Context
CookViewer needs shared state for map interactions, search results, panel visibility, and translations. The app centralizes this state in `AppContext` to avoid excessive prop drilling and to keep feature panels synchronized.

## Decision
Use React Context (`AppProvider`) as the primary state container for application-wide state and actions.

## Consequences
- Shared state becomes easily accessible across the layout, map, and panel components.
- Context remains the central integration point for new workflows.

## References
- `documentation/Architecture.md`
- `src/contexts/AppContext.jsx`
