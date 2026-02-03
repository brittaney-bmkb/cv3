# Code Review

## Scope
Front-end review of CookViewer with a focus on best practices, accessibility alignment with the ADA Title II web rule (2024-03-08 fact sheet summary), and readiness for planned changes (programmatic map creation and i18next migration).

## Summary
The application has a solid modular structure, a centralized configuration layer, and clear separation of map logic from UI panels. Key improvement areas include accessibility improvements for map and panel interactions, more robust translation loading, and state/effect correctness. Performance can be improved by migrating away from large WebMap references to on-the-fly map construction already scaffolded in the `arcgis/webmap` utilities.

## Strengths
- **Centralized configuration** simplifies environment changes and service updates (`src/data/config.js`).
- **Clear layout orchestration** with a responsive shell and panel management (`src/Layout.jsx`).
- **ArcGIS integration is encapsulated** and already includes a programmatic map builder, which supports the planned WebMap migration (`src/arcgis/webmap/webmap.js`).
- **Use of Calcite/MUI components** provides a strong baseline for consistent UI patterns and accessibility alignment.

## Findings & Recommendations

### High Priority
1. **WebMap dependency is a performance risk**
   - The map currently loads via WebMap ID using the `arcgis-map` component. This can load unnecessary layers and delay map render. Transitioning to programmatic map creation (using existing webmap utilities and layer configs) should reduce payload and improve startup time.
   - Evidence: Map is currently initialized with `item-id={config.webmap_id}` in `Map.jsx`, and the WebMap ID is defined in config. There is also a programmatic map builder in `arcgis/webmap/webmap.js`.
   - Recommendation: Replace `arcgis-map` WebMap usage with map creation from `createBaseMap` + `createFeatureLayers` (or a minimal version of `initializeMap`) using configuration-driven layer lists.

2. **Accessibility: Map element lacks an accessible name/description**
   - ADA Title II web rule (2024) requires public-sector digital services to meet WCAG 2.1 AA. Map widgets should be labeled and accessible to keyboard and assistive technologies. The `<arcgis-map>` element lacks `aria-label` or descriptive alternatives.
   - Evidence: `Map.jsx` renders `<arcgis-map ...>` without accessibility attributes.
   - Recommendation: Add `aria-label` or `aria-labelledby` and provide a text alternative or instructions for map interactions.

### Medium Priority
1. **Effect dependencies can lead to stale UI state**
   - `Layout.jsx` uses `isMobile` inside `useEffect` but does not include it in the dependency array. This can produce stale panel collapse behavior when responsive breakpoints change.
   - Evidence: `Layout.jsx` `useEffect` depends on panel state but references `isMobile` without listing it as a dependency.
   - Recommendation: Add `isMobile` to the dependency arrays so panel state updates correctly.

2. **Parcel highlight query builds an invalid IN clause**
   - The query string joins values with commas but wraps the entire string in a single pair of quotes, producing `IN ('a,b')` instead of `IN ('a','b')`.
   - Evidence: `Map.jsx` constructs `query.where = \`${config.target_layer_id_field} IN ('${pins.join(',')}')\``.
   - Recommendation: Use `pins.map(pin => `'${pin}'`).join(',')` or `pins.join("','")` to produce a valid IN list.

3. **Selection layer update has a set construction bug**
   - `incomingIds` is derived from `graphics.map(...)` but the callback does not return a value, producing a set of `undefined`. This breaks overlap detection for selection updates.
   - Evidence: `Map.jsx` defines `const incomingIds = new Set(graphics.map(g => { g.attributes.OBJECTID g.attributes[config.target_layer_id_field] }));` with no return statement.
   - Recommendation: Return the intended ID (`g.attributes.OBJECTID` or `g.attributes[config.target_layer_id_field]`) from the map callback.

4. **Translation loading relies on a placeholder string**
   - The translation loading state uses `translateText("test")` and a literal string check. This is fragile and can lead to incorrect loading/scrim behavior.
   - Evidence: `Layout.jsx` sets `const isTranslationsLoading = !translateText("test") || translateText("test") === "loading....";`.
   - Recommendation: Introduce explicit translation loading state in context or adopt i18next’s async loading state to make loading behavior deterministic.

### Low Priority
1. **Hard-coded strings in UI labels**
   - Some UI labels are hard-coded in components, which complicates translation and consistency with planned i18next migration.
   - Recommendation: Normalize all user-facing strings behind a translation key mapping.

## Accessibility Alignment Notes (ADA Title II Web Rule / WCAG 2.1 AA)
- Ensure all interactive controls are keyboard operable and have visible focus.
- Provide accessible names for map widgets and icon-only controls.
- Validate that dialogs and panel toggles announce state changes correctly to screen readers.
- Audit color contrast and ensure text meets WCAG 2.1 AA minimums.
- Provide alternative text and non-visual instruction paths for map interactions.

## Planned Changes & Review Considerations
- **Programmatic map creation**: existing map builder utilities provide a strong foundation; consider trimming config-driven layer lists to only necessary layers.
- **i18next migration**: move translation loading and language switching into a centralized i18n provider with async loading state to support additional languages and pluralization.

## Recommended Next Steps
1. Prioritize WebMap-to-programmatic map migration for faster load time and reduced payload.
2. Implement accessible labeling for the map component and verify keyboard navigation for all map actions.
3. Fix map selection query/selection update issues to avoid incorrect highlighting behavior.
4. Replace translation loading placeholders with explicit i18n loading state (ideally via i18next).
