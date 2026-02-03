# ADR 0002: Calcite Shell layout with panelized UI

## Status
Accepted

## Context
The application requires persistent map display alongside multiple panels (search results, property details, tools). A consistent layout is needed across desktop and mobile.

## Decision
Use the Calcite `CalciteShell` and `CalciteShellPanel` components to structure left/right panels and the map surface.

## Consequences
- Responsive panel behavior is centralized in `Layout.jsx`.
- UI workflows can be composed by adding/removing panel components in the shell.

## References
- `documentation/Architecture.md`
- `src/Layout.jsx`
