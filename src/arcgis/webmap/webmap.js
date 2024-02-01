import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import { createBaseMap, createFeatureLayers } from "../layers/layers";
import { createSearchSources } from "../search/searchSources";
import { config } from "../../data/config";
import Query from "@arcgis/core/rest/support/Query.js";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";

let targetLayerView;
let targetLayer;
let namedLayers;
let searchSources

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

return map, searchSources
}  


export async function onViewClick(event){

  console.log("onViewClick: MAP CLICKED")

  //https://developers.arcgis.com/javascript/latest/api-reference/esri-views-layers-FeatureLayerView.html#highlight

  let query = new Query();

  query.geometry = event.mapPoint
  query.spatialRelationship = "intersects"

  await reactiveUtils.whenOnce(() => !targetLayerView.updating);

  const attributes = await targetLayerView.queryFeatures(query)

  console.log("ONCLICK ATTRIBUTES: ", attributes)


}