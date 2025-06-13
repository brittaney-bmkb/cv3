# CustomMaskLayer

The `CustomMaskLayer` is a custom ArcGIS JS API 2D tile layer for CookViewer that visually masks the map, revealing only a specified geometry (such as a polygon) with a configurable blurred edge. This is useful for highlighting a print area or focus region while dimming the rest of the map.

## Reference
[Masking effect using a custom layer view](https://developers.arcgis.com/javascript/latest/sample-code/custom-lv-masking/)

## Features

- **Custom Mask Rendering**: Masks the map with a semi-transparent color, revealing only the specified geometry.
- **Blurred Edge**: The mask edge is blurred using multiple strokes for a smooth transition.
- **Supports Multiple Geometry Types**: Works with polygons, extents, polylines, points, and multipoints.
- **Dynamic Updates**: Reacts to changes in geometry, color, or blur distance and updates the mask in real time.
- **Projection Handling**: Projects the geometry to the tile's spatial reference if needed.
- **Efficient Tiling**: Only updates and draws tiles that are visible or have changed.

## Usage

Import and instantiate the layer, then add it to your map:

```javascript
import CustomMaskLayer from './CustomMaskLayer';

const maskLayer = new CustomMaskLayer({
  id: 'print-area',
  geometry: myPolygon, // ArcGIS geometry (Polygon, Extent, etc.)
  distance: 25,        // Blur distance (pixels)
  color: [0, 0, 0, 0.8] // RGBA color for the mask
});

map.add(maskLayer);
```

## Constructor Parameters
- **id**: (string) Layer ID (default: 'print-area')
- **geometry**: (ArcGIS geometry) The geometry to reveal/unmask.
- **distance**: (number) Blur distance for the mask edge (default: 25).
- **color**: (array) RGBA color array for the mask (default: [0, 0, 0, 0.8]).
- **spatialReference**: (object) Optional spatial reference for the layer.
## Key Methods
- `createLayerView(view)`: Returns the custom 2D layer view for rendering.
- `drawGeometry(ctx, bounds)`: Handles the actual drawing of the mask and unmasked area on each tile.
- `manageTileImages()`: Manages creation and cleanup of tile images as the map view changes.
- `render(renderParameters)`: Draws the mask on the map canvas for each tile.
- `detach()`: Cleans up event handlers and resources when the layer is removed.
## Main Functional Areas
- **Mask Drawing**: Fills the map with a semi-transparent color, then "carves out" the geometry area using canvas compositing.
- **Blurred Edge**: Uses multiple strokes with decreasing opacity to create a soft edge around the unmasked area.
- **Geometry Projection**: Projects the geometry to the tile's spatial reference if needed for accurate rendering.
- **Reactive Updates**: Watches for changes in geometry, color, or distance and triggers redraws as needed.
## Could Be Better
- **Performance**: Large or complex geometries may impact performance; optimizations could be added.
- **Customization**: Allow for more advanced mask shapes or patterns.
- **Accessibility**: Provide options for users with visual impairments.
- **Testing**: Add more unit and integration tests for edge cases and performance.
## Troubleshooting Tips
- **Mask Not Showing**: Ensure the geometry is valid and the layer is added to the map.
- **No Blur Effect**: Adjust the distance property for a more noticeable blur.
- **Geometry Not Projected Correctly**: Confirm the spatial reference matches the map or tile spatial reference.
- **Performance Issues**: Reduce the complexity of the geometry or the blur distance.