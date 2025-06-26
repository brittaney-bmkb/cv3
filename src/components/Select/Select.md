# Select.jsx Component Documentation

## 1. Overview

The `Select` component is CookViewer’s primary parcel‐selection interface. It wraps the ArcGIS Sketch widget (`<arcgis-sketch>`) to let users click, draw rectangles, or draw polygons on the map, then queries parcels inside that geometry. It also displays contextual help, resets selections, and synchronizes everything with the global `AppContext`.

---

## 2. Integration with AppContext

```jsx
const {
  arcgisMapRef,               // Ref to the ArcGIS Map instance
  selectPanelClosed,          // Controls panel visibility
  setSelectPanel,             // Toggles the Select panel
  translateText,              // Localization helper
  queryPolygon,               // Executes parcel queries
  clearResults,               // Clears previous search results
  propertyDetailPanelClosed,  // Tracks detail panel state
  togglePanel,                // Opens “search” or “property” panel
} = UseAppContext();
```

- **Map Attachments**: `arcgisMapRef.current` → used to add `GraphicsLayer` and anchor `<arcgis-sketch>`.
- **UI Control**: `selectPanelClosed` & `setSelectPanel` manage panel open/close and trigger resets.
- **Spatial Logic**: `queryPolygon` + `togglePanel` implement the parcel search → result-panel pipeline.
- **Localization**: `translateText` wraps all UI strings for i18n.

---

## 3. Imports & Dependencies

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

- **ArcGIS Sketch**: Web component for map drawing tools.  
- **Calcite Components**: UI primitives for panel, notice, buttons, and actions.  
- **ArcGIS Core**: `GraphicsLayer` for graphics; `unionOperator` to merge geometries.  
- **AppContext & Config**: Global state and resource URLs.

---

## 4. State & References

| Name               | Type                                | Purpose                                               |
| ------------------ | ----------------------------------- | ----------------------------------------------------- |
| `sketchRef`        | `RefObject<HTMLElement>`            | To call `.cancel()` on the sketch widget.             |
| `graphicsLayer`    | `RefObject<GraphicsLayer>`          | Holds the graphics layer added to the map.            |
| `selectedFeatures` | `RefObject<Array<any>>`             | Temp storage for drawn geometries (currently unused). |
| `activeTool`       | `"polygon" \| "rectangle" \| "cursor" \| null` | Current drawing mode.              |
| `title`            | `string`                            | Help panel title based on active tool.                |
| `message`          | `string`                            | Help panel message based on active tool.              |

---

## 5. Lifecycle & Effects

1. **Initialize GraphicsLayer**  
   ```js
   useEffect(() => {
     if (arcgisMapRef.current && !graphicsLayer.current) {
       graphicsLayer.current = new GraphicsLayer();
       arcgisMapRef.current.map.add(graphicsLayer.current);
     }
   }, [arcgisMapRef]);
   ```
2. **Reset on Panel Close**  
   ```js
   useEffect(() => {
     if (selectPanelClosed && sketchRef.current) {
       sketchRef.current.cancel();
       selectedFeatures.current = [];
     }
   }, [selectPanelClosed]);
   ```
3. **Update Help Text**  
   ```js
   useEffect(() => {
     const updateHelp = async () => {
       const { title, message } = await getSelectionTip(activeTool);
       setTitle(title);
       setMessage(message);
     };
     updateHelp();
   }, [activeTool]);
   ```

---

## 6. Event Handlers

### 6.1 onarcgisPropertyChange  
Tracks sketch state transitions to set the `activeTool`.

```ts
onarcgisPropertyChange={(e) => {
  if (e.target.state === "active") {
    setActiveTool(e.target.activeTool);
  }
  if (e.target.state === "ready" && !e.target.activeTool) {
    setActiveTool("cursor");
  }
}}
```

### 6.2 onarcgisCreate  
When a sketch completes (`detail.state === "complete"`), it calls `handleSelection()`:

```ts
onarcgisCreate={(e) => {
  if (e.detail.state === "complete") {
    handleSelection();
  }
}}
```

**`handleSelection` implementation:**

