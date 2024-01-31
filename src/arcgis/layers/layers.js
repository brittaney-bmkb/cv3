import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import PopupTemplate from "@arcgis/core/PopupTemplate.js";
import Basemap from "@arcgis/core/Basemap";
import { config } from "../../data/config";


export async function createFeatureLayers(map){

    const namedLayers = {};

    config.layer_sources.forEach(source => {
        const name = source.layerName;
        namedLayers[name] = new FeatureLayer({
          url: source.url,
          outFields: source.outFields,
          popupEnabled: source.popupEnabled,
          popupTemplate : new PopupTemplate({
            title: source.popupTemplateTitle
          })
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

