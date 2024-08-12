# LayerListWidgetCustom Documentation

## Overview

The LayerList widget provides a way to display a list of layers, and switch on/off their visibility. The ListItem API provides access to each layer's properties, allows the developer to configure actions related to the layer, and allows the developer to add content to the item related to the layer.

The `layerListVMCustom` is a React component that provides a custom implementation of a layer list for map applications similar to LayerList widget. It uses ArcGIS API for JavaScript's LayerListViewModel to manage and display map layers in a collapsible, grouped list format.

https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-LayerList-LayerListViewModel.html


## Change Log


## [v3.0.0-beta.2] - 2024-04-23

## [v3.0.0] - 2024-04-23
main component

## Usage

```jsx
import LayerListVMCustom from './path/to/LayerListVMCustom';

function MapComponent() {
  return (
    <div>
      {/* Other map components */}
      <LayerListVMCustom />
    </div>
  );
}
```

## Props

This component doesn't accept any props. It relies on the `UseAppContext` hook to access necessary data and functions.

## Dependencies

- React (useState, useEffect, useRef)
- @arcgis/core (LayerListVM)
- Material-UI components (Box, List, ListItem, ListItemButton, Typography, Checkbox, Collapse)
- Custom hooks (UseAppContext)

## Functions

### `sortGroupedLayers(groupedLayers)`
Sorts the grouped layers alphabetically by group name.

### `handleClick(title)`
Toggles the visibility of a layer when clicked.

### `handleGroupClick(group)`
Toggles the expansion state of a layer group.

## Hooks

### `useEffect`
- Sets up the LayerListVM
- Creates the initial layer list structure
- Watches for changes in map scale to update layer visibility

### `useState`
- `layerListItems`: Stores the operational items from LayerListVM
- `groupOpen`: Tracks the open/closed state of layer groups
- `layerGroups`: Stores the organized structure of layers and groups

## Context

The component uses a custom `UseAppContext` hook to access:
- `translateText`: Function for text translation
- `mapView`: The current map view
- `mapViewScale`: The current map scale

## Example

The component renders a list of layer groups. Each group can be expanded to show individual layers. Layers can be toggled on/off using checkboxes.

```jsx
<Box display="flex" sx={{ width: '100%', height:"100%", overflow:"auto"}}>
  <List disablePadding sx={{ width:"100%", height:"100%"}}>
    {/* Layer groups and items are rendered here */}
  </List>
</Box>
```

## Notes

- The component handles both map-image and group layer types.
- Layer visibility is tied to the current map scale.
- Groups are sorted alphabetically.
- The component uses Material-UI components for styling and layout.
- Translations are applied to group and layer names using the `translateText` function from context.