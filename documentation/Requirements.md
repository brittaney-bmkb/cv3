# Requirements

## Functional Requirements
1. **Search & Discovery**
   - Users can search by parcel PIN or street address using ArcGIS search sources.
   - Search results should update map selection and open relevant panels.

2. **Map Interaction**
   - Users can click parcels on the map to select, highlight, and view details.
   - Selection should support primary parcels, comparable parcels, and nearby parcels.

3. **Panels & Details**
   - Provide information panels for property details, search results, and comparisons.
   - Panels should support responsive layouts for mobile and desktop.

4. **Printing & Export**
   - Users can generate printable maps and export data for selected parcels.

5. **Feedback & Help**
   - Provide in-app feedback and help workflows that are accessible across devices.

6. **Translations**
   - User-facing text must be translated for supported languages (currently English and Spanish).

## Non-Functional Requirements
1. **Performance**
   - Map initialization should be performant on typical broadband connections.
   - Planned improvement: replace WebMap ID loading with programmatic map creation to reduce load time and unneeded layer payloads.

2. **Accessibility (ADA / WCAG 2.1 AA)**
   - All interactive elements must be keyboard reachable with visible focus states.
   - Non-text content (icons, map elements) must have accessible names or alternatives.
   - Dialogs and panels must manage focus and provide clear labels for screen readers.
   - Color contrast must meet WCAG 2.1 AA minimums for text and UI components.

3. **Internationalization**
   - Migrate to a structured i18n solution (e.g., i18next) to support scalable translations and pluralization.
   - Ensure dynamic content (map messages, notifications, errors) is localized.

4. **Reliability**
   - App should handle service outages gracefully with user-friendly messaging.

5. **Security & Privacy**
   - External service URLs should be configurable and not hard-coded in logic.
   - Avoid logging or exposing sensitive user input beyond what is required for search.
