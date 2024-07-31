## MeasureSketchWidget Documentation

### Overview

The `MeasureSketchWidget` is a React component that provides measurement functionality for a web map application. It allows users to measure distances and areas on the map using polylines and polygons. The widget includes tools for drawing, unit selection, and display of measurement results.

SketchViewModel
https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Sketch-SketchViewModel.html
Provides the logic for the Sketch widget. The SketchViewModel is intended to be used with Graphics and requires a GraphicsLayer to be specified in its layer property. The Sketch widget provides out-of-the box functionality with a user interface (UI). 

This is the underlying ViewModel for the sketch widget. It builds out the functionality to create the graphic. 

GraphicsLayer
https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-GraphicsLayer.html
A GraphicsLayer contains one or more client-side Graphics. Each graphic in the GraphicsLayer is rendered in a LayerView inside either a SceneView or a MapView. The graphics contain discrete vector geometries that represent real-world phenomena.

This allows the graphic created in the SketchViewModel to appear on the map once user has completed drawing. 

geometryEngine
https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-geometryEngine.html
A client-side geometry engine for testing, measuring, and analyzing the spatial relationship between two or more 2D geometries. 

With this library we are able to do transformations as needed. 

### Change Log

N/A

### Changed

N/A

### Fixes

N/A

### Deprecated
N/A

### Breaking Changes

N/A

### Usage

The `MeasureSketchWidget` can be used within a React application that utilizes ESRI's ArcGIS API for JavaScript. It should be placed within a component that provides the necessary context (e.g., `mapView` and `translateText` from `UseAppContext`). 

The widget uses ESRI's SketchViewModel. Provides the logic for the Sketch widget. The SketchViewModel is intended to be used with Graphics and requires a GraphicsLayer to be specified in its layer property. The Sketch widget provides out-of-the box functionality with a user interface (UI). Therefore, the Sketch widget allows users to not worry about designing and creating their own UI. On the other hand, the SketchViewModel is the logic behind the Sketch widget UI, allowing users who utilize this class in their applications to design their own custom UI for the draw tools.

From this ViewModel we're able to couple it with the geometryEngine we are able to extract and display measurement information to the user. 

### Props

This component doesn't appear to accept any props directly. It relies on context provided by `UseAppContext`.

### Dependencies

- React (useState, useRef, useEffect)
- ESRI ArcGIS API for JavaScript (GraphicsLayer, SketchViewModel, geometryEngine)
- Material-UI components (Box, Stack, FormControl, InputLabel, NativeSelect, Typography, Divider, Button)
- Custom components (StyledButtonFilledPrimary, CalciteIcon)
- Custom hooks (UseAppContext)

### Functions

- `unitMeasurementAbbrev`: Returns the unit abbreviation for a given measurement type
- `handleChange`: Handles changes in the unit selection dropdown
- `getPositiveNumber`: Converts negative numbers to positive and formats to two decimal places
- `getArea`: Calculates and sets the area measurement
- `getLength`: Calculates and sets the length measurement
- `switchType`: Determines the measurement type based on the geometry
- `createGraphicLayer`: Creates a new graphics layer for measurements
- `removeAllGraphics`: Clears all graphics and resets the widget state
- `completeAllGraphics`: Completes the current measurement
- `startMeasuring`: Initiates the measurement process for a given geometry type
- `initializeSketchVM`: Initializes the ESRI SketchViewModel

### Hooks

- useState: Used for managing various state variables (sketchState, userGeometry, activeTool, areaMeasurement, linearMeasurement, selectedValueArea, selectedValueLinear)
- useRef: Used for maintaining references to the graphicsLayer and sketchVM
- useEffect: Used for setting up event listeners on the sketchVM

### Context

The component uses `UseAppContext` to access `mapView` and `translateText`.

### Example

```jsx
import MeasureSketchWidget from './MeasureSketchWidget';

function MapComponent() {
  return (
    <div>
      {/* Other map components */}
      <MeasureSketchWidget />
    </div>
  );
}
```

### Notes

- The widget supports both linear (distance) and area measurements.
- Measurements can be done in various units (feet, yards, miles, meters, kilometers for distance; acres, square feet, square meters, etc. for area).
- The widget provides a user interface for selecting measurement tools, choosing units, and displaying results.
- It integrates with ESRI's SketchViewModel for drawing and editing geometries on the map.
- The component uses Material-UI for styling and layout.
- Translations are supported through the `translateText` function from context.

