## WebMapView Documentation

### Overview
The components within this directory are designed to handle the display of the ArcGIS map, add and remove layers, handle map interactions, and toggle UI elements based on the viewport size.

There are two components in this directory:

- The `WebMapComponentBeta` is a React component designed to integrate with ArcGIS maps using the `@arcgis/map-components-react` library. 

- The `WebmapView` is a React component designed to handle the ArcGIS map using the `@arcgis/core map widget`

### Change Log
## [v3.0.0-beta.2] - 2024-04-22

### Changed
- Utilzing `@arcgis/map-components-react` library `<ArcgisMap/>` in the WebMapComponentBeta react component
- Replaced `<WebmapView/>` React component in `App.jsx` and `Panel.jsx` with `<WebMapComponentBeta/>`
- Created `addLayerToMap` function to add Parcel search, comparable, and nearby results to the map as feature layers instead of graphics layers
    - the `addLayerToMap` leverages the `createFeatureLayerFromFeatures` function that lives in the layers.js file to create feature layers from search result geometries. For more information, see the `arcgis/layers/README.md`
    - All results that are displayed in the map are now handled in the `<WebMapComponentBeta/>` instead of AppContext and webmap.js
    - All zoom to extent actions are handled in the `<WebMapComponentBeta/>` instead of AppContext and webmap.js
- the `ArcgisMap` `onArcgisViewClick` event passes the `mapPoint` from the `event.detail.mapPoint` property to the `queryMapPoint` function that is reference from AppContext.jsx
    - this changes replaces the `use effect` and `reactiveUtils` to watch for click events from the map view, simplifying the code

### Fixes
- Fixed the bug where parcel search, comparable, and nearby results were not displaying correctly in the map and legend when the map was printed







### Usage
```jsx
import React from 'react';
import { WebMapComponentBeta } from './components';

const App = () => {
  return (
    <div>
      <WebMapComponentBeta />
    </div>
  );
}

export default App;
```

### Props
The `WebMapComponentBeta` component does not accept any props directly. However, it relies on the context provided by the `AppContext` to access various application states and functions.

### Dependencies
- `@arcgis/map-components-react`: A library for integrating ArcGIS maps into React applications.
- `@mui/material`: Material-UI components for user interface elements.
- `@mui/icons-material`: Material-UI icons for UI elements.

### Functions
#### `zoomToExtent(features)`
- **Description**: Zooms the map view to the extent of the provided features.
- **Parameters**:
  - `features`: Array of features or a single feature to calculate the extent from.
- **Returns**: Void

#### `addLayerToMap(features, title, theme)`
- **Description**: Adds a feature layer to the map with the provided features, title, and theme.
- **Parameters**:
  - `features`: Array of features to be added to the layer.
  - `title`: Title of the layer.
  - `theme`: Theme configuration for the layer.
- **Returns**: Void

#### `handleViewClick(mapPoint)`
- **Description**: Handles the click event on the map view and triggers a map point query.
- **Parameters**:
  - `mapPoint`: Coordinates of the clicked point on the map.
- **Returns**: Void

#### `handleClick()`
- **Description**: Handles the click event on UI elements and toggles the display of the secondary panel.
- **Parameters**: None
- **Returns**: Void

### Hooks
- `useEffect`: Used to trigger side effects such as adding layers to the map, handling view changes, and updating UI based on context changes.

### Context
The `WebMapComponentBeta` component relies on the `AppContext` for accessing application states and functions related to map interactions.

### Example
```jsx
import React from 'react';
import { WebMapComponentBeta } from './components';

const App = () => {
  return (
    <div>
      <WebMapComponentBeta />
    </div>
  );
}

export default App;
```

### Notes
- Ensure that the `AppContext` is properly configured to provide necessary states and functions to the `WebMapComponentBeta` component.
- This component assumes the presence of specific layers and themes configured in the application context.
- Adjustments to UI layout and positioning are made based on the screen width using Material-UI's theme breakpoints.

### Disclaimer
This documentation is intended for informational purposes only and may require adjustments based on specific project requirements and configurations.