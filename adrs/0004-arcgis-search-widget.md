# ADR 0004: ArcGIS Search widget for search workflow

## Status
Accepted

## Context
Search is a core workflow for users to locate parcels by address or PIN. The app needs a consistent, ArcGIS-native search experience.

## Decision
Use the ArcGIS `arcgis-search` web component with configuration-driven locator and layer sources.

## Consequences
- Search behavior is aligned with ArcGIS services and search sources.
- Search UI can be updated by changing config or search source initialization logic.

## References
- `documentation/Requirements.md`
- `src/components/SearchBar/SearchBarComponent.jsx`
- `src/data/config.js`
