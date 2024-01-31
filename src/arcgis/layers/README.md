# layers.js README

This JavaScript script utilizes the ArcGIS API for JavaScript to create feature layers and a basemap for mapping applications. It is designed to be integrated into ArcGIS applications to handle the creation of layers and map content.

## Features

- **Feature Layers Creation**: The script dynamically creates feature layers based on the configurations provided in `appConfig.LayerSources`. It supports specifying the URL, outFields, and popup templates for each layer.
  
- **Basemap Creation**: The script includes a function to create a basemap using the specified portal item ID and portal URL from `appConfig.Basemap` and `appConfig.Portal`.

## Prerequisites

- **ArcGIS API for JavaScript**: Make sure to include the ArcGIS API for JavaScript library in your project to use this script. You can install it using npm or include it via CDN.

## Usage

1. **Import Dependencies**: Import the required modules and configurations at the beginning of your JavaScript file:

    ```javascript
    import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
    import PopupTemplate from "@arcgis/core/PopupTemplate.js";
    import { appConfig } from '../config';
    import Basemap from "@arcgis/core/Basemap";
    ```

2. **Feature Layers Creation**: Call the `createFeatureLayers(map)` function, passing your map object as an argument. This function will create and add feature layers to the map:

    ```javascript
    const namedLayers = await createFeatureLayers(map);
    ```

3. **Basemap Creation**: Call the `createBaseMap()` function to create a basemap using the specified portal item ID and portal URL:

    ```javascript
    const basemap = await createBaseMap();
    ```

4. **Usage Examples**:

   - Accessing a specific named layer:

    ```javascript
    const parcelLayer = namedLayers["Parcel Layer"];
    ```

   - Setting the basemap for your map:

    ```javascript
    map.basemap = basemap;
    ```

## Configuration

Ensure that your `appConfig` object is properly configured before using this script. The `LayerSources` array in `appConfig` should contain objects with the following properties for each layer:

- `layerName`: The name of the layer.
- `url`: The URL of the feature layer service.
- `outFields`: An array specifying the fields to be included in the layer's attribute table.
- `popupEnabled`: A boolean indicating whether popups are enabled for the layer.
- `popupTemplateTitle`: The title to be displayed in the layer's popup template.

## License

This script is released under the [MIT License](LICENSE). Feel free to modify and use it in your projects.