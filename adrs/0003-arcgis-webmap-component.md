# ADR 0003: ArcGIS map via WebMap ID (current)

## Status
Accepted (to be revisited)

## Context
The application needs a map surface with multiple layers and interactions. The current implementation loads a WebMap by ID using the `arcgis-map` web component. A planned change will move to programmatic map creation for performance.

## Decision
Load the map via `arcgis-map` with `item-id={config.webmap_id}` as the current default.

## Consequences
- Initial load time can be impacted by large WebMap payloads.
- The architecture preserves a path to switch to programmatic layer creation in the future.

## References
- `documentation/Architecture.md`
- `documentation/CodeReview.md`
- `src/components/Map/Map.jsx`
