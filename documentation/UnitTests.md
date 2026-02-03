# Unit Tests

## Overview
The unit test suite focuses on **application requirements and architecture contracts** that should always be true:
- Core configuration values exist for map, search, and translation services.
- Core workflows are wired in the layout and feature components (search, map selection, panels, export, translations).

These tests are intentionally lightweight and fast so they can run on every commit. Some checks read source files as plain text to avoid loading ArcGIS modules in a Node-only test environment.

## How to Run
```bash
npm test
```

Watch mode (local development):
```bash
npm run test:watch
```

## CI
The PR workflow runs `npm test` against the `working` branch to catch issues before merge.

## Test Structure
```
tests/
  export-feedback-workflow.test.js
  map-selection-workflow.test.js
  panel-layout-workflow.test.js
  search-workflow.test.js
  translation-workflow.test.js
```

## What Each Test Covers

### `search-workflow.test.js`
- Ensures the header renders the search bar.
- Confirms the ArcGIS search element and completion handler are present.
- Validates locator sources exist in configuration.

### `map-selection-workflow.test.js`
- Confirms the map component registers click handling for parcel selection.
- Ensures the WebMap ID hook-up exists (current behavior before the planned migration).

### `panel-layout-workflow.test.js`
- Verifies the Calcite shell panels render in the layout.
- Confirms the main panel components are included.

### `export-feedback-workflow.test.js`
- Validates the export and feedback components are wired into the layout.

### `translation-workflow.test.js`
- Checks that `translateText` is used in UI components.
- Confirms translation service configuration keys exist.

## Notes for Junior Developers
- These tests intentionally avoid importing ArcGIS browser-only modules by scanning files as text.
- When you add new workflows, create a dedicated test file that asserts the wiring for that feature.
