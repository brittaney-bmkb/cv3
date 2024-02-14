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
import Home from "@arcgis/core/widgets/Home.js";
import Locate from "@arcgis/core/widgets/Locate.js";
import ScaleBar from "@arcgis/core/widgets/ScaleBar.js";

let targetLayerView;
let targetLayer;
let namedLayers;
let searchSources
let highlightSelect;
let point;
let layerGraphics

let map;
let view

//create graphics layer to search result
layerGraphics = new GraphicsLayer()

//create graphics layer to comparable search result
let layerGraphicsSecondary = new GraphicsLayer()



export async function initializeMap(container){

  // Create a Map instance
  map = new Map({
    // basemap: "streets-vector"
  });

  view = new MapView({
  map: map,
  center: [-87.8298, 41.8781],
  zoom: 8
  })

  view.ui.move([ "zoom" ], "top-right");

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
view.ui.add(homeWidget, "top-right");
// adds the locate widget to the top left corner of the MapView
view.ui.add(locateWidget, "top-right");
// Add widget to the bottom left corner of the view
view.ui.add(scaleBar, {
position: "bottom-left"
});

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

return view, searchSources
}  

// async funciton to set define point location from mouse click
// point location is detected from view onclick event and map point is 
// accessed from click event.mapPoint
export async function onViewClick() {
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

      resolve(features);
    } catch (error) {
      reject(error);
    }
  });
}


export async function querySearchResults(result, outFields){

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
      query.outFields = outFields
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
    query.outFields = outFields
  } 

  // //get features from query
  console.log("Query = ", query)

  const layerView = await view.whenLayerView(targetLayer);
  await reactiveUtils.whenOnce(() => !layerView.updating);
  
  let { features } = await targetLayer.queryFeatures(query)
  await zoomToExtent(features)

  createGraphic(features, true, "darkBlue")    
  // console.log("Queried Features: ", features)

  // let feature = features[0]
  // // //get pin ids 
  // const attributeKeys = Object.keys(feature.attributes);


  // highlightSelect?.remove();

  // features.map((feature) => {
    
  //   layerView.highlight(feature.attributes[attributeKeys[0]])
  //   return feature.attributes["PIN14"]
  // })

  return features

}

async function zoomToExtent(features) {
  const geometries = features.map((feature) => feature.geometry);

  //console.log(geometries)
  const combinedExtent = geometryEngine.union(geometries);
  view.goTo(combinedExtent, {
  });

  // createGraphic(features, true, "darkBlue")
}

export async function removeGraphics(){
  layerGraphics.removeAll()
}
  

export async function createGraphic(features, remove, color, secondary){

  if(remove){
    removeGraphics()
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


  export async function compareProperities(whereQuery, searchDistance, primaryResultFeature){

    let query = new Query()
    query.where = whereQuery
    query.returnGeometry = true

    if(searchDistance){
      query.geometry = primaryResultFeature.geometry
      query.spatialRelationship = "intersect"
      query.distance = searchDistance
      query.units = "miles"
    }

    let {features} = await targetLayer.queryFeatures(query)

    console.log("queried Features: ", features)

    createGraphic(features, false, "red", true)

  }

  export async function nearbyProperties(searchDistance, feature, queryFields){

    let query = new Query()
    query.geometry = feature.geometry
    query.spatialRelationship = "intersects"
    query.distance = searchDistance
    query.units = "miles"
    query.returnGeometry = true
    query.outFields = queryFields

    let {features} = await targetLayer.queryFeatures(query)

    console.log("queried Features: ", features)

    let filteredFeatures = features.filter((f) => f.attributes['PIN14'] !== feature.attributes['PIN14'])

    zoomToExtent(filteredFeatures)

    createGraphic(filteredFeatures, true, "red", true)

    createGraphic([feature], false, "darkBlue")

    return filteredFeatures

  }

  
