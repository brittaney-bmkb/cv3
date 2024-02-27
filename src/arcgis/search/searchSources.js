import LayerSearchSource from "@arcgis/core/widgets/Search/LayerSearchSource.js";
import LocatorSearchSource from "@arcgis/core/widgets/Search/LocatorSearchSource.js";
import { config } from "../../data/config";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";


export async function createSearchSources(namedLayers){

  let searchSources  = []
  let subLayer
  let mapImageLayer
  let layer
  const layerSearchSources = config.layer_sources.flatMap((layerSource) => {

    if(layerSource.type === 'mapImageLayer'){
      mapImageLayer = namedLayers[config.target_layer_name]
      subLayer = mapImageLayer.findSublayerById(0)
      layer = new FeatureLayer({
        url: subLayer.url
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

