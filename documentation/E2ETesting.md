# End-to-End (E2E) Testing Guide

This project uses a **hybrid approach**:
- **Node-based contract tests** validate wiring, hooks, and data handling quickly.
- **Browser E2E tests** validate real ArcGIS interactions (map, search, compare) in a full runtime environment.

## Why E2E for ArcGIS?
ArcGIS JS modules and map web components require a real browser with WebGL. E2E tests (Playwright/Cypress) allow us to validate map events, search completion, and panel transitions with minimal mocking.

## Recommended Structure
```
e2e/
  playwright/
    playwright.config.js
    tests/
      arcgis-workflows.spec.js
cypress/
  e2e/
    arcgis-workflows.cy.js
```

## Playwright Setup (Recommended)
1. Install dependencies:
   ```bash
   npm install -D @playwright/test
   npx playwright install
   ```
2. Run tests:
   ```bash
   npm run e2e:playwright
   ```

### Playwright Example Workflow
The Playwright example test automates the core flow:
1. Search for `105 W Brayton Chicago IL`.
2. Verify search results panel is visible.
3. Click a search result to open property details.
4. Click **Compare Properties** and open the comparison panel.
5. Run the comparison search and select a comparable result.

See: `e2e/playwright/tests/arcgis-workflows.spec.js`.

## Cypress Setup
1. Install dependencies:
   ```bash
   npm install -D cypress
   ```
2. Open the Cypress runner:
   ```bash
   npx cypress open
   ```
3. Run headless:
   ```bash
   npm run e2e:cypress
   ```

### Cypress Example Workflow
The Cypress test mirrors the Playwright flow using Cypress commands. It’s a good option if the team already uses Cypress in other projects.

See: `cypress/e2e/arcgis-workflows.cy.js`.

## Tips for Writing E2E Tests
- Prefer stable selectors (IDs like `#search-results-panel`, `#property-detail-panel`, `#comparable-panel`).
- ArcGIS web components expose methods (e.g., `arcgis-search.search(...)`) that can be triggered from the page context.
- Use explicit waits for panel visibility after actions (search completion, compare search).
- If map graphics are not easy to assert, validate related UI state (panel open, list item selected) as proxies.

## Node Contract Tests (Fast Guardrails)
Continue to use the existing `npm test` suite for fast checks of hooks, wiring, and data configuration. These tests are designed to run quickly in CI even when E2E tests are skipped.

See: `documentation/UnitTests.md` and the `tests/` directory.
