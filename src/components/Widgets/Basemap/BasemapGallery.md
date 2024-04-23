## BasemapGallery Documentation

### Overview
The `BasemapGallery` component is a React component designed to integrate the ArcGIS Basemap Gallery functionality into a React application using the `@arcgis/map-components-react` library. It provides users with the ability to select basemaps from a predefined set of options.

The `BasemapGallery` is replacing the `BasemapWidget`

## Change Log
## [v3.0.0-beta.2] - 2024-04-22

### Changed
- Utilzing `@arcgis/map-components-react` library `<ArcgisBasemapGallery/>` react component
- Creating basemap sources from [PortalBasemapsSource class](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-BasemapGallery-support-PortalBasemapsSource.html)
    - `portal url` and `basemap group id` passed from `config.js`
    - `view` is passed from the `mapView` (`AppContext.jsx`)
        - `view` is now being set in the `WebMapComponentBeta.jsx`
- css handled in App.css
- mapView now set after map finishes loading rather than after each view change

### Fixes
- Basemap now references mapView that is set from from `WebMapComponentBeta.jsx`
- Repeated rendering of basemap gallery widget fixed in mobile as view changes

### Deprecated
- Deprecated `BaseMapWidget` component and will completely remove in next release

### Breaking Changes
- None


###

### Usage
```jsx
import React from 'react';
import { BasemapGallery } from './components';

const App = () => {
  return (
    <div>
      <BasemapGallery />
    </div>
  );
}

export default App;
```

### Props
The `BasemapGallery` component accepts the following props:

- `None`: This component does not accept any props directly. However, it relies on the `config` object to provide portal information and basemap group ID.

### Dependencies
- `@arcgis/map-components-react`: A library for integrating ArcGIS maps into React applications.
- `@arcgis/core/widgets/BasemapGallery/support/PortalBasemapsSource.js`: ArcGIS API module providing access to basemaps from a portal.
- `@mui/material`: Material-UI components for user interface elements.

### Functions
#### `createBasemapSource()`
- **Description**: Creates a new `PortalBasemapsSource` instance using the portal information and basemap group ID from the `config` object.
- **Parameters**: None
- **Returns**: Void

#### `configureBasemapGallery()`
- **Description**: Configures the Basemap Gallery with the map view if both the gallery reference and the map view are available.
- **Parameters**: None
- **Returns**: Void

### Hooks
- `useEffect`: Used to trigger side effects such as creating the basemap source and configuring the Basemap Gallery with the map view.

### Context
The `BasemapGallery` component relies on the `AppContext` for accessing the map view.

### Example
```jsx
import React from 'react';
import { BasemapGallery } from './components';

const App = () => {
  return (
    <div>
      <BasemapGallery />
    </div>
  );
}

export default App;
```

### Notes
- Ensure that the `config` object is properly configured to provide portal information and basemap group ID.
- This component assumes the presence of a map view provided by the `AppContext`.
- Adjustments to the Basemap Gallery UI can be made through CSS styling.

### Disclaimer
This documentation is intended for informational purposes only and may require adjustments based on specific project requirements and configurations.