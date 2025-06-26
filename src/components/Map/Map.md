# Map.jsx Component Documentation

## Overview

The `Map` component is a central part of the CookViewer application, responsible for rendering the interactive ArcGIS web map, handling user interactions (such as selecting parcels), managing map layers and graphics, and integrating with the broader application state via the `AppContext`. It leverages the [ArcGIS Maps SDK for JavaScript](https://developers.arcgis.com/javascript/) through custom elements (`arcgis-map`, `arcgis-zoom`, etc.) and advanced Esri APIs for spatial operations and feature management.

---

## Key Responsibilities

- **Rendering the ArcGIS Map** using the `<arcgis-map>` web component.
- **Managing map layers and graphics**, including selection, highlighting, and buffer graphics.
- **Handling user interactions** such as map clicks for parcel selection and deselection.
- **Synchronizing map state** (selected features, comparables, buffers) with the global application state via `AppContext`.
- **Displaying UI widgets** (e.g., action bar, zoom controls, notifications) and adapting layout for mobile devices.
- **Integrating with the translation system** for dynamic UI text.

---

## Integration with AppContext

The component uses the `UseAppContext` hook to access and manipulate the global application state. This context provides:
- **References** (e.g., `arcgisMapRef`) to the map and search widgets.
- **State setters and getters** for features, panels, language, and more.
- **Utility functions** for querying, translating, and managing map-related data.

This tight integration ensures that map interactions are reflected throughout the app and that changes elsewhere (like language or selected features) update the map accordingly.

---

## Imports and Dependencies

- **ArcGIS Map Components:**  
  Custom elements for map, zoom, and legend controls.
- **ArcGIS Core APIs:**  
  For geometry operations, layers, graphics, and feature effects.
- **React:**  
  For state, refs, and effect management.
- **AppContext:**  
  For global state and utility functions.
- **Other UI Components:**  
  Such as `ActionBarMap` and `CalciteNotice`.

---

## Main Functional Sections

### 1. **State and References**

- **Refs:**  
  - `arcgisMapRef`: Reference to the `<arcgis-map>` element (from context).
  - `actionRef`: Reference to the action bar DOM node.
  - `highlightHandlesRef`: Stores highlight handles for selected features.

- **State:**  
  - `parcelLayer`: The main parcel feature layer.
  - `removeParcel`: Tracks parcels to be removed from selection.
  - `bufferGraphicsLayer`: Stores the buffer graphics layer.
  - `openNotification`: Controls the display of buffer notifications.

### 2. **Map Initialization and View Handling**

- **`handleViewReady`:**  
  Called when the ArcGIS view is ready. Sets up constraints, highlights, and finds the target parcel layer.

- **`zoomToExtent`:**  
  Zooms the map to the extent of selected features, using union geometry if multiple features are selected.

### 3. **Parcel Selection and Highlighting**

- **`handleViewClick`:**  
  Handles map click events for selecting or deselecting parcels, depending on the current panel state.

- **`handleParcelSelection`:**  
  Adds or updates selected parcels on the map, creating or updating a dedicated feature layer for selections.

- **`highlightReselectedParcels`:**  
  Highlights selected parcels using the ArcGIS view's highlight API, managing highlight handles for cleanup.

- **`clearSelectedParcelsByType`:**  
  Removes selected parcels of a given type from the map.

### 4. **Comparables and Secondary Features**

- **`showComparables` and `highlightSelectedComparable`:**  
  Manage the display and highlighting of comparable parcels and secondary features.

### 5. **Buffer Graphics Management**

- **`createSearchBufferGraphics`:**  
  Creates and adds buffer graphics (points and polygons) to the map when search results include buffer geometries.

- **`removeSearchBufferGraphics`:**  
  Removes buffer graphics from the map when relevant state changes.

### 6. **UI Integration and Responsiveness**

- **Action Bar:**  
  The `ActionBarMap` component is rendered inside a `<div ref={actionRef}>` and conditionally added to the map's UI in the top-right corner on mobile devices.

- **Zoom Controls:**  
  `<arcgis-zoom>` is always rendered in the map.

- **Notifications:**  
  `CalciteNotice` is used to display contextual messages (e.g., when showing properties near a searched address).

### 7. **Effect Hooks**

The component uses several `useEffect` hooks to:
- Respond to changes in selected features, comparables, and secondary features.
- Manage the addition/removal of UI widgets based on device type (`isMobile`).
- Synchronize buffer graphics with search results.
- Clean up graphics and highlights as needed.

---

## Example: How AppContext is Used

```jsx
const { 
    setMapView, 
    arcgisMapRef,
    primaryResultFeature,
    secondaryResultFeature,
    queryPolygon,
    selectPanelClosed,
    measurePanelClosed,
    togglePanel,
    searchFeatures,
    isMobile,
    comparableParcels,
    setSearchResults,
    searchTerm,
    newSearch,
    clearResultsComparables,
    searchBufferGeometry,
    searchResultPoint,
    translateText,
    setSearchBufferGeometry
} = UseAppContext()
```

- **References:**  
  `arcgisMapRef` is passed to `<arcgis-map>` and used to access the map and view objects.
- **State Management:**  
  Functions like `setMapView`, `setSearchResults`, and `setSearchBufferGeometry` update global state, ensuring the map and other components stay in sync.
- **Feature and Layer Operations:**  
  `primaryResultFeature`, `comparableParcels`, and others are used to determine what to display and highlight on the map.
- **Translation:**  
  `translateText` is used to localize UI text in notifications and other map-related messages.

---

## Rendering Structure

```jsx
<>
  {/* Action Bar (mobile only) */}
  <div ref={actionRef} className="esri-widget" style={{display: isMobile ? 'flex' : 'none'}}>
    <ActionBarMap />
  </div>

  {/* ArcGIS Map */}
  <arcgis-map
    ref={arcgisMapRef}
    item-id={config.webmap_id}
    zoom={8}
    onarcgisViewReadyChange={handleViewReady}
    onarcgisViewClick={...}
  >
    <arcgis-zoom position="top-right" />
    {/* <arcgis-legend ... /> */}
  </arcgis-map>

  {/* Notification */}
  <CalciteNotice open={openNotification} icon='cluster-radius' closable>
    <div slot="title">{translateText("Showing properties near") + " " + searchTerm}</div>
    <div slot="message">{translateText("You’re seeing multiple properties because the search used an address to find a nearby location, not a specific property. This means properties within about 60 feet of that address may appear in the results.")}</div>
  </CalciteNotice>
</>
```

---

## Key Points for Developers

- **All map and feature state is managed via AppContext,** ensuring consistency across the app.
- **ArcGIS custom elements are used for map rendering and controls.** These are referenced and manipulated via React refs.
- **All spatial and feature operations use ArcGIS JS API classes and methods.**
- **UI adapts for mobile devices,** with widgets and layout changing based on `isMobile` from context.
- **All text is localized** using the `translateText` function from context.
- **Effect hooks are used extensively** to synchronize map state with app state and user interactions.

---

## Extending or Modifying

- **To add new map interactions:**  
  Use the context to read or update state, and add new handlers or effects as needed.
- **To add new layers or graphics:**  
  Use ArcGIS API classes and add them to the map via `arcgisMapRef.current.map`.
- **To update UI or translations:**  
  Use the `translateText` function and context state to ensure consistency.

---

## Troubleshooting

- **If the map does not update as expected:**  
  Ensure that the relevant state in AppContext is being updated and that effect dependencies are correct.
- **If you see errors related to DOM manipulation:**  
  Avoid direct DOM manipulation of elements managed by React or ArcGIS custom elements; always use refs and API methods.
- **If translations do not appear:**  
  Check that the translation dictionary is loaded and that `translateText` is called with the correct keys.

---

## Could Be Better

- **Separation of Concerns:**  
  The `Map` component currently handles a wide range of responsibilities, from UI rendering to spatial logic and state management. Splitting out logic for feature selection, buffer management, and UI widgets into custom hooks or smaller components could improve readability and maintainability.

- **Effect Dependency Management:**  
  Some `useEffect` hooks may have broad or missing dependencies, which can lead to unnecessary re-renders or missed updates. Auditing and refining these dependencies would help ensure optimal performance and predictable behavior.

- **Direct DOM and ArcGIS UI Manipulation:**  
  The component relies on refs and direct manipulation of the ArcGIS view UI (e.g., adding/removing widgets). While necessary for integrating with the ArcGIS API, this can sometimes conflict with React’s rendering lifecycle. Exploring more robust patterns or wrappers for widget management could reduce the risk of errors.

- **Error Handling:**  
  Error handling for asynchronous operations (such as querying features or loading layers) is minimal. Adding user feedback and robust error boundaries would improve resilience and user experience.

- **Testing and Mocking:**  
  Due to its reliance on ArcGIS APIs and custom elements, the component may be difficult to test in isolation. Introducing mocks or abstraction layers for map interactions could facilitate unit and integration testing.

- **Accessibility:**  
  While the component uses Calcite and ArcGIS widgets (which have built-in accessibility features), custom overlays and notifications should be reviewed to ensure they are fully accessible to all users.

- **Performance with Large Datasets:**  
  Handling and rendering large numbers of features or graphics could impact performance. Implementing strategies such as feature clustering, debouncing interactions, or virtualizing UI lists may help.

- **Internationalization (i18n) Coverage:**  
  While `translateText` is used for UI strings, ensure all user-facing text—including error messages and dynamic content—is consistently localized.

