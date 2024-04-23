## LayerList Documentation

### Overview
The `LayerList` component is a React component designed to integrate the ArcGIS Layer List functionality into a React application using the `@arcgis/map-components-react` library. It provides users with the ability to view and manage the layers present on the map.

## Change Log
## [v3.0.0-beta.2] - 2024-04-23

## Changed
- Utilzing `@arcgis/map-components-react` library `<ArcgisLayerList/>` react component
    - `view` is passed from the `mapView` (`AppContext.jsx`)
        - `view` is now being set in the `WebMapComponentBeta.jsx`
- css handled in App.css
- Layer groups are now displayed based on layer groupings in the webmap consumed in the `WebMapComponentBeta` component

### Fixes
- Layer list now references layers from the mapView that is set from from `WebMapComponentBeta.jsx`

### Deprecated
- Deprecated `LayerListWidgetCustom` component and will completely remove in next release

### Breaking Changes
- None


### Usage
```jsx
import React from 'react';
import { LayerList } from './components';

const App = () => {
  return (
    <div>
      <LayerList />
    </div>
  );
}

export default App;
```

### Props
The `LayerList` component accepts the following props:

- `visibilityAppearance`: Determines the appearance of the layer visibility control. Possible values are `"checkbox"` and `"toggle"`.
- `dragEnabled`: Specifies whether dragging to reorder layers is enabled.
- `visibleElementsStatusIndicators`: Specifies whether to show status indicators for layers that are loading or not loaded.
- `listItemCreatedFunction`: A function that will be called when a list item is created. It can be used to modify list item properties like titles.

### Dependencies
- `@arcgis/map-components-react`: A library for integrating ArcGIS maps into React applications.

### Functions
#### `configureLayerList()`
- **Description**: Configures the Layer List with the map view if both the layer list reference and the map view are available.
- **Parameters**: None
- **Returns**: Void

### Hooks
- `useEffect`: Used to trigger side effects such as configuring the Layer List with the map view.

### Context
The `LayerList` component relies on the `AppContext` for accessing the map view and translation functions.

### Example
```jsx
import React from 'react';
import { LayerList } from './components';

const App = () => {
  return (
    <div>
      <LayerList />
    </div>
  );
}

export default App;
```

### Notes
- Ensure that the `AppContext` is properly configured to provide the map view and translation functions.
- Adjustments to the Layer List appearance and behavior can be made through props and CSS styling.
