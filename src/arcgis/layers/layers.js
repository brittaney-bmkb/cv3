import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Basemap from "@arcgis/core/Basemap";
import { config } from "../../data/config";
import Query from "@arcgis/core/rest/support/Query";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer";


export async function removeLayer(map, name){

  const foundLayers = map.allLayers.find(function(layer) {
    return layer.title === name;
   });

   if(foundLayers){
    console.log("Found Layers to Remove: ", foundLayers )
      map.remove(foundLayers)
   }
}

export async function createFeatureLayerFromFeatures(features, title, theme){
  

  let featuresArray = Array.isArray(features) ? features : [features]

  console.log("features source: ", featuresArray)

  let featureGeometry = featuresArray.map(feature => {
    let obj = {}
    obj["geometry"] = feature.geometry

    return obj
  })

  let layer = new FeatureLayer({
    source: featureGeometry,
    geometryType:"polygon",
    title: title,
    objectIdField: 'OBJECTID',
    renderer: {
      type: "simple",
      symbol: theme
    }
  })

  return layer
}

export async function readFeatureLayerData(url, outFields, where, returnGeometry){

  let layer = new FeatureLayer({
    url: url,
    outFields: outFields,
  })

  let query = new Query()
  query.where = where
  query.returnGeometry = returnGeometry ? true : false
  query.outFields = ["*"]

  let queryResult = await layer.queryFeatures(query)
  //console.log("data dicationary query result ", queryResult)

  return queryResult
}

export async function createFeatureLayers(loadAll){

    const namedLayers = {};

    config.layer_sources.forEach(source => {
        const name = source.layerName;

        //https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-FeatureLayer.html

        if(source.visible || loadAll){
          if(source.type === 'mapImageLayer'){
            namedLayers[name] = new MapImageLayer({
              url: source.url,
              opacity: source.opacity,
              title: name,
              visible: source.visible,
              minScale: source.minScale,
              sublayers: [
                {
                  id:source.index,
                  visible:source.visible,
                  minScale:source.minScale,
                  renderer: source.render ?? null,
                  title: source.layerName,
                  outFields: ["*"]
                
                }
              ]
            })
  
          }
          else{
            namedLayers[name] = new FeatureLayer({
              url: source.url,
              outFields: source.outFields,
              title: name,
              visible:source.visible,
              renderer: source.render ?? null,
              outFields: ["*"]
            })
          }
        }

      })

    return namedLayers
}


export async function createBaseMap(){

    return new Basemap({
        portalItem: {
            id:config.basemap_item_id,
            portal:config.portal
          }
    })
}

