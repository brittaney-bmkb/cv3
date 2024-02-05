import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import { createBaseMap, createFeatureLayers } from "../layers/layers";
import { createSearchSources } from "../search/searchSources";
import { config } from "../../data/config";
import Home from "@arcgis/core/widgets/Home.js";
import Locate from "@arcgis/core/widgets/Locate.js";
import Graphic from "@arcgis/core/Graphic.js";
import ScaleBar from "@arcgis/core/widgets/ScaleBar.js";

let targetLayerView;
let targetLayer;
let namedLayers;
let searchSources

// Create a Map instance
const map = new Map({
    // basemap: "streets-vector"
  });

  //Map view loads to Cook County 
const view = new MapView({
  map: map,
  center: [-87.8298, 41.8781],
  zoom: 8
})

//create home widget
let homeWidget = new Home({
  view: view
});

let locateWidget = new Locate({
  view: view,   // Attaches the Locate button to the view
  
  graphic: new Graphic({
    symbol: { type: "simple-marker" }  // overwrites the default symbol used for the
    // graphic placed at the location of the user when found
  })
});

let scaleBar = new ScaleBar({
  view: view
});


// adds the home widget to the top left corner of the MapView
// https://github.com/alexlafroscia/ember-cli-stencil/issues/14 
view.ui.add(homeWidget, "top-left");
// adds the locate widget to the top left corner of the MapView
view.ui.add(locateWidget, "top-left");
// Add widget to the bottom left corner of the view
view.ui.add(scaleBar, {
  position: "bottom-left"
});

export async function initializeMap(container){

  //created feature layers based on config layer sources
  //add layers to map
  view.container = container

  //create new basemap
  const basemap = await createBaseMap();
  map.basemap = basemap

  namedLayers = await createFeatureLayers(map)

  //create search sources 
  searchSources = await createSearchSources(namedLayers)

  //define target layer
  targetLayer = namedLayers[config.target_layer_name]
  targetLayerView = await view.whenLayerView(targetLayer)

return view, searchSources
}  