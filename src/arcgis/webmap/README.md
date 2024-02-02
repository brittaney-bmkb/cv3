# ArcGIS Map Viewer

This script is designed to create an interactive map using the ArcGIS API for JavaScript. It provides functionalities to initialize the map with custom layers, a search bar, and interactive click events to query feature information.

## Table of Contents
- [Setup](#setup)
- [Usage](#usage)
- [Functions](#functions)
  - [initializeMap](#initializemap)
  - [onViewClick](#onviewclick)
- [Dependencies](#dependencies)

## Setup

1. Install the required dependencies:
   ```bash
   npm install @arcgis/core
   ```

2. Import the necessary modules and script:
   ```javascript
   import Map from "@arcgis/core/Map.js";
   import MapView from "@arcgis/core/views/MapView.js";
   import Query from "@arcgis/core/rest/support/Query.js";
   import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
   import { createBaseMap, createFeatureLayers } from "../layers/layers";
   import { createSearchSources } from "../search/searchSources";
   import { config } from "../../data/config";
   ```

3. Make sure to have the required HTML container element to render the map:
   ```html
   <div id="map-container"></div>
   ```

## Usage

```javascript
import { initializeMap, onViewClick } from "./yourScriptPath.js";

// Assuming 'map-container' is the ID of the HTML container element
const mapContainer = document.getElementById("map-container");

// Initialize the map
const [map, searchSources] = await initializeMap(mapContainer);

// Set up click event listener
view.on('click', onViewClick);
```

## Functions

### initializeMap

Initializes the map with a specified container, custom base map, feature layers, and search sources.

```javascript
async function initializeMap(container: HTMLElement): Promise<[Map, object]> {
  // ...
}
```

- **Parameters:**
  - `container` (HTMLElement): The HTML container element to render the map.

- **Returns:**
  - A Promise resolving to an array containing the Map instance and search sources.

### onViewClick

Handles the click event on the map, retrieves the clicked point, queries features, and highlights the selected feature.

```javascript
async function onViewClick(event: Event): Promise<object> {
  return new Promise(async (resolve, reject) => {
    // ...
  });
}
```

- **Parameters:**
  - `event` (Event): The click event on the map.

- **Returns:**
  - A Promise resolving to the selected feature.

## Dependencies

- [@arcgis/core](https://www.npmjs.com/package/@arcgis/core): ArcGIS API for JavaScript.

Feel free to adapt the script according to your application's specific needs. If you encounter any issues or have questions, please refer to the [ArcGIS API for JavaScript documentation](https://developers.arcgis.com/javascript/latest/) for additional resources and support.