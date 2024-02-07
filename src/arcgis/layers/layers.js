import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import PopupTemplate from "@arcgis/core/PopupTemplate.js";
import Basemap from "@arcgis/core/Basemap";
import { config } from "../../data/config";
import Query from "@arcgis/core/rest/support/Query";

export async function readFeatureLayerData(url, outFields, where){

  let layer = new FeatureLayer({
    url: url,
    outFields: outFields,
  })

  let query = new Query()
  query.where = where
  query.returnGeometry = false
  query.outFields = ["*"]

  let queryResult = await layer.queryFeatures(query)
  console.log("data dicationary query result ", queryResult)

  return queryResult
}

export async function createFeatureLayers(map){

    const namedLayers = {};

    config.layer_sources.forEach(source => {
        const name = source.layerName;
        //https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-FeatureLayer.html
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

