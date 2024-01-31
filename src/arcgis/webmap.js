import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";

// Create a Map instance
const myMap = new Map({
    basemap: "streets-vector"
  });

  const view = new MapView({
    map: myMap,
    center: [-87.8298, 41.8781],
    zoom: 8
  })

export async function initializeMap(container){

view.container = container

return view
}  