import LayerSearchSource from "@arcgis/core/widgets/Search/LayerSearchSource.js";
import LocatorSearchSource from "@arcgis/core/widgets/Search/LocatorSearchSource.js";
import { config } from "../../data/config";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer";


export async function createSearchSources(){

  let searchSources  = []
  let subLayer
  let mapImageLayer
  let layer

  const layerSearchSources = config.layer_sources.flatMap((layerSource) => {

    if(layerSource.type === 'mapImageLayer'){
      //mapImageLayer = namedLayers[config.target_layer_name]
      // mapImageLayer = new MapImageLayer({
      //   url: layerSource.url,
      //   title: layerSource.layerName,
      //   sublayers: [
      //     {
      //       id: layerSource.index
      //     }
      //   ]
      // })
      // subLayer = mapImageLayer.findSublayerById(0)
      layer = new FeatureLayer({
        url: `${layerSource.url}/${layerSource.index}`
      })
    }

    else{
      layer = new FeatureLayer({
        url: layerSource.url
      })
    }

    return layerSource.searchSources.map(searchSource => {
  
      return new LayerSearchSource({
        layer: layer,
        displayField: searchSource.displayField,
        exactMatch: searchSource.exactMatch,
        maxResults: searchSource.maxResults,
        maxSuggestions: searchSource.maxSuggestions,
        minSuggestCharacters: searchSource.minSuggestCharacters,
        name: searchSource.name,
        outFields: searchSource.outFields,
        orderByFields: searchSource.orderByFields,
        popupEnabled: layerSource.popupEnabled,
        searchFields: searchSource.searchFields,
        suggestionsEnabled: searchSource.suggestionsEnabled,
        autoNavigate: searchSource.autoNavigate,
        searchTemplate: searchSource.searchTemplate,
        suggestionTemplate: searchSource.suggestionTemplate
      })
    })
  })

  const locatorSearchSources = config.locator_search_sources.map(locatorSource => {
    return new LocatorSearchSource({
      apiKey: locatorSource.apiKey,
      autoNavigate: locatorSource.autoNavigate,
      maxResults: locatorSource.maxResults,
      maxSuggestions: locatorSource.maxSuggestions,
      minSuggestCharacters: locatorSource.minSuggestCharacters,
      name: locatorSource.name,
      outFields: locatorSource.outFields,
      singleLineFieldName: locatorSource.singleLineFieldName,
      suggestionsEnabled: locatorSource.suggestionsEnabled,
      url: locatorSource.url
    })
  })
  
  // Combine layerSearchSources and locatorSearchSources into a single array
  searchSources = [...layerSearchSources, ...locatorSearchSources];

  return searchSources

}

