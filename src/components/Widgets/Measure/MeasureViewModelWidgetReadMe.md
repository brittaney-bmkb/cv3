
## MeasureViewModelWidget Documentation

### Overview

This documentation provides an overview of the `MeasureViewModelWidget` component, its functionality, and its integration within a larger web map application. The component offers a user-friendly interface for performing measurements on a map, with support for different unit types and measurement tools. It allows users to measure distances and areas on the map using ESRI's Measurement widget. 

The widget uses the Measurement.js from the ArcGIS Maps SDK for JavaScript. The use of this library is limited in mobile and it's inability to unpack the end session from a double click makes it less user and developer friendly. The choice was to shelf this component and defer to the SketchViewModel which allows more flexibility and customization while incuring a higher technical debt. Overall, the component works as intended but lacks the nuiances needed for our users. 

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

The `MeasureViewModelWidget` can be used within a React application that utilizes ESRI's ArcGIS API for JavaScript. It should be placed within a component that provides the necessary context (e.g., `mapView` and other properties from `UseAppContext`).

### Props

This component doesn't accept any props directly. It relies on context provided by `UseAppContext`.

### Dependencies

- React (useState, useRef, useEffect)
- ESRI ArcGIS API for JavaScript (Measurement, reactiveUtils)
- Material-UI components (Box, Typography, Divider, Select, MenuItem)
- Custom components (StyledButtonFilledPrimary)
- Custom icons (StraightenOutlinedIcon, SquareFootOutlinedIcon, CheckCircleOutlineIcon)
- Custom hooks (UseAppContext)
- Custom theme

### Functions

- `handleUnitChange`: Handles changes in the unit selection dropdown
- `clearMeasurement`: Clears the current measurement and resets the widget state
- `startMeasuring`: Initiates the measurement process for a given tool type (area or distance)
- `completeAllGraphics`: Attempts to complete the measurement (currently non-functional due to API limitations)

### Hooks

- useState: Used for managing various state variables (areaUnit, linearUnit, measurementValue, activeTool)
- useRef: Used for maintaining a reference to the measureWidget
- useEffect: Used for initializing the measure widget, setting up watchers, and updating the widget based on state changes

### Context

The component uses `UseAppContext` to access various properties and functions, including `mapView`, `translateText`, `screenWidth`, and others.

### Example

```jsx
import MeasureViewModelWidget from './MeasureViewModelWidget';

function MapComponent() {
  return (
    <div>
      {/* Other map components */}
      <MeasureViewModelWidget />
    </div>
  );
}
```

### Notes

- The widget supports both linear (distance) and area measurements.
- Measurements can be done in various units (feet, yards, miles, meters, kilometers for distance; square feet, square inches, square yards, etc. for area).
- The widget provides a user interface for selecting measurement tools, choosing units, and displaying results.
- It integrates with ESRI's Measurement widget for performing measurements on the map.
- The component uses Material-UI for styling and layout.
- Translations are supported through the `translateText` function from context.
- The component is responsive, adjusting its layout based on screen width.
- The "Complete" button functionality is limited due to constraints in the ESRI API.

