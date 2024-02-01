import LayerSearchSource from "@arcgis/core/widgets/Search/LayerSearchSource.js";
import LocatorSearchSource from "@arcgis/core/widgets/Search/LocatorSearchSource.js";
import { config } from "../../data/config";


export async function createSearchSources(namedLayers){

  let searchSources  = []
  const layerSearchSources = config.layer_sources.flatMap((layerSource) => {

    return layerSource.searchSources.map(searchSource => {
  
      return new LayerSearchSource({
        layer: namedLayers[layerSource.layerName],
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
        autoNavigate: searchSource.autoNavigate
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