```ts
const handleSelection = async () => {
  const geometries = graphicsLayer.current.graphics.map(g => g.geometry);
  const queryGeometry = unionOperator.executeMany(geometries.toArray());
  const features = await queryPolygon(queryGeometry, true);
  graphicsLayer.current.removeAll();
  togglePanel(
    propertyDetailPanelClosed && features.length === 1 ? "property" : "search"
  );
};
```

### 6.3 Reset Button  
Clears both the `GraphicsLayer` and your external results:

```ts
const handleReset = () => {
  if (graphicsLayer.current) {
    graphicsLayer.current.removeAll();
  }
  clearResults();
};
```

---

## 7. Rendering Structure

```jsx
<CalcitePanel
  closed={selectPanelClosed}
  closable
  heading={translateText("Select")}
  onCalcitePanelClose={() => setSelectPanel(true)}
  style={{ display: selectPanelClosed ? "none" : "flex" }}
>
  <CalciteAction
    slot="header-actions-start"
    icon="question"
    text="help"
    onClick={() =>
      window.open(`${config.hub_site_url_resources}#${config.hub_site_resources_bookmarks["select-tool"]}`, "_blank")
    }
  />
  <CalciteBlock
    open
    heading={translateText("Select Multiple Parcels")}
    description={translateText("...")}
    style={{ display: "flex", flexDirection: "column", gap: "10px", height: "97%" }}
  >
    <arcgis-sketch
      ref={sketchRef}
      layer={graphicsLayer.current}
      referenceElement={arcgisMapRef.current}
      hideCreateToolsPoint
      hideCreateToolsCircle
      hideCreateToolsPolyline
      hideDuplicateButton
      hideLabelsToggle
      hideCustomSelectionTool
      hideSettingsMenu
      hideUndoRedoMenu
      hideSnappingControls
      hideSelectionCountLabel
      hideSelectionToolsLassoSelection
      hideSelectionToolsRectangleSelection
      autoDestroyDisabled={false}
      hideDeleteButton={false}
      scale="l"
      onarcgisPropertyChange={/* see above */}
      onarcgisCreate={/* see above */}
    />
    <CalciteNotice open={!!activeTool} style={{ paddingTop: "15px" }}>
      <div slot="title">{title}</div>
      <div slot="message">{message}</div>
    </CalciteNotice>
  </CalciteBlock>
  <CalciteButton slot="footer-end" iconStart="reset" appearance="outline" onClick={handleReset}>
    Reset
  </CalciteButton>
</CalcitePanel>
```

---

## 8. Key Points for Developers

- **Panel Lifecycle**: Closing the panel not only hides it but also cancels active sketches.  
- **Tool Switching**: Only polygon, rectangle, and cursor modes are available; others are hidden via props.  
- **Context Reliance**: No props—everything comes from `UseAppContext`. Ensure all required context values/functions exist.  
- **Help Messaging**: Centralized in `getSelectionTip()` for easy updates.

---

## 9. Extending or Modifying

- **Add Lasso Tool**: Remove `hideSelectionToolsLassoSelection` and handle `activeTool === "lasso"`.  
- **Debounce Queries**: Wrap `handleSelection` with a debounce to prevent rapid-fire queries.  
- **Externalize Tooltips**: Move strings in `getSelectionTip()` to a JSON/translation file.

---

## 10. Troubleshooting

- **`GraphicsLayer` not initialized**: Ensure `arcgisMapRef.current` is set before the initialization effect runs.  
- **No parcels returned**: Inspect the union geometry and network calls in DevTools.  
- **Help notice not updating**: Verify that `onarcgisPropertyChange` fires and updates `activeTool`.

---

## 11. Could Be Better

- **Unused Refs**: `selectedFeatures` is declared but never read—either remove it or use it for multistage selection feedback.  
- **Error Handling**: Wrap `queryPolygon` in `try/catch` and display errors in a `CalciteNotice`.  
- **Performance**: Instead of clearing all graphics on each draw, remove only the last graphic.  
- **Accessibility**: Add `aria-label` to `<arcgis-sketch>` to describe the drawing tools for screen readers.