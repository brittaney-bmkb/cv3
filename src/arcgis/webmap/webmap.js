import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import { createBaseMap, createFeatureLayers } from "../layers/layers";
import { createSearchSources } from "../search/searchSources";
import { config } from "../../data/config";
import Query from "@arcgis/core/rest/support/Query.js";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";
import Graphic from "@arcgis/core/Graphic.js";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";

let targetLayerView;
let targetLayer;
let namedLayers;
let searchSources
let highlightSelect;
let point;
let layerGraphics

//create graphics layer to search result
layerGraphics = new GraphicsLayer()

//create graphics layer to comparable search result
let layerGraphicsSecondary = new GraphicsLayer()

// Create a Map instance
const map = new Map({
    // basemap: "streets-vector"
  });





const view = new MapView({
  map: map,
  center: [-87.8298, 41.8781],
  zoom: 8
})

view.ui.move([ "zoom" ], "top-right");

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

  //add graphics layer to map
  map.add(layerGraphicsSecondary)

  //add graphics layer to map
  map.add(layerGraphics)

return map, searchSources
}  

// async funciton to set define point location from mouse click
// point location is detected from view onclick event and map point is 
// accessed from click event.mapPoint
export async function onViewClick(event) {
  return new Promise(async (resolve, reject) => {
    try {
      const point = await new Promise((resolvePoint) => {
        view.on("click", (clickEvent) => {
          resolvePoint(clickEvent.mapPoint);
        });
      });

      console.log("Map Point: ", point);

      await view.goTo({ target: point });

      if (view.zoom < 16) {
        view.zoom = 16;
      }

      const layerView = await view.whenLayerView(targetLayer);
      await reactiveUtils.whenOnce(() => !layerView.updating);
      console.log("Layer view done loading");

      if (view.zoom < 16) {
        // If you still need a delay, consider using a proper async sleep function
        // await sleep(3000);
        await new Promise((resolveSleep) => setTimeout(resolveSleep, 3000));
      }

      const query = new Query();
      query.geometry = point;
      query.spatialRelationship = "intersects";
      query.returnGeometry = true

      const { features } = await layerView.queryFeatures(query);

      console.log("on click features: ", features)
      createGraphic(features, true, "darkBlue")
      // const attributeKeys = Object.keys(feature.attributes);
      // console.log("Attribute to highlight: ", feature.attributes[attributeKeys[0]]);

      // //highlightSelect?.remove();

      // highlightSelect = layerView.highlight(feature.attributes[attributeKeys[0]]);
      resolve(features);
    } catch (error) {
      reject(error);
    }
  });
}


export async function querySearchResults(result){

  let resultValue
  let filter
  let whereString
  let sourceIndex = result.sourceIndex
  let resultFeatures = [result.feature]

  let searchSource = searchSources[sourceIndex]
  let searchLayer = searchSource.layer

  //Create target feature layer query 
  //to query target feature spatial and attribute data
  //based on search results
  let query = new Query()

  //check if target layer is the same as search source layer
  if(searchLayer === namedLayers[config.target_layer_name]){
    let searchField = searchSource.outFields[0]
    resultValue = result.feature.attributes[searchField]

    if(resultValue){
      whereString = `${searchField}='${resultValue}'`
      console.log(whereString)
      query.where = whereString
      query.outFields = ["OBJECTID", "PIN14"]
    }
  }

  //if target layer is different from source layer
  //perform a spatial intersection
  let geometry = result.feature.geometry
  if(geometry){
    //zoom to result 
    await zoomToExtent(resultFeatures)
    query.geometry = geometry
    query.distance = config.buffer_distance,
    query.units = config.buffer_unit
    query.spatialRelationship = "intersects";
    query.returnGeometry = true;
    query.outFields = ["OBJECTID", "PIN14"]
  } 

  // //get features from query
  console.log("Query = ", query)

  const layerView = await view.whenLayerView(targetLayer);
  await reactiveUtils.whenOnce(() => !layerView.updating);
  
  let { features } = await targetLayer.queryFeatures(query)
  await zoomToExtent(features)
  console.log("Queried Features: ", features)

  let feature = features[0]
  // //get pin ids 
  const attributeKeys = Object.keys(feature.attributes);


  highlightSelect?.remove();

  features.map((feature) => {
    
    layerView.highlight(feature.attributes[attributeKeys[0]])
    return feature.attributes["PIN14"]
  })

  return features

}

export async function removeHighlight(){
  highlightSelect?.remove();
}

async function zoomToExtent(features) {
  const geometries = features.map((feature) => feature.geometry);

  //console.log(geometries)
  const combinedExtent = geometryEngine.union(geometries);
  view.goTo(combinedExtent, {
  });

  createGraphic(features, true, "darkBlue")
}
  

export async function createGraphic(features, remove, color, secondary){

  if(remove){
    layerGraphics.removeAll()
  }

  const geometries = features.map((feature) => feature.geometry);
  geometries.map((geometry) => {
    let parcelGraphic = new Graphic({
      geometry: geometry,
      symbol:{
        type:"simple-line",
        size:3,
        color:color,
        width:3
      }
    })

    if(secondary){
      layerGraphicsSecondary.add(parcelGraphic)
    }
    else{
      layerGraphics.add(parcelGraphic)
    }
    
  
  })

}


  export async function compareProperities(feature){

    let query = new Query()
    query.geometry = feature.geometry
    query.spatialRelationship = "intersects"
    query.distance = "300"
    query.units = "feet"
    query.returnGeometry = true

    let {features} = await targetLayer.queryFeatures(query)

    console.log("queried Features: ", features)

    let filteredFeatures = features.filter((f) => f.attributes['PIN14'] !== feature.attributes['PIN14'])

    createGraphic(filteredFeatures, true, "red", true)

    createGraphic([feature], false, "darkBlue")

  }

  
