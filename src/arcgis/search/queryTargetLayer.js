import { config } from "../../data/config"
import { createFeatureLayers } from "../layers/layers"
import Multipoint from "@arcgis/core/geometry/Multipoint.js";
import Query from "@arcgis/core/rest/support/Query.js";
import Point from "@arcgis/core/geometry/Point";

const namedLayers = await createFeatureLayers()
//define target layer
console.log("targetLayer: ", namedLayers[config.target_layer_name])

let targetLayer = namedLayers[config.target_layer_name]

  if(targetLayer.type === "map-image"){
    let subLayer = targetLayer.findSublayerById(0)
    targetLayer = await subLayer.createFeatureLayer()
  }

const isTargetLayer = (layerUrl) => {

    //console.log("source url = ", layerUrl)

    let targetLayer = config.layer_sources.filter(layer => layer.layerName === config.target_layer_name)
    let targetLayerUrl = `${targetLayer[0].url}/${targetLayer[0].index}`
    targetLayerUrl = targetLayerUrl.replace(`//${targetLayer[0].index}`,`/${targetLayer[0].index}`)

    //console.log("target layer url = ", targetLayerUrl)

    return layerUrl === targetLayerUrl
}

export const handleMultipleResults = async (results) => {

    console.log("handling multiple results: ", results);

    let filteredResults = results.filter(results => results.results.length > 0)

    // Create arrays to store features
    let targetFeatures = [];
    let searchFeatures = [];

    filteredResults.forEach(results => {
        // Ensure results and results.source are not null before accessing properties
        if (results && results.source) {
            if (results.source.layer) {
                let sourceEqualsTarget = isTargetLayer(`${results.source.layer.url}/${results.source.layer.layerId}`);
                // Log error if isTargetLayer function returns null
                if (sourceEqualsTarget === null) {
                    console.error("Error: isTargetLayer function returned null.");
                    return;
                }
                if (sourceEqualsTarget) {
                    results.results.forEach(result => {
                        if (result && result.feature) {
                            targetFeatures.push(result.feature);
                        } else {
                            console.error("Error: Missing feature in result.");
                        }
                    });
                } else {
                    results.results.forEach(result => {
                        if (result && result.feature) {
                            searchFeatures.push(result.feature);
                        } else {
                            console.error("Error: Missing feature in result.");
                        }
                    });
                }
            } else {
                console.log("Pushing results features to search features");
                results.results.map(result => {
                    searchFeatures.push(result.feature)
                })
            }
        } else {
            console.error("Error: Missing source in results.");
        }
    });

    console.log("target results: ", targetFeatures)
    console.log("search results: ", searchFeatures)

    if(searchFeatures.length > 0){

        let features = await queryTargetLayerWithPointFeatures(searchFeatures, true)
        
        console.log("Queried features from multipoint: ", features)

        features.map(feature => {
            targetFeatures.push(feature)
        })
    }

    return {targetFeatures, searchFeatures}
}

export const queryTargetLayerWithPointFeatures = async (pointFeatures, includeBuffer) => {
    let pointGeometry
    console.log("feature geometry: ", pointFeatures)

    if(Array.isArray(pointFeatures)){
        
        let geometries = pointFeatures.map(point => {
            return [point.geometry.x, point.geometry.y]
          })
          console.log("feature geometry: ", geometries)
        
          let pointGeometry = new Multipoint({
            points: geometries,
            spatialReference: pointFeatures[0].spatialReference
          })
        
          console.log("new multipoint feature: ", pointGeometry)
    }

    else{
        pointGeometry = pointFeatures
    }

      const query = new Query();
      query.geometry = pointGeometry;
      query.spatialRelationship = "intersects";
      query.returnGeometry = true
      query.outFields = ["*"]
      if(includeBuffer){
        query.distance = config.buffer_distance,
        query.units = config.buffer_unit
      }
      
      //query.outFields = parcelQueryFields
    
      const { features } = await targetLayer.queryFeatures(query);
    
      console.log("queried features from click: ", features)
    
      return features
}

export async function queryTargetLayerWithCoordinates(coordinates){

    let x = parseFloat(String(coordinates).split(",")[0])
    let y = parseFloat(String(coordinates).split(",")[1])

    targetLayer.when()
    console.log("Target layer: ", targetLayer)
    let point = new Point({
      x: x,
      y: y,
      spatialReference:  targetLayer.spatialReference
      
    })


    console.log("new Point : ", point)
  
    let features = await queryTargetLayerWithPointFeatures(point)
  
    return features
}

export async function compareProperities(whereQuery, searchDistance, feature, queryFields){

    let query = new Query()
    query.where = whereQuery
    query.returnGeometry = true
    query.outFields = queryFields

    if(searchDistance && searchDistance > 0){
      query.geometry = feature.geometry
      query.spatialRelationship = "intersects"
      query.distance = searchDistance
      query.units = "miles"
  
    }

    let {features} = await targetLayer.queryFeatures(query)

    return features
  }

  export async function nearbyProperties(searchDistance, units, feature, queryFields){

    let query = new Query()
    query.geometry = feature.geometry
    query.spatialRelationship = "intersects"
    query.distance = searchDistance
    query.units = units
    query.returnGeometry = true
    query.outFields = queryFields

    let {features} = await targetLayer.queryFeatures(query)

    console.log("queried Features: ", features)

    let filteredFeatures = features.filter((f) => f.attributes['PIN14'] !== feature.attributes['PIN14'])

    return filteredFeatures

  }

