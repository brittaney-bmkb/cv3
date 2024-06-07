import { config } from "../../data/config"
import { createFeatureLayers } from "../layers/layers"
import Multipoint from "@arcgis/core/geometry/Multipoint.js";
import Query from "@arcgis/core/rest/support/Query.js";
import Point from "@arcgis/core/geometry/Point";

let namedLayers;
let targetLayer

export const initalizeLayers = async () => {
    namedLayers = await createFeatureLayers()

    //define target layer
    console.log("targetLayer: ", namedLayers[config.target_layer_name])

    targetLayer = namedLayers[config.target_layer_name]

    if(targetLayer.type === "map-image"){
        let subLayer = targetLayer.findSublayerById(0)
        targetLayer = await subLayer.createFeatureLayer()
    }
}
 
const isTargetLayer = (layerUrl) => {

    //console.log("source url = ", layerUrl)

    let targetLayer = config.layer_sources.filter(layer => layer.layerName === config.target_layer_name)
    let targetLayerUrl = `${targetLayer[0].url}/${targetLayer[0].index}`
    targetLayerUrl = targetLayerUrl.replace(`//${targetLayer[0].index}`,`/${targetLayer[0].index}`)

    //console.log("target layer url = ", targetLayerUrl)

    return layerUrl === targetLayerUrl
}

const objectEquals = (obj1, obj2) => {
    // Compare the attributes of obj1 and obj2
    // Return true if the objects are equal, false otherwise
    // This function can be customized based on the specific attributes you want to compare
    return JSON.stringify(obj1) === JSON.stringify(obj2);
};

const addObjectToArrayIfNotExists = (array, newObj) => {
    // Check if the newObj already exists in the array
    const exists = array.some(obj => objectEquals(obj.attributes['PIN14'], newObj.attributes['PIN14']));
    // If newObj doesn't exist in the array, push it
    return exists
};

export const handleMultipleResults = async (results) => {

    console.log("handling multiple results: ", results);

    let filteredResults = results.filter(results => results.results.length > 0)

    // Create arrays to store features
    let targetFeatures = [];
    let searchFeatures = [];
    
    let addresses = []

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
                    //get address values
                    if(results.source.searchFields.includes("street_address")){
                        results.results.forEach(result => {
                            if (result && result.feature) {
                                let street_address = result.feature.attributes["street_address"]
                                let city_state_zip = result.feature.attributes["city_state_zip"]
                                let address_values = [ street_address, city_state_zip ]

                                if(!addresses.includes(address_values)){
                                    addresses.push(address_values)
                                }

                            } else {
                                console.error("Error: Missing feature in result.");

                            }
                        })
                    }
                    else{
                        results.results.forEach(result => {
                            if (result && result.feature) {
                                let featureExists = addObjectToArrayIfNotExists(targetFeatures, result.feature)
                                console.log("feature exists in array: ", featureExists)
                                console.log("pushing feature to targetFeatures: ", result.feature)
                                targetFeatures.push(result.feature);
                            } else {
                                console.error("Error: Missing feature in result.");
                            }
                        });
                    }
                    
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

    if(addresses.length > 0){ 
        //Address to query
        if(addresses.length > 0){
            let features = await queryTargetLayerByAddress(addresses)

            features.map(feature => {
                let featureExists = addObjectToArrayIfNotExists(targetFeatures, feature)
                console.log("new feature exists: ", featureExists)
                if(!featureExists){
                    targetFeatures.push(feature)
                }
                
            })
        }
    }


    if(searchFeatures.length > 0){

        let features = await queryTargetLayerWithPointFeatures(searchFeatures, true)
        
        console.log("Queried features from multipoint: ", features)

        features.map(feature => {
            let featureExists = addObjectToArrayIfNotExists(targetFeatures, feature)
            console.log("new feature exists: ", featureExists)
            if(!featureExists){
                targetFeatures.push(feature)
            }
            
        })
    }

    //let uniqueTargetFeatures = [...new Set(targetFeatures.map(feature => feature.attributes['PIN14']))]

    return {targetFeatures, searchFeatures}
}

const queryTargetLayerByAddress = async (addresses) => {
    
    let query = new Query()
    query.where = ''
    //query.where = `address = '${address}' AND city_state_zip = '${city_state_zip}'`
    query.returnGeometry = true
    query.outFields = ["*"]

     addresses.map((address, index) => {
        let [ street_address, city_state_zip ] = address
        console.log("querying ", street_address, city_state_zip )

        query.where += `(street_address = '${street_address}' AND city_state_zip = '${city_state_zip}')`
        if(index < addresses.length -1){
            query.where += ' OR '
        }
     })

     console.log("Full address query = ", query.where)

    
    const { features } = await targetLayer.queryFeatures(query);

    console.log(`Address query returned ${features.length} features`)

    return features
}

export const queryTargetLayerWithPointFeatures = async (pointFeatures, includeBuffer) => {
    let pointGeometry
    console.log("feature geometry: ", pointFeatures)

    if(Array.isArray(pointFeatures)){

        if(pointFeatures.length === 1 && pointFeatures[0].geometry){
            if(pointFeatures[0].geometry.type && pointFeatures[0].geometry.type === "point"){
                pointGeometry = pointFeatures[0].geometry
            }
        }
        else{
            let geometries = pointFeatures.map(point => {
                return [point.geometry.x, point.geometry.y]
              })
              console.log("feature geometry: ", geometries)
    
            pointGeometry = new Multipoint({
            points: geometries,
            spatialReference: pointFeatures[0].spatialReference
            })
        
            console.log("new multipoint feature: ", pointGeometry)
        }


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

    console.log("nearby primary result feature:", feature)

    let queryFeature = Array.isArray(feature) ? feature[0] : feature
    
    let query = new Query()
    query.geometry = queryFeature.geometry
    query.spatialRelationship = "intersects"
    query.distance = searchDistance
    query.units = units
    query.returnGeometry = true
    query.outFields = ["*"]

    let {features} = await targetLayer.queryFeatures(query)

    console.log("queried Features: ", features)

    let filteredFeatures = features.filter((f) => f.attributes['PIN14'] !== queryFeature.attributes['PIN14'])

    return filteredFeatures

  }


  export async function queryTargetLayerByPolygon(geometry){

    let query = new Query()
    query.geometry = geometry
    query.spatialRelationship = "intersects"
    query.returnGeometry = true
    query.outFields = ["*"]

    let {features} = await targetLayer.queryFeatures(query)

    console.log("queried Features: ", features)

    return features

  }

