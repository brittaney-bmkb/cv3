# Unit Tests

## Overview
The unit test suite focuses on **application requirements and architecture contracts** that should always be true:
- Core configuration values exist for map, search, and translation services.
- App state updates correctly when key reducer actions are dispatched.

These tests are intentionally lightweight and fast so they can run on every commit. Some checks read source files as plain text to avoid loading ArcGIS modules in a Node-only test environment.

## How to Run
```bash
npm test
```

Watch mode (local development):
```bash
npm run test:watch
```

## Test Structure
```
src/__tests__/
  appReducer.test.js
  config.test.js
```

## What Each Test Covers

### `appReducer.test.js`
- **Action handler presence** for panel, search, and language actions in the reducer.
- **Unknown action safety** via the default error branch.

These cover key UI requirements (panel visibility, search behavior, localization) by ensuring the reducer supports the required actions.

### `config.test.js`
- **Map and layer config** must include `webmap_id`, `target_layer_url`, and `target_layer_id_field`.
- **Translation services** must include both English and Spanish with service URLs.
- **Search locators** must be defined.

These checks protect against broken deployments caused by missing configuration.

## Notes for Junior Developers
- We stub `localStorage` in the reducer tests because the reducer reads from it during module import.
- When you add new critical features, consider adding a new reducer test or config contract test to keep the suite meaningful.
