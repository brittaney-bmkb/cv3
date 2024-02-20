import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import PopupTemplate from "@arcgis/core/PopupTemplate.js";
import Basemap from "@arcgis/core/Basemap";
import { config } from "../../data/config";
import Query from "@arcgis/core/rest/support/Query";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer";


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

export async function createFeatureLayers(map){

    const namedLayers = {};

    config.layer_sources.forEach(source => {
        const name = source.layerName;
        //https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-FeatureLayer.html

        if(source.type === 'mapImageLayer'){
          namedLayers[name] = new MapImageLayer({
            url: source.url,
            opacity: source.opacity,
            sublayers: [
              {
                id:0,
                visible:true,
                minScale:source.minScale,
                renderer: source.render,
              
              }
            ]
          })

          // namedLayers[name] = mapImageLayer.findSublayerById(source.id)
        }
        else{
          namedLayers[name] = new FeatureLayer({
            url: source.url,
            outFields: source.outFields,
            // popupEnabled: source.popupEnabled,
            // popupTemplate : new PopupTemplate({
            //   title: source.popupTemplateTitle
            // }),
            //comment
            visible:true,
            renderer: source.render,
          minScale:source.minScale
            
          })
        }
      
        map.add(namedLayers[name])
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

