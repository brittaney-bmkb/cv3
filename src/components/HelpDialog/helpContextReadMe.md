## WebMapView Documentation

### Overview

The  `HelpContent` component displays various help content for the application. It includes information about navigation, search functionality, property results, comparison tools, measurement features, layer management, basemap selection, and printing capabilities.

### Usage

The `HelpContent` component is used within a larger application to provide user assistance and documentation. It takes a `display` prop to determine which section of help content to show.

### Props

- `display` (number): Determines which section of help content to display.

### Dependencies

- React (useState, useEffect)
- Material-UI components (Box, Typography, DialogTitle, DialogContent, etc.)
- Custom hooks (UseAppContext)
- Custom components (Modal)
- Configuration file (config)
- Theme file (theme)

### Functions

#### `handleImageClick(imageUrl)`

Handles clicking on an image to open it in a modal view.

#### `handleClose()`

Closes the modal view of an enlarged image.

### Hooks

- `useState`: Used for managing state (imageDirectory, modalOpen, enlargedImageUrl)
- `useEffect`: Used to update the image directory based on language changes
- `useMediaQuery`: Used to determine if the device is mobile

### Context

The component uses a custom context (UseAppContext) to access translation functions and language settings.

### Example

```jsx
<HelpContent display={0} />
```

This would display the overview section of the help content.

### Notes

- The component supports multiple languages through a translation system currently only English and Spanish.
- It includes responsive design considerations for mobile and desktop views.
- The help content is organized into several sections, each corresponding to a different `display` value:
  0. Overview
  1. Navigation Bar
  2. Search
  3. Property Results
  4. Compare Properties
  5. Measure
  6. Layers
  7. Basemaps
  8. Print
  9. Clear, Export, and Feedback
- Images are used to illustrate various features and are enlargeable through a modal view.
- The component uses Material-UI for styling and layout.

This README provides a high-level overview of the `HelpContent` component. For more detailed information about specific features or implementations, you may need to refer to the actual code or additional documentation within the larger application.