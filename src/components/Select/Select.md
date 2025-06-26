# Select.jsx Component Documentation

## Overview

The `Select` component is CookViewer’s parcel-selection interface. It renders an ArcGIS Sketch widget for drawing or clicking to select parcels on the map, manages sketch graphics, displays contextual help, and synchronizes everything with the global `AppContext`. It leverages the [ArcGIS Maps SDK for JavaScript](https://developers.arcgis.com/javascript/) via the `<arcgis-sketch>` web component and uses Esri’s Core APIs for geometry operations.

---

## Key Responsibilities

- **Rendering the Sketch Widget** (`<arcgis-sketch>`) within a `CalcitePanel`.  
- **Managing GraphicsLayer** for sketch graphics and clearing or resetting it as needed.  
- **Handling User Interactions** for “cursor,” “rectangle,” and “polygon” selection tools.  
- **Executing Spatial Queries** by unioning drawn geometries and calling `queryPolygon`.  
- **Toggling Panels** (`search` or `property`) based on query results.  
- **Displaying Contextual Help** via `CalciteNotice`, updating dynamically per tool.  
- **Localization** of all UI text through `translateText`.

---

## Integration with AppContext

```jsx
const {
  arcgisMapRef,               // Ref to <arcgis-map> instance
  selectPanelClosed,          // Boolean: is the Select panel closed?
  setSelectPanel,             // Function to open/close the Select panel
  translateText,              // (key) => localized string
  queryPolygon,               // (geometry, refresh) => Promise<features>
  clearResults,               // () => void, clears search results
  propertyDetailPanelClosed,  // Boolean: is the property detail panel closed?
  togglePanel,                // (panelName) => void, opens “search” or “property”
} = UseAppContext();
```

- **Refs:** `arcgisMapRef` supplies the map for adding layers and anchoring the sketch widget.  
- **Panel Control:** `selectPanelClosed` & `setSelectPanel` manage panel visibility and trigger resets.  
- **Spatial Logic:** `queryPolygon` runs parcel queries; `togglePanel` chooses which downstream panel to show.  
- **Localization:** `translateText` wraps every user-facing string.

---

## Imports & Dependencies

```tsx
import "@arcgis/map-components/components/arcgis-sketch";
import {
  CalciteAction,
  CalciteBlock,
  CalciteButton,
  CalciteNotice,
  CalcitePanel
} from "@esri/calcite-components-react";

import { useEffect, useRef, useState } from "react";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import * as unionOperator from "@arcgis/core/geometry/operators/unionOperator.js";

import UseAppContext from "../../contexts/AppContext";
import { config } from "../../data/config";
```

---

## Main Functional Sections

### 1. State and References

- **Refs:**  
  - `sketchRef`: `<arcgis-sketch>` DOM reference for calling `.cancel()`.  
  - `graphicsLayer`: Holds the `GraphicsLayer` instance added to the map.  
  - `selectedFeatures`: Temporary storage for drawn geometries (unused currently).  
- **State:**  
  - `activeTool`: `"polygon" | "rectangle" | "cursor" | null` – current sketch tool.  
  - `title`, `message`: Strings for the help notice, updated per `activeTool`.

### 2. Sketch Initialization & Layer Setup

- **GraphicsLayer Creation:** On mount, when `arcgisMapRef.current.map` exists, instantiate a `GraphicsLayer` and add it to the map.  
- **Sketch Widget Attachment:** Render `<arcgis-sketch>` with that layer and the map reference, hiding unused tools via props.

### 3. Parcel Selection Workflow

- **Drawing Completion:**  
  - `onarcgisCreate` listens for `detail.state === "complete"` and calls `handleSelection()`.  
- **handleSelection():**  
  ```ts
  const geometries = graphicsLayer.current.graphics.map(g => g.geometry);
  const queryGeometry = unionOperator.executeMany(geometries.toArray());
  const features = await queryPolygon(queryGeometry, true);
  graphicsLayer.current.removeAll();
  togglePanel(
    propertyDetailPanelClosed && features.length === 1 ? "property" : "search"
  );
  ```

### 4. UI Widgets & Localization

- **CalcitePanel:** Container for the sketch UI; toggles open/closed via `selectPanelClosed`.  
- **CalciteAction (“help”):** Opens external help doc from `config`.  
- **CalciteBlock:** Holds the sketch widget and help notice.  
- **CalciteNotice:** Shows dynamic `title`/`message` based on the selected tool.  
- **CalciteButton (“Reset”):** Calls `handleReset()` to clear graphics and search results.

_All text is passed through `translateText` for internationalization._

### 5. Event Handlers

#### 5.1 onarcgisPropertyChange  
Sets `activeTool` when the sketch becomes active or ready:

```ts
if (e.target.state === "active") {
  setActiveTool(e.target.activeTool);
}
if (e.target.state === "ready" && !e.target.activeTool) {
  setActiveTool("cursor");
}
```

#### 5.2 onarcgisCreate  
Triggers `handleSelection()` on draw completion.

#### 5.3 Reset Button  
```ts
const handleReset = () => {
  graphicsLayer.current?.removeAll();
  clearResults();
};
```

### 6. Effect Hooks

- **GraphicsLayer Init:** Adds the layer when `arcgisMapRef` is ready.  
- **Reset on Panel Close:** Cancels sketch and clears `selectedFeatures` when `selectPanelClosed` changes to `true`.  
- **Help Text Updates:** Calls `getSelectionTip(activeTool)` on every change to update the help notice.

### 7. Accessibility & Responsiveness

- **Keyboard Navigation:** Calcite components are keyboard-friendly; ensure focus order.  
- **ARIA Labels:** Confirm or add `aria-label` on `<arcgis-sketch>` for screen readers.  
- **Contrast:** Check WCAG 2.1 AA color ratios for notices and buttons.

---

## Rendering Structure

```jsx
<CalcitePanel
  closed={selectPanelClosed}
  closable
  heading={translateText("Select")}
  onCalcitePanelClose={() => setSelectPanel(true)}
  style={{ display: selectPanelClosed ? "none" : "flex" }}
>
  <CalciteAction …/>           {/* Help */}
  <CalciteBlock …>             {/* Sketch + Notice */}
    <arcgis-sketch …/>        
    <CalciteNotice …/>         
  </CalciteBlock>
  <CalciteButton …>Reset</CalciteButton>
</CalcitePanel>
```

---

## Key Points for Developers

- **Panel Lifecycle:** Closing hides the panel and cancels active sketches.  
- **Tool Management:** Only polygon, rectangle, and cursor tools; others are hidden.  
- **Context Reliance:** No props; all data and callbacks via `UseAppContext`.  
- **Help Messaging:** Centralized in `getSelectionTip()` for easy updates.

---

## Extending or Modifying

- **Add Lasso Tool:** Remove `hideSelectionToolsLassoSelection` prop and handle `activeTool === "lasso"`.  
- **Debounce Queries:** Wrap `handleSelection` in a debounce.  
- **Externalize Tooltips:** Move strings from `getSelectionTip()` into translation files.

---

## Troubleshooting

- **Layer Not Added:** Verify `arcgisMapRef.current.map` is set before the init effect runs.  
- **No Results:** Inspect union geometry and API calls in DevTools.  
- **Notice Not Updating:** Check `onarcgisPropertyChange` events.  

---

## Could Be Better

- **Remove Unused Refs:** Drop `selectedFeatures` or use it for multi-stage workflows.  
- **Error Handling:** Wrap `queryPolygon` in `try/catch`, show errors in `CalciteNotice`.  
- **Performance:** Clear only the latest sketch graphic instead of all.  
- **Accessibility:** Ensure `<arcgis-sketch>` exposes proper ARIA roles.