import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import PopupTemplate from "@arcgis/core/PopupTemplate.js";
import { appConfig } from '../config';
import Basemap from "@arcgis/core/Basemap";


export async function createFeatureLayers(map){

    const namedLayers = {};

    appConfig.LayerSources.forEach(source => {
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
            id:appConfig.Basemap,
            portal:appConfig.Portal
          }
    })
}

