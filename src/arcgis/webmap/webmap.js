import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import { createBaseMap } from "../layers/layers";

// Create a Map instance
const map = new Map({
    // basemap: "streets-vector"
  });

  const view = new MapView({
    map: map,
    center: [-87.8298, 41.8781],
    zoom: 8
  })

export async function initializeMap(container){

view.container = container

//create new basemap
const basemap = await createBaseMap();
map.basemap = basemap


return view
}  