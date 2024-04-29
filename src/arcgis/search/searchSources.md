# searchSources.js README

This JavaScript script provides functionality to create search sources for the ArcGIS API for JavaScript search widget. It dynamically generates `LayerSearchSource` and `LocatorSearchSource` objects based on the configurations provided in the `appConfig.LayerSources` and `appConfig.LocatorSearchSources` object. These search sources can be used to enhance the search capabilities of ArcGIS applications.

## Features

- **Search Sources Creation**: The script generates `LayerSearchSource` and `LocatorSearchSource` objects based on the configurations specified in `appConfig.LayerSources` and `appConfig.LocatorSearchSources` respectively. Each search source includes properties such as `displayField`, `exactMatch`, `maxResults`, `searchFields`, and more.
  
## Prerequisites

- **ArcGIS API for JavaScript**: Ensure that you have included the ArcGIS API for JavaScript library in your project. You can install it using npm or include it via CDN.

## Usage

1. **Import Dependencies**: Import the required modules and configurations at the beginning of your JavaScript file:

    ```javascript
    import LayerSearchSource from "@arcgis/core/widgets/Search/LayerSearchSource.js";
    import { appConfig } from "../config";
    ```

2. **Create Named Layers**: Create named layers using the `createFeatureLayers(map)` function or another appropriate method. These named layers are then used in the `createSearchSources` function to create search sources.

3. **Create Search Sources**: Call the `createSearchSources(namedLayers)` function, passing your named layers as an argument. This function will generate an array of `LayerSearchSource` objects based on the configurations in `appConfig.LayerSources`:

    ```javascript
    const searchSources = await createSearchSources(namedLayers);
    ```

4. **Usage Examples**:

   - Setting up the search widget with created search sources:

    ```javascript
    const searchWidget = new Search({
        // ... other search widget properties
        sources: searchSources
    });
    ```

## Configuration

Ensure that your `appConfig` object is properly configured before using this script. The `LayerSources` array in `appConfig` should contain objects with the following properties for each layer source:

- `layerName`: The name of the corresponding feature layer.
- `searchSources`: An array of search sources configurations containing properties such as `displayField`, `exactMatch`, `maxResults`, `searchFields`, and more.

## License

This script is released under the [MIT License](LICENSE). Feel free to modify and use it in your projects.