import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Basemap from "@arcgis/core/Basemap";
import { config } from "../../data/config";
import Query from "@arcgis/core/rest/support/Query";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer";
import Graphic from "@arcgis/core/Graphic";
import WebStyleSymbol from "@arcgis/core/symbols/WebStyleSymbol.js";


export async function removeLayer(map, name){

  const foundLayers = map.allLayers.find(function(layer) {
    return layer.title === name;
   });

   if(foundLayers){
    //console.log("Found Layers to Remove: ", foundLayers )
      map.remove(foundLayers)
   }
}

export async function createFeatureLayerFromFeatures(features, title, theme){
  
  let featuresArray = Array.isArray(features) ? features : [features]

  //console.log("features from source: ", featuresArray)

  let featureGeometry = featuresArray.map(feature => {
    let obj = {}
    obj["geometry"] = feature.geometry
    //obj["attributes"] = feature.attributes

    return obj
  })

  let layer = new FeatureLayer({
    source: featureGeometry,
    geometryType:"polygon",
    title: title,
    objectIdField: 'OBJECTID',
    outFields: ["*"],
    renderer: {
      type: "simple",
      symbol: theme
    }
  })

  

  return layer
}

export const createFeatureLayerFromGraphics = async (source, objectIdField, type, title, theme) => {

  //console.log("feature layers from graphics: ", source)

  let layer = new FeatureLayer({
    source: source,
    objectIdField: objectIdField,
    geometryType: type,
    title: title,
    outFields: ["OBJECTID", "PIN14"],
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
  ////console.log("data dicationary query result ", queryResult)

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


export async function createGraphic(geometry, geometryType){

  let symbol;

  const webStyleSymbol = new WebStyleSymbol({
    name: "Point symbol_9",
    styleUrl: "https://cdn.arcgis.com/sharing/rest/content/items/70ccf6bcbd304773a164be896e76edd3/data"
    
  });

  if(geometryType === "point"){
    symbol = {
      type: "simple-marker",
      path: "M16,3.5c-4.142,0-7.5,3.358-7.5,7.5c0,4.143,7.5,18.121,7.5,18.121S23.5,15.143,23.5,11C23.5,6.858,20.143,3.5,16,3.5z M16,14.584c-1.979,0-3.584-1.604-3.584-3.584S14.021,7.416,16,7.416S19.584,9.021,19.584,11S17.979,14.584,16,14.584z",
      size: "30px",
      color: "orange",
      outline: {
        color: "white"
      }
    }
  }
  else{
    symbol = {
      type: "simple-fill",  // autocasts as new SimpleFillSymbol()
      color: [ 232, 255, 0, 0.05 ],
      style: "solid",
      outline: {  // autocasts as new SimpleLineSymbol()
        color: "orange",
        width: 1,
        style: "short-dash"
      }
    };
  }

  let graphic = new Graphic({
    geometry: geometry,
    symbol: symbol,
  });
  

  return graphic

}

