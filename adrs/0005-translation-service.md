# ADR 0005: Translation services + translateText helper

## Status
Accepted

## Context
The app supports multiple languages (English/Spanish) and pulls translation strings from ArcGIS-hosted tables. UI components call `translateText` to render localized labels.

## Decision
Use translation services defined in configuration and a shared helper function to resolve text in UI components.

## Consequences
- Translations can be updated without redeploying the app.
- The translation system can later be replaced or augmented with i18next.

## References
- `documentation/Requirements.md`
- `documentation/CodeReview.md`
- `src/data/config.js`
- `src/contexts/AppContext.jsx`
