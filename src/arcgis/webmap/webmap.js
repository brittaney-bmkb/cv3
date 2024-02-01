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
let highlightSelect;
let point;

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


const sleep = ms => new Promise(r => setTimeout(r, ms))

async function queryMap(event){


  return new Promise(async(resolve, reject) => {
     //zoom to feature layer scale
      const point = event.mapPoint
      console.log("Map Point: ", point)
      
      view.goTo({
        target:point,
        zoom: 15 
      })

      
      .catch(function(error) {
        if (error.name != "AbortError") {
          console.error(error);
        }
      });

      console.log("zooming to location")
      // await reactiveUtils.whenOnce(() => !view.updating);

      // const layerView = await view.whenLayerView(targetLayer)

      await reactiveUtils.whenOnce(() => !targetLayerView.updating);
      console.log("layerview done loading")

      
      
      let query = new Query();
      query.geometry = point
      query.spatialRelationship = "intersects"

      const query_result = await targetLayerView.queryFeatures(query)

      console.log("ONCLICK ATTRIBUTES: ", query_result)
      const feature = query_result.features[0]
      

      const attribute_keys = Object.keys(feature.attributes)
      console.log("attribute to highlight: ", feature.attributes[attribute_keys[0]])

      if (highlightSelect) {
        highlightSelect.remove();
      }

      highlightSelect = targetLayerView.highlight(feature.attributes[attribute_keys[0]])

      resolve(feature)
      
  })
 
}

// function waitForPoint() {
//   return new Promise(resolve => point ? resolve(point) : view.once('click', event => (point = event.mapPoint, resolve(point))));
// }

// // Usage
// async function handleClickAndContinue() {
//   const clickedPoint = await waitForPoint();
//   console.log("Clicked Point:", clickedPoint);
// }

async function handleClick() {
  return new Promise(async (resolve, reject) => {
    view.on('click', async (event) => {
      point = event.mapPoint;

      try {
        await view.goTo({
          target: point,
          zoom: 15 
        });

        //TODO find a slicker solution 
        //waiting for parcel features to become available 
        //for querying
       
        
        resolve(point);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(error);
          reject(error);
        }
      }
    });
  });
}

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

      if (view.zoom < 15) {
        view.zoom = 15;
      }

      const layerView = await view.whenLayerView(targetLayer);
      await reactiveUtils.whenOnce(() => !layerView.updating);
      console.log("Layer view done loading");

      if (view.zoom < 15) {
        // If you still need a delay, consider using a proper async sleep function
        // await sleep(3000);
        await new Promise((resolveSleep) => setTimeout(resolveSleep, 3000));
      }

      const query = new Query();
      query.geometry = point;
      query.spatialRelationship = "intersects";

      const queryResult = await layerView.queryFeatures(query);

      console.log("ONCLICK ATTRIBUTES: ", queryResult);
      const feature = queryResult.features[0];

      const attributeKeys = Object.keys(feature.attributes);
      console.log("Attribute to highlight: ", feature.attributes[attributeKeys[0]]);

      if (highlightSelect) {
        highlightSelect.remove();
      }

      highlightSelect = targetLayerView.highlight(feature.attributes[attributeKeys[0]]);
      resolve(feature);
    } catch (error) {
      reject(error);
    }
  });
}


// export async function onViewClick(event){

//     //await handleClick()

//     view.on("click", function(event){
//       point = event.mapPoint
//     })

//     await sleep(1000)
//     console.log("Map Point: ", point)
//     view.goTo({
//       target: point, 
//     })

//     if(view.zoom < 15){
//       view.zoom = 15
//     } 

//   const layerView = await view.whenLayerView(targetLayer)
//   await reactiveUtils.whenOnce(() => !layerView.updating);
//   console.log("layerview done loading")

//   //TODO find a slicker solution 
//   //waiting for parcel features to become available 
//   //for querying
//   if (view.zoom < 15) {
//     await sleep(3000)
//   }
  
//   let query = new Query();
//   query.geometry = point
//   query.spatialRelationship = "intersects"

//   const query_result = await layerView.queryFeatures(query)

//   console.log("ONCLICK ATTRIBUTES: ", query_result)
//   const feature = query_result.features[0]
  

//   const attribute_keys = Object.keys(feature.attributes)
//   console.log("attribute to highlight: ", feature.attributes["Pin10"])

//   if (highlightSelect) {
//     highlightSelect.remove();
//   }

//   highlightSelect = targetLayerView.highlight(feature.attributes[attribute_keys[0]])

//   return feature
// }

// // Set up click event listener
// view.on('click', onViewClick);
  
