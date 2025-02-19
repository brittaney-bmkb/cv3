import { createContext, useContext, useEffect, useReducer } from "react";
import AppReducer, { initialState } from '../reducers/AppReducer'
import { config } from "../data/config";
import { theme } from "../theme";
import { useSearchParams } from "react-router-dom";


export const AppContext = createContext(initialState)

export const AppProvider = ({children}) => {

    const [state, dispatch] = useReducer(AppReducer, initialState)

    const setComparableType = (comparableType) => {
        dispatch({
            type:"SET_COMPARABLE_TYPE",
             payload: {
                comparableType: comparableType,
            }
        })
    } 

    //get url parameters
    const [routeParams, setSearchParams] = useSearchParams();

    const setMapContainer = (ref) => {
        dispatch({
            type:"SET_MAP_CONTAINER",
             payload: {
                mapContainer: ref,
            }
        })
    } 

    const setMapViewScale= (view) => {
        dispatch({
            type:"SET_MAP_VIEW_SCALE",
            payload: {
                mapViewScale: view
            }
        })
    }

    const setMapView = (view) => {
        dispatch({
            type:"SET_MAP_VIEW",
            payload: {
                mapView: view
            }
        })
    }

    const setPrimaryResultFeature = (feature, newSearch=true) => {
        dispatch({
            type:"SET_PRIMARY_RESULT_FEATURE",
             payload: {
                primaryResultFeature: feature,
                newSearch: newSearch
            }
        })
    } 

    const setSecondaryResultFeature = (feature) => {
        dispatch({
            type:"SET_SECONDARY_RESULT_FEATURE",
             payload: {
                secondaryResultFeature: feature,
            }
        })
    } 

    const setCoordinates = (x, y) => {
        dispatch({
            type:"SET_COORDINATES",
             payload: {
                x: x,
                y: y,
            }
        })
    } 

    

    const setSearchResults = (results, features, searchTerm, prevSearchFeatures) => {
        dispatch({
            type:"SET_SEARCH_RESULT",
             payload: {
                searchResults: results,
                searchFeatures: features,
                searchTerm: searchTerm,
                prevSearchFeatures: prevSearchFeatures
            }
        })
    }
    


    const setSearchSources = async (searchSources) => {
        dispatch({
            type:"SET_SEARCH_SOURCES",
             payload: {
                searchSources: searchSources,
            }
        })
    }

    const setSearchBufferGeometry = async (searchResultPoint, searchBufferGeometry) => {
        dispatch({
            type:"SET_SEARCH_BUFFER_GEOMETRY",
            payload: {
                searchResultPoint: searchResultPoint, 
                searchBufferGeometry: searchBufferGeometry
            }
        })
    }

    const setPanelDisplay = (state) => {
        dispatch({
            type:"SET_PANEL_DISPLAY",
             payload: {
                panelDisplay: state,
            }
        })
    }

    const setPanelSecondaryVisibility = (visible) => {
        dispatch({
            type:"SET_PANEL_SECONDARY_VISIBILTIY",
             payload: {
                panelSecondaryVisible: visible,
            }
        })
    }

    const setPanelPrimaryVisibility = (visible) => {
        dispatch({
            type:"SET_PANEL_PRIMARY_VISIBILTIY",
             payload: {
                panelPrimaryVisible: visible,
            }
        })
    }

    const setPanelDisplaySecondary = (state) => {
        dispatch({
            type:"SET_PANEL_SECONDARY_DISPLAY",
             payload: {
                panelDisplaySecondary: state,
            }
        })
    }

    const setPanelWidgetVisibility = (visible) => {
        dispatch({
            type:"SET_PANEL_WIDGET_VISIBILTIY",
             payload: {
                panelWidgetVisible: visible,
            }
        })
    }

    const setPanelDisplayWidget = (state) => {
        dispatch({
            type:"SET_PANEL_WIDGET_DISPLAY",
             payload: {
                panelDisplayWidget: state,
            }
        })
    }

    const setDataDictionary = (features) => {
        dispatch({
            type:"SET_DATA_DICTIONARY",
             payload: {
                dataDictionary: features,
            }
        })
    }

    const setParcelQueryFields = (fields) => {
        dispatch({
            type:"SET_PARCEL_QUERY_FIELDS",
             payload: {
                parcelQueryFields: fields,
            }
        })
    }

    const setScreenWidth = (width) => {
        dispatch({
            type:"SET_SCREEN_WIDTH",
             payload: {
                screenWidth: width,
            }
        })
    }

    const setComparableParcels = (features) => {
        dispatch({
            type:"SET_COMPARABLE_PARCELS",
             payload: {
                comparableParcels: features,
            }
        })
    }

    const setNearbyParcels = (features) => {
        dispatch({
            type:"SET_NEARBY_PARCELS",
             payload: {
                nearby: features,
            }
        })
    }

    const setMeasureWidgetState = (state) => {
        dispatch({
            type:"SET_MEASURE_WIDGET_STATE",
             payload: {
                measureWidgetState: state,
            }
        })
    }

    const setLanguage = (language) => {
        dispatch({
            type:"SET_LANGUAGE",
             payload: {
                language: language,
            }
        })
    }

    const setTranslateDialogOpen = (open) => {
        dispatch({
            type:"SET_TRANSLATE_DIALOG_OPEN",
             payload: {
                translateDialogOpen: open,
            }
        })
    }

    const setTranslationDictionary = (dictionary) => {
        dispatch({
            type:"SET_TRANSLATE_DICTIONARY",
             payload: {
                textTranslationDictionary: dictionary,
            }
        })
    }

    const setShowMapMoblie = (show) => {
        dispatch({
            type:"SET_SHOW_MAP_MOBILE",
             payload: {
                showMapMobile: show,
            }
        })
    }

    const setMeasureWidget = (widget) => {
        dispatch({
            type:"SET_MEASURE_WIDGET",
             payload: {
                measureWidget: widget,
            }
        })
    }

    const setIsQuerying = (quering) => {
        dispatch({
            type:"SET_IS_QUERYING",
            payload: {
                isQuerying: quering 
            }
        })
    }

    const setMapPrintProps = (mapLayout, mapFormat, mapTitle) => {
        dispatch({
            type:"SET_MAP_PRINT_PROPS",
            payload: {
                mapLayout: mapLayout,
                mapFormat: mapFormat,
                mapTitle: mapTitle

            }
        })
    }

    const setOpenHelpDialog = (open) => {
        dispatch({
            type:"SET_OPEN_HELP_DIALOG",
            payload:{
                openHelpDialog: open,
            }
        })
    }

    const setSelectMultiple = (select) => {
        dispatch({
            type:"SET_SELECT_MULTIPLE",
            payload:{
                selectMultiple: select,
            }
        })
    }





    const loadMap = async () => {

        const {initializeMap, zoomToExtent} = await import('../arcgis/webmap/webmap')
        const {mapContainer, primaryResultFeature, comparableParcels} = state

        let view, searchSources = await initializeMap(mapContainer)

        //await loadDataDictionary()

        setMapView(view)
        setSearchSources(searchSources)
        if(!primaryResultFeature){
            setPrimaryResultFeature(null, true)
        }
        else{
            zoomToExtent(comparableParcels? comparableParcels: [primaryResultFeature])
        }
        
    }

    const translateSearchSources = async (searchSources) => {

        //const {language, textTranslationDictionary} = state

        //console.log("translated text:" , textTranslationDictionary)
        // Wait for all translations to complete using Promise.all
        await Promise.all(searchSources?.map(async (searchSource) => {
            console.log("translating search source layer name:", searchSource.name);
            let translatedName = await translateText(searchSource.name);    
            searchSource.name = translatedName;
            console.log("updated search source name: ", translatedName);

            console.log("original placeholder: ", searchSource.placeholder)
            let translatedPlaceholder = await translateText(searchSource.placeholder, true)
            console.log("translated placeholder: ", translatedPlaceholder)
            searchSource.placeholder = translatedPlaceholder;
            
    
            return searchSource;
        }));
    
        // Everything below this code will wait for the loop to finish
        console.log("Translation complete. Now continuing with other operations...");
        // Any other code you want to run after the loop

        return searchSources
    }

    const initalizeSearchSources = async () => {
            
        const { createSearchSources } = await import('../arcgis/search/searchSources')

        const { initalizeLayers } = await import('../arcgis/search/queryTargetLayer')

        await initalizeLayers()
        
        let searchSources = await createSearchSources()

        console.log("original search sources: ", searchSources)

        //handle text translation
       let updatedSearchSources =  await translateSearchSources(searchSources)

       console.log("updated search sources: ", updatedSearchSources)
    
        await setSearchSources(updatedSearchSources)

        return updatedSearchSources
    }

    const arrayAllSame = (array) => {

        if (array.every(value => value === null)) {
            return false;
        }    

        // Filter out null values from the array
        const filteredArray = array.filter(value => value !== null);

        // Use the every method to check if all elements are strictly equal to the previous element
        return filteredArray?.every((value, index, arr) => index === 0 || value === arr[index - 1]);
    }

    const attributesStartWithString = (array, attributeName, prefix) => {
        // Use the every method to check if all attributes start with the specified string
        //console.log(`checking if features ${attributeName} startswith: ${prefix}` )
        return array.every(obj => obj.attributes[attributeName].startsWith(prefix));
      };

    const extractDuplicates = async (array, attributeName) => {
    // Step 1: Extract PIN10 values
    let values = array.map(feature => feature.attributes[attributeName]);
    
    //console.log("values: ", values)
    
    // Step 2: Use a frequency counter to count occurrences of each PIN10
    let valueCounts = values.reduce((acc, pin) => {
        acc[pin] = (acc[pin] || 0) + 1;
        return acc;
    }, {});
    
    // Step 3: Filter out the PIN10 values that appear more than once
    let dups = Object.keys(valueCounts).filter(value => valueCounts[value] > 1);
    
    return dups
    
    }

    const returnSearchParam = async (primaryResultFeature) => {

        let features = Array.isArray(primaryResultFeature) ? primaryResultFeature : [primaryResultFeature]
        let attributes = features.length > 0 ? features[0].attributes : null
        let isMultiFeatures =  features.length > 1 ? true : false

        let paramValue = null
        let param = {}

        if(attributes){
            let pin10s = features?.map((feature) => feature.attributes["PIN10"])
            let addresses = features?.map((feature) => feature.attributes["street_address"])
            let pin10Match =  isMultiFeatures === true ? arrayAllSame(pin10s) : true
            let addressMatch =  isMultiFeatures === true ? arrayAllSame(addresses) : true
            //let pinsStringSimilar = isMultiFeatures === true ? attributesStartWithString(features, "PIN14_dash", searchTerm) : true
            
            //check if multiple parcels are selected
            if(isMultiFeatures === false){
                //single parcel selected so set pin to pin14
                paramValue = attributes["PIN14"]
                param = {"pin14": paramValue}
            }
            else if(isMultiFeatures === true && pin10Match === false){
                //Milestone 3.0.2 update removing address url param
                // && pinsStringSimilar === false
                //if there are multple features and pin10s do not match and pin14 dash are not the same
                // if(addressMatch === true){
                //     //if addresses are the same
                //     //console.log("addresses match")
                //     paramValue = attributes["street_address"]
                //     param = {"address": paramValue}
                // }
                // else{
                //if addresses and pin10 does not match
                //placing location param with list of pins
                //paramValue = `${x},${y}`
                //param = {"location": paramValue}

                //get list of all unique pins
                //check if any pin10 are the same and filter out pin14s
                //that start with pin10
                let pin14s = features.map(feature => feature.attributes['PIN14'])
                // let pin10Unique = [...new Set(pin10s)]
                ////console.log("Location Param - Unique pin10s: ", pin10Unique)
                let pin10Dups = await extractDuplicates(features, "PIN10")
                ////console.log("Location Param - Duplicate pin14s: ", pin14s)
                ////console.log("Location Param - Duplicate pin10s: ", pin10Dups)
                
                // Filter out PIN14 values that start with any values in pin10Dups
                let filteredPin14s = pin14s.filter(pin14 => !pin10Dups.some(pin10Dup => pin14.startsWith(pin10Dup)));
                ////console.log("Location Param - Filtered pin14s: ", filteredPin14s);
                let paramPins = [...filteredPin14s, ...pin10Dups]
                //console.log("Final list of url params = ", paramPins)

                paramValue = paramPins
                if(pin10Dups?.length > 0){
                    param["pin10"] = `'${pin10Dups.join("','")}'`
                }
                if(filteredPin14s?.length){
                    param["pin14"] = `'${filteredPin14s.join("','")}'`
                }
                //}
            }
            else if(isMultiFeatures === true && pin10Match === true){
                //paramValue = attributes["PIN10"]
                param = {"pin": paramValue}
            }
            else if(isMultiFeatures ===  true && pinsStringSimilar === true){
                //paramValue = searchTerm
                param = {"search" : searchTerm}
            }
        }

        //console.log("url param: ", param)

        return  param
    }


    const queryPolygon = async (polygon) => {

        const { panelDisplay, panelPrimaryVisible } = state

        const { queryTargetLayerByPolygon } = await import('../arcgis/search/queryTargetLayer')

        //console.log("querying target layer by polygon geometry: ", polygon)
        const features = await queryTargetLayerByPolygon(polygon)

        setPrimaryResultFeature(features)
        setSearchResults(null, features)

        if(!panelDisplay || panelDisplay !== "resultsList"){
            setPanelDisplay("resultsList")
        }
        
        if(!panelPrimaryVisible || panelPrimaryVisible === false){
            setPanelPrimaryVisibility(true)
        }

        //update url parameters
        console.log("setting url parameters for select multiple draw tool results")
        const  param = await returnSearchParam(features)
        console.log("new url param: ", param)
        setSearchParams(param)

    }


    //Function to query parcels based on mouse click point
    //in use [v3.0.0-beta.2]
    const queryMapPoint = async (point) => {
        
        // let fields 
        //console.log("Point from click: ", point)
        setCoordinates(point.x, point.y)
        //console.log("x/y", point.x, point.y)

        const { selectMultiple, 
            panelDisplaySecondary, 
            screenWidth, 
            panelSecondaryVisible, 
            panelPrimaryVisible, 
            panelDisplay, 
            parcelQueryFields, 
            comparableParcels, 
            searchFeatures
        } = state
        //const { peformQueryFeatures, createGraphic, zoomToExtent, removeGraphics } = await import('../arcgis/webmap/webmap')
        const { queryTargetLayerWithPointFeatures } = await import('../arcgis/search/queryTargetLayer')

        //console.log("Passing query fields: ", parcelQueryFields)

        // if(!parcelQueryFields){
        //     fields = await loadDataDictionary()
        // }
        // else{
        //     fields = parcelQueryFields
        // }

        //let selectedFeatures = await peformQueryFeatures(point, fields)
        let selectedFeatures = await queryTargetLayerWithPointFeatures(point)

        //console.log("Queried Features: ", selectedFeatures)

        //check if queried features are secondary comparables
        //console.log("comparableParcels: ", comparableParcels)

        let secondaryFeatures = []
        if(comparableParcels){
            secondaryFeatures = comparableParcels.filter((feature) => feature.attributes['PIN14'] === selectedFeatures[0].attributes['PIN14'])
            //console.log("Secondary feature selected: ", secondaryFeatures) 
        }

        if(secondaryFeatures?.length > 0){
            //console.log("found comparable features from mouse click: ", selectedFeatures)
            setSecondaryResultFeature(secondaryFeatures[0])

            if(screenWidth < theme.breakpoints.values.lg){
                setPanelDisplay("propertyDetailNearby")
            }
            else{
                setPanelDisplaySecondary("propertyDetailNearby")
            }
            
            //createGraphic(secondaryFeatures, "secondarySelected", theme.palette.secondary.main)
            //zoomToExtent([secondaryFeatures[0], primaryResultFeature])
        }
    

        else{

            let resultFeatures = selectedFeatures

            if(selectMultiple && primaryResultFeature){
                //console.log("multiple features selected")
                let features = Array.isArray(primaryResultFeature) ? primaryResultFeature : [primaryResultFeature]
                resultFeatures = [...features, ...selectedFeatures]
            }

            setPrimaryResultFeature(resultFeatures, false)
            setSearchResults(null, resultFeatures)
            //createGraphic(selectedFeatures, "primary", theme.palette.primary.main)
            //zoomToExtent(selectedFeatures)

            if(!panelDisplay || panelDisplay !== "resultsList"){
                setPanelDisplay("resultsList")
            }
        
            
            if(!panelPrimaryVisible || panelPrimaryVisible === false){
                setPanelPrimaryVisibility(true)
            }

            if(panelSecondaryVisible === true && ["propertyDetailNearby","propertyDetailComparable","resultsListNearby","resultsListComparables","nearbyProperties","comparablePropertySearch"].includes(panelDisplaySecondary)){
                setPanelSecondaryVisibility(false)
            }
            
            if(comparableParcels){
                clearResultsComparables()
            } 
        }

    }

    //Function to return parcel features using x/x coordinates
    //in use [v3.0.0-beta.2]
    //deprecated in [v3.0.0-beta-3]
    const returnLocationFeatures = async (coordinates) => {

        //console.log("Returning location features")
        const { queryTargetLayerWithCoordinates } = await import("../arcgis/search/queryTargetLayer")

        const { panelDisplay, panelPrimaryVisible } = state

        let features = await queryTargetLayerWithCoordinates(coordinates)
        //console.log("target features from x/y: ", features)

        setPrimaryResultFeature(features, true)
        setSearchResults(null, features, null)

        if(!panelDisplay || panelDisplay !== "resultsList"){
            setPanelDisplay("resultsList")
        }
        
        if(!panelPrimaryVisible || panelPrimaryVisible === false){
            setPanelPrimaryVisibility(true)
        }
    }

    const returnFeaturesByPin10Pin14 = async (pin10, pin14) => {

        const { queryTargeLayerWithPin10Pin14 } = await import("../arcgis/search/queryTargetLayer")

        const { panelDisplay, panelPrimaryVisible } = state

        let features = await queryTargeLayerWithPin10Pin14(pin10, pin14)

        setPrimaryResultFeature(features, true)
        setSearchResults(null, features, null)

        if(!panelDisplay || panelDisplay !== "resultsList"){
            setPanelDisplay("resultsList")
        }
        
        if(!panelPrimaryVisible || panelPrimaryVisible === false){
            setPanelPrimaryVisibility(true)
        }

        return features
    }

    // Function to check if any properties attributes['PIN14'] are included in another array of objects
    const anyAttributesIncluded = (array1, array2) => {
        // Extract the attributes['PIN14'] values from the first array
        const attributes1 = array1.map(obj => obj.attributes['PIN14']);

        // Iterate over each object in the second array and check if its attributes['PIN14'] value is included in the attributes1 array
        for (let obj of array2) {
            if (attributes1.includes(obj.attributes['PIN14'])) {
                return true; // If a match is found, return true
            }
        }

        return false; // If no match is found, return false
    }
  
    
    const loadDataDictionary = async () => {

        const { readFeatureLayerData } = await import('../arcgis/layers/layers')

        //const { parcelQueryFields } = state

        let { features } = await readFeatureLayerData(config.data_dictionary, ["*"], "field IS NOT NULL")

        ////console.log("DATA DICTIONARY: ", features)
        setDataDictionary(features)

        //to do make sure pin10 id field is included
        //improve this
        //added bclass here because it was no longer being pulled from data dictionary
        let fields = [config.target_layer_id_field,'BCLASS']
        let queryFields = [...fields, ...new Set(features.filter((feature) => feature.attributes['category'] !== null && feature.attributes['type'] !== "calc" && feature.attributes['type'] !== "button")
                                          .map((feature) => feature.attributes['field'].trim())),
                                          ...new Set(features.filter((feature) => feature.attributes['hyperlink_params'] !== null)
                                          .map((feature) => feature.attributes['hyperlink_params'].trim()))]

        ////console.log("Query Fields: ", queryFields)
        //setParcelQueryFields(queryFields)

        ////console.log("loadDataDictionary - parcel query fields: ", parcelQueryFields)
        return queryFields
    }

    const selectResultFromList = async (result) => {
        //console.log("Result PIN : ", result)
        const { searchFeatures, searchTerm, prevSearchFeatures } = state
        const selectedFeature = searchFeatures.filter((feature) => feature.attributes['PIN14_dash'] == result)
        //console.log("selectedFeature: ", selectedFeature)

        setPrimaryResultFeature(selectedFeature, true)

        //console.log("previous search term: ", searchTerm)
        //console.log("previous search features: ", prevSearchFeatures)
        //console.log("search features: ", searchFeatures )
        
        setSearchResults(null, searchFeatures, searchTerm, searchFeatures)
  
        // //update graphic in map
        // const { createGraphic } = await import('../arcgis/webmap/webmap')

        // createGraphic(selectedFeature, "primary", theme.palette.primary.main)
    }

    const addSecondaryFeatureToMap = async () => {
        const { secondaryResultFeature, primaryResultFeature, comparableParcels } = state

        //update graphic in map
        const { createGraphic, zoomToExtent, updateSecondaryGraphic } = await import('../arcgis/webmap/webmap')
        const { theme } = await import ('../theme')

        //console.log("creating new graphic for selectedFeature: ", secondaryResultFeature)

        const secondaryPIN14 = secondaryResultFeature.attributes['PIN14']

        const secondaryParcels = comparableParcels.filter(parcel => parcel.attributes["PIN14"] !== secondaryPIN14 )
        createGraphic(secondaryParcels, "secondary", theme.palette.secondary.main)

        createGraphic([secondaryResultFeature], "secondarySelected", theme.palette.secondary.main)
        //updateSecondaryGraphic(whereQuery)
        zoomToExtent([secondaryResultFeature, primaryResultFeature])
    }

    const toggleMapLayer = async (layerName) => {

        //update graphic in map
        const { toggleLayer } = await import('../arcgis/webmap/webmap')

        toggleLayer(layerName)
    }

    //Function to return comparable parcel features
    //in use [v3.0.0-beta.2]
    const returnSearchResultFeatures = async (results, newSearchTerm) => {

        const { handleMultipleResults, isAddressLocator } = await import('../arcgis/search/queryTargetLayer')
        const { returnBufferGeometry } = await import('../arcgis/geoprocessing/geoprocessing')
    
        //console.log("Performing new target layer query")
        setSearchBufferGeometry(null, null)
        
        const{ targetFeatures } = await handleMultipleResults(results)

        //console.log("target features returned: ", targetFeatures)
        //console.log("results returned: ", results)

        setPrimaryResultFeature(targetFeatures, true)


        //console.log("seting previous feature: ", targetFeatures)
        setSearchResults(results, targetFeatures, newSearchTerm, targetFeatures)
        //}

        //created buffer graphic here
        //if results include Address Locator source
        //update state of searchBuffer and pass point geometries
        
        const addressLocatorResultGeometry = results.filter(result => isAddressLocator(result.source.name))
                                             .flatMap(filteredResults => filteredResults.results)
                                             .map(flattenedResults => flattenedResults.feature.geometry)
        
        
        const bufferGeometries = await Promise.all(addressLocatorResultGeometry.map(async(geometry) => {

            console.log("buffer geometry: ", geometry)
            return await returnBufferGeometry(geometry, config.buffer_distance, config.buffer_unit)

        }))

        console.log("address locator buffer geometries calculated: ", bufferGeometries)
        setSearchBufferGeometry(addressLocatorResultGeometry, bufferGeometries)

    }

    const renderSearchResults = async (searchWidgetResults) => {

        //console.log("FUNCTION: renderSearchResults" )
        let fields
        const { querySearchResults } = await import('../arcgis/webmap/webmap')
        const { parcelQueryFields, panelDisplay, primaryResultFeature } = state

        //console.log("Query Fields: ", parcelQueryFields)
        if(!parcelQueryFields){
            fields = await loadDataDictionary()
        }
        else{
            fields = parcelQueryFields
        }

        const features = await querySearchResults(searchWidgetResults, fields)

        //console.log("queried features: ", features)
        setSearchResults(searchWidgetResults, features)

        //if(!primaryResultFeature){
            setPrimaryResultFeature(features, true)
        //}

        if(panelDisplay !== "resultsList"){
            setPanelDisplay("resultsList")
        }
        
    }

    const clearResults = async () => {
        //const { removeGraphics } = await import('../arcgis/webmap/webmap')
        
        const {panelDisplaySecondary} = state

        setPrimaryResultFeature(null, true)
        setSearchResults(null, null)
        //clear search params
        setSearchParams({})
        //removeGraphics("primary");
        //removeGraphics("secondary");
        setPanelDisplay("resultsList")
        setSearchBufferGeometry(null, null)

        if(["comparablePropertySearch", "nearbyProperties", "resultsListComparables", "resultsListNearby", "propertyDetailComparable", "propertyDetailNearby"].includes(panelDisplaySecondary)){
            //console.log("CLEAR RESULTS: closing secondary panel. Secondary Panel =", panelDisplaySecondary )
            setPanelSecondaryVisibility(false)
        }

        //setSearchParams()

        const updatedUrl = `${window.location.pathname}`;

        // Use history.pushState to update the URL without refreshing the page
        window.history.pushState({ path: updatedUrl }, '', updatedUrl);

        //setIsQuerying(false)
    }

    const clearResultsComparables = async () => {
        //const { removeGraphics } = await import('../arcgis/webmap/webmap')

        //const { comparableParcels} = state
        setComparableParcels(null)
        setPanelSecondaryVisibility(false)

        //removeGraphics("secondary")

       
    }

    //Function to return comparable parcel features
    //in use [v3.0.0-beta.2]
    const searchComparableProperties = async (whereQuery, searchDistance) => {

        const { compareProperities } = await import('../arcgis/search/queryTargetLayer')

        const { primaryResultFeature, parcelQueryFields, screenWidth, comparableParcels } = state     

        let features = await compareProperities(whereQuery, searchDistance, primaryResultFeature, parcelQueryFields)

        setComparableParcels(features)

        //console.log("New Comparable features: ", state.comparableParcels)

        if(screenWidth < theme.breakpoints.values.lg){
            setPanelPrimaryVisibility(true)
            setPanelDisplay("resultsListComparables")
        }
        else if (screenWidth >= theme.breakpoints.values.lg){
            setPanelSecondaryVisibility(true)
            setPanelDisplaySecondary("resultsListComparables")
        }
    }

    //Function to return nearby parcel features
    //in use [v3.0.0-beta.2]
    const searchNearbyProperties = async (searchDistance, units) => {
        setIsQuerying(true)
        const { nearbyProperties } = await import('../arcgis/search/queryTargetLayer')
        const { primaryResultFeature, parcelQueryFields } = state  
        //console.log(`Searching for properties within ${searchDistance}`)

        
        let nearbyParcels = await nearbyProperties( searchDistance, units, primaryResultFeature, parcelQueryFields)
    
        setComparableParcels(nearbyParcels)
        setIsQuerying(false)
    }

    const translateText = (text, skipNum) => {

        const {language, textTranslationDictionary} = state

        //console.log(textTranslationDictionary)
        const textIsNotNumber = Number.isNaN(parseInt(text))

        if(text && textTranslationDictionary && textIsNotNumber){
            
            if(Object.keys(textTranslationDictionary).includes(text)){

                //console.log("TRANSLATED TEXT: ", text, textTranslationDictionary[text][language])
                return textTranslationDictionary[text][language]
            }

            else{
                ////console.log("text to translate: ", text)
                let numericValues
                let textToReplace = text
                if(text.match(/\d+/g) && !text.includes("-") && !skipNum){
                //&& text.match(/[()]/g)){
                    numericValues = text.match(/\d+/g)

                    //replace numeric and parentheses 
                    textToReplace = text.replace(numericValues, "").replace(/[()]/g, "").trim()

                    ////console.log("Found numeric values: ", numericValues, textToReplace)
                }

                let translation = Object.values(textTranslationDictionary).filter(textReplace => 
                    textReplace[config.defaultLanguage] === textToReplace)
                    .map((textReplace)=> {
                        return textReplace[language]
                    })

                //console.log("TRANSLATED TEXT: ", translation)
                if(translation && translation.length){
                    if(numericValues && text !== config.bannerHeader){
                        if(text.match(/[()]/g)){
                            return `${numericValues} (${ translation[0]})`
                        }
                        
                        else {
                            return `${numericValues} ${translation[0]}`
                        }
                        
                    }
                    else{
                        return translation[0]
                    }

                }
                else{
                    return text
                }
                

                //return translation && translation.length > 0 ? translation[0] : text
            }
    
            
        }
        else{
            return text
        }
    }


    const value = {
        mapContainer: state.mapContainer,
        loadMap,
        setMapContainer,
        setMapView,
        setMapViewScale,
        mapViewScale: state.mapViewScale,
        mapView: state.mapView,
        primaryResultFeature: state.primaryResultFeature,
        setPrimaryResultFeature,
        setSearchResults,
        searchSources: state.searchSources,
        searchResults: state.searchResults,
        prevSearchFeatures: state.prevSearchFeatures,
        searchTerm: state.searchTerm,
        searchResultPoint: state.searchResultPoint,
        searchBufferGeometry: state.searchBufferGeometry,
        setSearchBufferGeometry,
        setSearchSources,
        renderSearchResults,
        clearResults,
        searchFeatures: state.searchFeatures,
        setPanelDisplay,
        panelDisplay: state.panelDisplay,
        setPanelSecondaryVisibility,
        panelSecondaryVisible: state.panelSecondaryVisible,
        panelDisplaySecondary: state.panelDisplaySecondary,
        setPanelDisplaySecondary,
        selectResultFromList,
        searchComparableProperties,
        setPanelPrimaryVisibility,
        panelPrimaryVisible: state.panelPrimaryVisible,
        loadDataDictionary,
        dataDictionary: state.dataDictionary,
        parcelQueryFields: state.parcelQueryFields, 
        setParcelQueryFields,
        screenWidth: state.screenWidth,
        setScreenWidth,
        newSearch: state.newSearch,
        searchNearbyProperties,
        comparableParcels: state.comparableParcels,
        secondaryResultFeature: state.secondaryResultFeature,
        setSecondaryResultFeature,
        clearResultsComparables,
        addSecondaryFeatureToMap,
        setMeasureWidgetState,
        measureWidgetState: state.measureWidgetState,
        toggleMapLayer,
        setLanguage,
        language: state.language,
        setTranslateDialogOpen,
        translateDialogOpen: state.translateDialogOpen,
        textTranslationDictionary: state.textTranslationDictionary,
        setTranslationDictionary,
        translateText,
        showMapMobile: state.showMapMobile,
        setShowMapMoblie,
        setMeasureWidget,
        measureWidget: state.measureWidget,
        isQuerying: state.isQuerying,
        setIsQuerying,
        setMapPrintProps,
        mapTitle: state.mapTitle,
        mapLayout: state.mapLayout,
        mapFormat: state.mapFormat,
        setCoordinates,
        x: state.x,
        y: state.y,
        returnLocationFeatures, 
        setOpenHelpDialog,
        openHelpDialog: state.openHelpDialog,
        setPanelWidgetVisibility,
        setPanelDisplayWidget,
        panelWidgetVisible: state.panelWidgetVisible,
        panelDisplayWidget: state.panelDisplayWidget,
        queryMapPoint,
        setComparableParcels,
        initalizeSearchSources,
        returnSearchResultFeatures,
        anyAttributesIncluded,
        setSelectMultiple,
        selectMultiple: state.selectMultiple,
        queryPolygon,
        setComparableType,
        comparableType: state.comparableType,
        returnFeaturesByPin10Pin14,
        returnSearchParam
    }

    // useEffect( () => {

    //     const initalizeSearchSources = async () => {
            
    //         const { initializeLayersAndSearchSources} = await import('../arcgis/webmap/webmap')
    //         let searchSources = await initializeLayersAndSearchSources()

    //         await setSearchSources(searchSources)
    //     }
        
    //     initalizeSearchSources()

    // }, [])

    useEffect(() => {
        //on initial load display info panel

        setPanelPrimaryVisibility(true)
        setPanelDisplay("info")
        
    }, [])

    useEffect(() => {
        const loadParcelFields = async () => {
            let fields = await loadDataDictionary()
            setParcelQueryFields(fields)
            //console.log("Parcel query fields: ", fields)
        }

        loadParcelFields();
        //console.log("Parcel query fields: ", state.parcelQueryFields)
      },[])


    
    useEffect(() => {
        const handleResize = () => {
            //console.log("Resize event triggered");
            const width = window.innerWidth
            //console.log("window width: ", width)
            setScreenWidth(width)
        }
    
        window.addEventListener('resize', handleResize);

        handleResize();
        
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, [window.innerWidth]);


      useEffect(() => {
        const initializeTranslationText = async () => {
            
            const { returnTranslatedText } = await import ('../translation/handleTranslation')
            const { readFeatureLayerData } = await import('../arcgis/layers/layers')

            //general translated text
            let { features } = await readFeatureLayerData(config.translation_text, ["*"], "english IS NOT NULL", false)
            let generalText = await returnTranslatedText(features)

            //help translated text
            let helpData = await readFeatureLayerData(config.translation_text_help, ["*"], "english IS NOT NULL", false)
            let helpText = await returnTranslatedText(helpData.features)

            ////console.log("translated help text: ", helpText)

            let text = {
                ...generalText,
                ...helpText
            }

            setTranslationDictionary(text)
            

            // setPanelDisplay("info")
            // if(!state.primaryResultFeature){
            //     setPanelDisplay("info")
            // }
            // else{
            //     setPanelDisplay("resultsList")
            // }
            
        }
    
         initializeTranslationText();

      }, []);




    //   useEffect(() => {

    //     if(state.panelDisplayWidget !== "measureWidget" || state.panelWidgetVisible === false){
    //         //console.log("Measure Widget: ", state.measureWidget)
    //         if(state.measureWidgetState && state.measureWidget){
    //             await setMeasureWidgetState(null)
    //             await state.measureWidget.when()
    //             await state.measureWidget.clear()
    //         }
            
            
    //     }
    
    //   }, [state.panelDisplayWidget, state.panelWidgetVisible])

    // useEffect(() => {
    //     const clearMeasureWidget = async () => {
    //         if (state.panelDisplayWidget !== "measureWidget" || state.panelWidgetVisible === false) {
    //             ////console.log("Measure Widget: ", state.measureWidget);
    //             if (state.measureWidget) {
    //                 //console.log("Measure Widget: ", state.measureWidget);
    //                 // await state.measureWidget.when();
    //                 state.measureWidget.clear();
    //                 //console.log("Destroying Measure Widget: ");
    //                 state.measureWidget.destroy();
    //                 //setMeasureWidget(null)
    //                 setMeasureWidgetState(null);
    //             }
    //         }
    //     };
    
    //     clearMeasureWidget();
    // }, [state.panelDisplayWidget, state.panelWidgetVisible, state.measureWidget]);
    

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>

}

export default function UseAppContext(){
    const context = useContext(AppContext)
    if (context === undefined){
        throw new Error("UseAppContext must be used within AppContext");
    }
    return context
}
