# Architecture Overview

## System Summary
CookViewer is a React-based parcel viewer that renders ArcGIS map content, exposes search and parcel comparison workflows, and layers in Calcite/MUI UI components for panels, dialogs, and actions. The application is composed of a top-level `AppProvider` context, a shell layout that orchestrates panels and map presentation, and feature modules (search, property details, comparison, print/export, etc.) rendered within the shell. The map itself is currently instantiated via an ArcGIS WebMap ID through the `arcgis-map` web component. A separate ArcGIS map construction utility exists for creating maps programmatically from config data. This separation is important for the planned transition away from large web maps to on-the-fly map creation for performance. The global configuration is centralized in `src/data/config.js` for portal services, map IDs, and feature/layer source definitions.

## Core Runtime Flow
1. `App.jsx` mounts the `AppProvider` and `Layout` component, establishing global state and top-level UI orchestration.
2. `Layout.jsx` renders a `CalciteShell`, left/right `CalciteShellPanel` containers, and the `Map` component, which holds the ArcGIS map component and map interactions.
3. `AppContext.jsx` provides state and dispatch functions to control panel visibility, search results, map references, and translation state.
4. `Map.jsx` uses the `arcgis-map` component with a `webmap_id` from config, registers view-ready handlers, and coordinates selection/highlight logic for parcels.

## Key Modules
- **Layout / Shell**: Shell layout and responsive panel toggling (`src/Layout.jsx`).
- **Map Module**: Map rendering, selection/highlight behavior, and graphics overlays (`src/components/Map/Map.jsx`).
- **State Management**: Application-level UI and data state via `useReducer` in `AppContext.jsx`.
- **Configuration**: Centralized map/service configuration in `src/data/config.js`.
- **ArcGIS Programmatic Map Builder**: Map and layer construction utilities that can replace WebMap usage (`src/arcgis/webmap/webmap.js`).

## Data Flow and State
- **User input** (search, selection) updates global state in `AppContext`.
- **Map selections** update search result and parcel highlight state, which is then reflected in UI panels and map overlay layers.
- **Panel visibility** is driven by `togglePanel` and related setter functions in `AppContext` and consumed by `Layout` to collapse/expand shell panels.

## External Services
The application relies on ArcGIS services defined in `config.js` for layer data, search sources, translations, and print templates. These external dependencies are resolved at runtime and are critical to map initialization and data presentation.

## Observability and Diagnostics
There is no centralized logging or telemetry surfaced in the current architecture. If operational diagnostics are needed, consider adding a lightweight logging wrapper or feature flag based instrumentation around map initialization, layer load failures, and translation fetches.
