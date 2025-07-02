import { createContext, useContext, useEffect, useReducer, useRef } from "react";
import AppReducer, { initialState } from '../reducers/AppReducer'
import { config } from "../data/config";
import { theme } from "../theme";
import { useSearchParams } from "react-router-dom";
import * as intl from "@arcgis/core/intl.js";



export const AppContext = createContext(initialState)

export const AppProvider = ({children}) => {

    const [state, dispatch] = useReducer(AppReducer, initialState)

    const arcgisMapRef = useRef(null)
    //create a reference to the search widget DOM element
    const refSearch = useRef(null)

    const setInfoPanel = (open) => {
        dispatch({
            type:"SET_INFO_PANEL",
             payload: {
                infoPanelClosed: open,
            }
        })
    } 

    const setSearchResultsPanel = (open) => {
        dispatch({
            type:"SET_SEARCH_RESULTS_PANEL",
             payload: {
                searchResultsPanelClosed: open,
            }
        })
    } 

    const setPropertyDetailPanel = (open) => {
        dispatch({
            type:"SET_PROPERTY_DETAIL_PANEL",
             payload: {
                propertyDetailPanelClosed: open,
            }
        })
    } 

    const setComparablePanel = (open) => {
        dispatch({
            type: "SET_COMPARABLE_PANEL",
            payload: {
                comparablePanelClosed: open
            }
        })
    }

    const setNearbyPanel = (open) => {
        dispatch({
            type: "SET_NEARBY_PANEL",
            payload: {
                nearbyPanelClosed: open
            }
        })
    }

    const setComparisonResultsPanel = (open) => {
        dispatch({
            type: "SET_COMPARISON_RESULTS_PANEL",
            payload: {
                comparisonResultsClosed: open
            }
        })
    }

    const setComparisonDetailPanel = (open) => {
        dispatch({
            type: "SET_COMPARISON_DETAIL_PANEL",
            payload: {
                comparisonDetailPanelClosed: open
            }
        })
    }

    const setLayersPanel = (open) => {
        dispatch({
            type: "SET_LAYERS_PANEL",
            payload: {
                layersPanelClosed: open
            }
        })
    }

    const setImageryPanel = (open) => {
        dispatch({
            type: "SET_IMAGERY_PANEL",
            payload: {
                imageryPanelClosed: open
            }
        })
    }

    const setPrintPanel = (open) => {
        dispatch({
            type: "SET_PRINT_PANEL",
            payload: {
                printPanelClosed: open
            }
        })
    }

    const setMeasurePanel = (open) => {
        dispatch({
            type: "SET_MEASURE_PANEL",
            payload: {
                measurePanelClosed: open
            }
        })
    }

    const setSelectPanel = (open) => {
        dispatch({
            type: "SET_SELECT_PANEL",
            payload: {
                selectPanelClosed: open
            }
        })
    }

    const setExportOpen = (open, source) => {
        dispatch({
            type: "SET_EXPORT_DIALOG",
            payload: {
                exportOpen: open,
                exportDataSource: source
            }
        })
    }

    const setFeedbackDialog = (open, source) => {
        dispatch({
            type: "SET_FEEDBACK_DIALOG",
            payload: {
                feedbackOpen: open,
                feedbackSource: source
            }
        })
    }

    const setTourDialogOpen = (open) => {
        dispatch({
            type: "SET_TOUR_OPEN",
            payload: {
                tourDialogOpen: open,
            }
        })
    }

    const setSuppressTourDialog = (suppress) => {
        dispatch({
            type: "SET_SUPPRESS_TOUR_DIALOG",
            payload: {
                suppressTourDialog: suppress,
            }
        })
    }

    const setHelpPanel = (open) => {
        dispatch({
            type: "SET_HELP_PANEL",
            payload: {
                helpPanelClosed: open,
            }
        })
    }

    const setIsMobile = (sm) => {
        dispatch({
            type: "SET_MOBILE",
            payload: {
                isMobile: sm,
            }
        })
    }

    // const setVisibleParcelYears = (list) => {
    //     dispatch({
    //         type: "SET_VISIBLE_PARCEL_YEARS",
    //         payload: {
    //             visibleParcelYears: list,
    //         }
    //     })
    // }

    const togglePanel = (panelName) => {

        const { prevSearchFeatures, searchFeatures, primaryResultFeature, searchTerm, newSearch, isMobile } = state

        switch (panelName) {
            case 'all':
                setLayersPanel(true);
                setComparablePanel(true);
                setNearbyPanel(true);
                setImageryPanel(true)
                setPrintPanel(true)
                setSelectPanel(true)
                setComparisonResultsPanel(true)
                setComparisonDetailPanel(true)
                setInfoPanel(true);
                setPropertyDetailPanel(true);
                setSearchResultsPanel(true);

                break;
          case 'info':
            setInfoPanel(false);
            setPropertyDetailPanel(true);
            setSearchResultsPanel(true);
            if(isMobile){
                setComparablePanel(true);
                setNearbyPanel(true);
            }
            break;

          case 'property':
            if(!primaryResultFeature || !primaryResultFeature[0]){
                setPrimaryResultFeature(searchFeatures)
            }
            setPropertyDetailPanel(false);
            setInfoPanel(true);
            setSearchResultsPanel(true);
            if(isMobile){
                setComparablePanel(true);
                setNearbyPanel(true);
            }
            break;

          case 'search':
            ////console.log("Toggling to search to display search results. New search: ", newSearch)
            // if(!newSearch){
            //     ////console.log("Toggling to search to display previous features. New search: ", newSearch)
            //     setPrimaryResultFeature(prevSearchFeatures ? prevSearchFeatures : primaryResultFeature)
            //     if (searchTerm) setSearchParams({'search': searchTerm})
            // }
            
            setSearchResultsPanel(false);
            setInfoPanel(true);
            setPropertyDetailPanel(true);
            if(isMobile){
                setComparablePanel(true);
                setNearbyPanel(true);
            }
            break;

        case 'nearby':
            setLayersPanel(true);
            setComparablePanel(true);
            setNearbyPanel(false);
            setImageryPanel(true)
            setPrintPanel(true)
            setMeasurePanel(true)
            setSelectPanel(true)
            setComparisonResultsPanel(true)
            setComparisonDetailPanel(true)
            if(isMobile){
                setInfoPanel(true);
                setPropertyDetailPanel(true);
                setSearchResultsPanel(true);

            }
            break;

        case 'compare':
            setLayersPanel(true);
            setComparablePanel(false);
            setNearbyPanel(true);
            setImageryPanel(true)
            setPrintPanel(true)
            setMeasurePanel(true)
            setSelectPanel(true)
            setComparisonResultsPanel(true)
            setComparisonDetailPanel(true)
            if(isMobile){
                setInfoPanel(true);
                setPropertyDetailPanel(true);
                setSearchResultsPanel(true);

            }
            break;
        case 'compareResults':
            setLayersPanel(true);
            setComparablePanel(true);
            setNearbyPanel(true);
            setImageryPanel(true)
            setPrintPanel(true)
            setMeasurePanel(true)
            setSelectPanel(true)
            setComparisonResultsPanel(false)
            setComparisonDetailPanel(true)
            break;

        case 'compareProperty':
            setLayersPanel(true);
            setComparablePanel(true);
            setNearbyPanel(true);
            setImageryPanel(true)
            setPrintPanel(true)
            setMeasurePanel(true)
            setSelectPanel(true)
            setComparisonResultsPanel(true)
            setComparisonDetailPanel(false)
            break;

        case 'layers':
            setLayersPanel(false);
            setComparablePanel(true);
            setNearbyPanel(true);
            setImageryPanel(true)
            setPrintPanel(true)
            setMeasurePanel(true)
            setSelectPanel(true)
            setComparisonResultsPanel(true)
            setComparisonDetailPanel(true)
            break;
            
        case 'imagery':
            setLayersPanel(true);
            setComparablePanel(true);
            setNearbyPanel(true);
            setImageryPanel(false)
            setPrintPanel(true)
            setMeasurePanel(true)
            setSelectPanel(true)
            setComparisonResultsPanel(true)
            setComparisonDetailPanel(true)
            break; 

        case 'print':
            setLayersPanel(true);
            setComparablePanel(true);
            setNearbyPanel(true);
            setImageryPanel(true)
            setPrintPanel(false)
            setMeasurePanel(true)
            setSelectPanel(true)
            setComparisonResultsPanel(true)
            setComparisonDetailPanel(true)
            break; 

        case 'select':
            setLayersPanel(true);
            setComparablePanel(true);
            setNearbyPanel(true);
            setImageryPanel(true)
            setPrintPanel(true)
            setMeasurePanel(true)
            setSelectPanel(false)
            setComparisonResultsPanel(true)
            setComparisonDetailPanel(true)
            break; 


        case 'tour':
            setTourDialogOpen(true)
            break; 

        case 'help':
            setHelpPanel(false)
            break; 

        case 'measure':
            setLayersPanel(true);
            setComparablePanel(true);
            setNearbyPanel(true);
            setImageryPanel(true)
            setPrintPanel(true)
            setMeasurePanel(false)
            setSelectPanel(true)
            setComparisonResultsPanel(true)
            setComparisonDetailPanel(true)
            break; 

          default:
            break;
        }
      };

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

    /**
     * Translates search source names and placeholders into the current language.
     * @param {Array} searchSources - List of search source objects to translate.
     * @returns {Promise<Array>} - The updated search sources with translated names.
     */
    const translateSearchSources = async (searchSources) => {
        // Wait for all translations to complete using Promise.all
        await Promise.all(searchSources?.map(async (searchSource) => {
            //////console.log("translating search source layer name:", searchSource.name);
            let translatedName = await translateText(searchSource.name);    
            searchSource.name = translatedName;
            //////console.log("updated search source name: ", translatedName);

            //////console.log("original placeholder: ", searchSource.placeholder)
            let translatedPlaceholder = await translateText(searchSource.placeholder, true)
            //////console.log("translated placeholder: ", translatedPlaceholder)
            searchSource.placeholder = translatedPlaceholder;
            
    
            return searchSource;
        }));
    
        // Everything below this code will wait for the loop to finish
        //////console.log("Translation complete. Now continuing with other operations...");
        // Any other code you want to run after the loop

        return searchSources
    }

    /**
     * Initializes search sources by creating them and applying translations.
     * @returns {Promise<Array>} - The updated and translated search sources.
     */
    const initalizeSearchSources = async () => {
            
        const { createSearchSources } = await import('../arcgis/search/searchSources')

        const { initalizeLayers } = await import('../arcgis/search/queryTargetLayer')

        await initalizeLayers()
        
        let searchSources = await createSearchSources()

        //////console.log("original search sources: ", searchSources)

        //handle text translation
       let updatedSearchSources =  await translateSearchSources(searchSources)

       //////console.log("updated search sources: ", updatedSearchSources)
    
        await setSearchSources(updatedSearchSources)

        return updatedSearchSources
    }

    /**
     * Checks if all elements in an array are the same, ignoring null values.
     * @param {Array} array - The array to check.
     * @returns {boolean} - True if all non-null elements are the same, false otherwise.
     */
    const arrayAllSame = (array) => {

        if (array.every(value => value === null)) {
            return false;
        }    

        // Filter out null values from the array
        const filteredArray = array.filter(value => value !== null);

        // Use the every method to check if all elements are strictly equal to the previous element
        return filteredArray?.every((value, index, arr) => index === 0 || value === arr[index - 1]);
    }

    /**
     * Determines if all objects in an array have an attribute starting with a given prefix.
     * @param {Array} array - The array of objects.
     * @param {string} attributeName - The attribute to check.
     * @param {string} prefix - The prefix to check for.
     * @returns {boolean} - True if all attributes start with the prefix, false otherwise.
     */

    const attributesStartWithString = (array, attributeName, prefix) => {
        // Use the every method to check if all attributes start with the specified string
        ////////console.log(`checking if features ${attributeName} startswith: ${prefix}` )
        return array.every(obj => obj.attributes[attributeName].startsWith(prefix));
      };

    /**
     * Extracts duplicate values of a specified attribute from an array of objects.
     * @param {Array} array - The array of objects.
     * @param {string} attributeName - The attribute to check for duplicates.
     * @returns {Promise<Array>} - An array of duplicate values.
     */
    const extractDuplicates = async (array, attributeName) => {
    // Step 1: Extract PIN10 values
    let values = array.map(feature => feature.attributes[attributeName]);
    
    ////////console.log("values: ", values)
    
    // Step 2: Use a frequency counter to count occurrences of each PIN10
    let valueCounts = values.reduce((acc, pin) => {
        acc[pin] = (acc[pin] || 0) + 1;
        return acc;
    }, {});
    
    // Step 3: Filter out the PIN10 values that appear more than once
    let dups = Object.keys(valueCounts).filter(value => valueCounts[value] > 1);
    
    return dups
    
    }

    /**
     * Returns search parameters based on the selected primary result feature.
     * @param {Object|Array} primaryResultFeature - The selected feature(s).
     * @returns {Promise<Object>} - The search parameters.
     */
    const returnSearchParam = async (primaryResultFeature) => {
        const {language} = state
        let features = Array.isArray(primaryResultFeature) ? primaryResultFeature : [primaryResultFeature]
        let attributes = features.length > 0 ? features[0].attributes : null
        let isMultiFeatures =  features.length > 1 ? true : false

        let paramValue = null
        let param = {"lang": language}

        if(attributes){
            let pin10s = features?.map((feature) => feature.attributes["PIN10"])
            let addresses = features?.map((feature) => feature.attributes["street_address"])
            let pin10Match =  isMultiFeatures === true ? arrayAllSame(pin10s) : true
            //remove?
            let addressMatch =  isMultiFeatures === true ? arrayAllSame(addresses) : true

            //check if multiple parcels are selected
            if(isMultiFeatures === false){
                //single parcel selected so set pin to pin14
                paramValue = attributes["PIN14"]
                param["pin14"] = paramValue
            }
            else if(isMultiFeatures === true && pin10Match === false){

                let pin14s = features.map(feature => feature.attributes['PIN14'])
                let pin10Dups = await extractDuplicates(features, "PIN10")
                let filteredPin14s = pin14s.filter(pin14 => !pin10Dups.some(pin10Dup => pin14.startsWith(pin10Dup)));
                let paramPins = [...filteredPin14s, ...pin10Dups]

                paramValue = paramPins
                if(pin10Dups?.length > 0){
                    param["pin10"] = `'${pin10Dups.join("','")}'`
                }
                if(filteredPin14s?.length){
                    param["pin14"] = `'${filteredPin14s.join("','")}'`
                }
            }
            else if(isMultiFeatures === true && pin10Match === true){
                param["pin"] = paramValue
            }
            else if(isMultiFeatures ===  true && pinsStringSimilar === true){
                param["searchTerm"] = searchTerm
            }
        }
        return  param
    }

    const deselectParcel = async (ids) => {

        const { primaryResultFeature } = state

        const filteredParcels = primaryResultFeature
                                .filter(feature => !ids.includes(feature.attributes[config.target_layer_id_field]))
                                .map(feature => feature)

        // Update parcel selection and search result variables
        setPrimaryResultFeature(filteredParcels)
        
        setSearchResults(null, filteredParcels)

        const  param = await returnSearchParam(filteredParcels)
        setSearchParams(param)

        return filteredParcels
    }

    /**
     * Queries parcels based on a given polygon and updates search results.
     * @param {Object} polygon - The polygon geometry used for querying.
     */
    const queryPolygon = async (polygon, newSelection) => {

        const { primaryResultFeature, selectPanelClosed, searchTerm, searchFeatures, comparableParcels } = state
        const { queryTargetLayerByPolygon } = await import('../arcgis/search/queryTargetLayer')
        const features = await queryTargetLayerByPolygon(polygon)
        
        ////console.log("Queried Features: ", features)
        //Check if the features is a comparable feature
        let matchingFeatures = []
        if(comparableParcels){
            const comparablePIN14s = comparableParcels.map((feature) => feature.attributes[config.target_layer_id_field])
            matchingFeatures = features.filter((feature)=> comparablePIN14s.includes(feature.attributes[config.target_layer_id_field]))
                                            .map((feature) => feature)
        }
        
        let allFeatures = searchFeatures ? [...searchFeatures] : []
        if(matchingFeatures.length === 0 ){
            //source parcel featuures
            if(!newSelection){
                ////console.log("queryPolygon adding selection to search features: ", features[0])
                ////console.log("queryPolygon search feature count: ", searchFeatures.length)
                allFeatures = [
                    ...allFeatures,
                    ...features
                ]
                ////console.log(" queryPolygonnew search feature count: ", allFeatures.length)

                if(selectPanelClosed){
                    //console.log("Select panel is closed")
                    setPrimaryResultFeature(features, newSelection)
                    togglePanel("property")
                }
                else{
                    //console.log("Select panel is open")
                    setSearchResults(null, allFeatures, searchTerm, allFeatures)

                    if(!primaryResultFeature){
                        setPrimaryResultFeature(features, true)
                    }
                }
                
                
            }
            else{
                allFeatures = [...features]

                ////console.log("setting new primary result features: ", allFeatures, newSelection)
                setPrimaryResultFeature(allFeatures, newSelection)
                setSearchResults(null, allFeatures, searchTerm, allFeatures)
            }

             //update url parameters
             const param = await returnSearchParam(allFeatures)
             setSearchParams(param)
        }

        else if(matchingFeatures.length === 1 && features.length > 0){
            setSecondaryResultFeature(features)
        }

        //return allFeatures
        return features
    }


    /**
     * Queries parcels based on a map click point.
     * @param {Object} point - The point geometry from the map click.
     */
    //Function to query parcels based on mouse click point
    //in use [v3.0.0-beta.2]
    const queryMapPoint = async (point) => {
        
        // let fields 
        ////////console.log("Point from click: ", point)
        setCoordinates(point.x, point.y)
        ////////console.log("x/y", point.x, point.y)

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

        ////////console.log("Passing query fields: ", parcelQueryFields)

        // if(!parcelQueryFields){
        //     fields = await loadDataDictionary()
        // }
        // else{
        //     fields = parcelQueryFields
        // }

        //let selectedFeatures = await peformQueryFeatures(point, fields)
        let selectedFeatures = await queryTargetLayerWithPointFeatures(point)

        ////////console.log("Queried Features: ", selectedFeatures)

        //check if queried features are secondary comparables
        ////////console.log("comparableParcels: ", comparableParcels)

        let secondaryFeatures = []
        if(comparableParcels){
            secondaryFeatures = comparableParcels.filter((feature) => feature.attributes['PIN14'] === selectedFeatures[0].attributes['PIN14'])
            ////////console.log("Secondary feature selected: ", secondaryFeatures) 
        }

        if(secondaryFeatures?.length > 0){
            ////////console.log("found comparable features from mouse click: ", selectedFeatures)
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
                ////////console.log("multiple features selected")
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

    /**
     * Queries parcel features based on coordinates.
     * @param {Object} coordinates - The x/y coordinates.
     */
    //Function to return parcel features using x/x coordinates
    //in use [v3.0.0-beta.2]
    //deprecated in [v3.0.0-beta-3]
    const returnLocationFeatures = async (coordinates) => {

        ////////console.log("Returning location features")
        const { queryTargetLayerWithCoordinates } = await import("../arcgis/search/queryTargetLayer")

        const { panelDisplay, panelPrimaryVisible } = state

        let features = await queryTargetLayerWithCoordinates(coordinates)
        ////////console.log("target features from x/y: ", features)

        setPrimaryResultFeature(features, true)
        setSearchResults(null, features, null)

        if(!panelDisplay || panelDisplay !== "resultsList"){
            setPanelDisplay("resultsList")
        }
        
        if(!panelPrimaryVisible || panelPrimaryVisible === false){
            setPanelPrimaryVisibility(true)
        }
    }

    /**
     * Queries features based on PIN10 and PIN14 values.
     * @param {string} pin10 - The PIN10 value.
     * @param {string} pin14 - The PIN14 value.
     * @returns {Promise<Array>} - The queried features.
     */
    const returnFeaturesByPin10Pin14 = async (pin10, pin14) => {

        const { queryTargeLayerWithPin10Pin14 } = await import("../arcgis/search/queryTargetLayer")

        const { panelDisplay, panelPrimaryVisible } = state

        let features = await queryTargeLayerWithPin10Pin14(pin10, pin14)

        setPrimaryResultFeature([features[0]], true)
        setSearchResults(null, features, null)

        if(!panelDisplay || panelDisplay !== "resultsList"){
            setPanelDisplay("resultsList")
        }
        
        if(!panelPrimaryVisible || panelPrimaryVisible === false){
            setPanelPrimaryVisibility(true)
        }

        return features
    }

    /**
     * Checks if any properties in one array have attributes['PIN14'] matching another array.
     * @param {Array} array1 - First array of objects.
     * @param {Array} array2 - Second array of objects.
     * @returns {boolean} - True if any match is found, false otherwise.
     */
    // Function to check if any properties attributes['PIN14'] are included in another array of objects
    const anyAttributesIncluded = (array1, array2) => {
        // Extract the attributes['PIN14'] values from the first array
        const attributes1 = array1.map(obj => obj.attributes['PIN14']);

        // Iterate over each object in the second array and check if its attributes['PIN14'] value is included in the attributes1 array
        for (let obj of array2) {
            if (attributes1.includes(obj.attributes['PIN14'])) {
                return obj.attributes['PIN14']; // If a match is found, return true
            }
        }

        return false; // If no match is found, return false
    }
  
    
    const loadDataDictionary = async () => {

        const { readFeatureLayerData } = await import('../arcgis/layers/layers')

        //const { parcelQueryFields } = state

        let { features } = await readFeatureLayerData(config.data_dictionary, ["*"], "field IS NOT NULL")

        //////////console.log("DATA DICTIONARY: ", features)
        setDataDictionary(features)

        //to do make sure pin10 id field is included
        //improve this
        //added bclass here because it was no longer being pulled from data dictionary
        let fields = [config.target_layer_id_field,'BCLASS']
        let queryFields = [...fields, ...new Set(features.filter((feature) => feature.attributes['category'] !== null && feature.attributes['type'] !== "calc" && feature.attributes['type'] !== "button")
                                          .map((feature) => feature.attributes['field'].trim())),
                                          ...new Set(features.filter((feature) => feature.attributes['hyperlink_params'] !== null)
                                          .map((feature) => feature.attributes['hyperlink_params'].trim()))]

        //////////console.log("Query Fields: ", queryFields)
        //setParcelQueryFields(queryFields)

        //////////console.log("loadDataDictionary - parcel query fields: ", parcelQueryFields)
        return queryFields
    }

    /**
     * Selects the result from the list based on the provided result and updates the state.
     * @param {string} result - The identifier for the result to be selected.
     * @returns {void} - No return value.
     */
    const selectResultFromList = async (result) => {

        const { searchFeatures, searchTerm, prevSearchFeatures } = state
        const selectedFeature = searchFeatures.filter((feature) => feature.attributes['PIN14_dash'] == result)

        setPrimaryResultFeature(selectedFeature, false)
        
        setSearchResults(null, searchFeatures, searchTerm, searchFeatures)

        if(!selectedFeature || !selectedFeature[0]) return;
        
        let extent = selectedFeature[0].geometry
        
        if(!arcgisMapRef.current) return

        const view = arcgisMapRef.current.view
        if(!view) return
        
        if(extent){
          await view.when()
          view.goTo(extent)
        }


    }


    /**
     * Adds a secondary feature to the map and updates the map's extent.
     * @returns {void} - No return value.
     */
    const addSecondaryFeatureToMap = async () => {
        const { secondaryResultFeature, primaryResultFeature, comparableParcels } = state

        //update graphic in map
        const { createGraphic, zoomToExtent, updateSecondaryGraphic } = await import('../arcgis/webmap/webmap')
        const { theme } = await import ('../theme')

        ////////console.log("creating new graphic for selectedFeature: ", secondaryResultFeature)

        const secondaryPIN14 = secondaryResultFeature.attributes['PIN14']

        const secondaryParcels = comparableParcels.filter(parcel => parcel.attributes["PIN14"] !== secondaryPIN14 )
        createGraphic(secondaryParcels, "secondary", theme.palette.secondary.main)

        createGraphic([secondaryResultFeature], "secondarySelected", theme.palette.secondary.main)
        //updateSecondaryGraphic(whereQuery)
        zoomToExtent([secondaryResultFeature, primaryResultFeature])
    }


    /**
     * Toggles the visibility of a map layer.
     * @param {string} layerName - The name of the layer to toggle.
     * @returns {void} - No return value.
     */
    const toggleMapLayer = async (layerName) => {

        //update graphic in map
        const { toggleLayer } = await import('../arcgis/webmap/webmap')

        toggleLayer(layerName)
    }


    /**
     * Returns comparable parcel features based on the provided results and search term.
     * @param {Array} results - Array of results to be used for comparison.
     * @param {string} newSearchTerm - The new search term to use for filtering results.
     * @returns {void} - No return value.
     */
    //Function to return comparable parcel features
    //in use [v3.0.0-beta.2]
    const returnSearchResultFeatures = async (results, newSearchTerm) => {

        const { handleMultipleResults, isAddressLocator } = await import('../arcgis/search/queryTargetLayer')
        const { returnBufferGeometry } = await import('../arcgis/geoprocessing/geoprocessing')
    
        ////////console.log("Performing new target layer query")
        setSearchBufferGeometry(null, null)
        
        const{ targetFeatures } = await handleMultipleResults(results)

        ////////console.log("target features returned: ", targetFeatures)
        ////////console.log("results returned: ", results)

        setPrimaryResultFeature([targetFeatures[0]], true)


        ////////console.log("seting previous feature: ", targetFeatures)
        setSearchResults(results, targetFeatures, newSearchTerm, targetFeatures)
        //}

        //created buffer graphic here
        //if results include Address Locator source
        //update state of searchBuffer and pass point geometries
        
        const addressLocatorResultGeometry = results.filter(result => isAddressLocator(result.source.name))
                                             .flatMap(filteredResults => filteredResults.results)
                                             .map(flattenedResults => flattenedResults.feature.geometry)
        
        
        const bufferGeometries = await Promise.all(addressLocatorResultGeometry.map(async(geometry) => {

            //////console.log("buffer geometry: ", geometry)
            return await returnBufferGeometry(geometry, config.buffer_distance, config.buffer_unit)

        }))

        //////console.log("address locator buffer geometries calculated: ", bufferGeometries)
        setSearchBufferGeometry(addressLocatorResultGeometry, bufferGeometries)

    }

    /**
     * Renders search results on the map based on the widget results.
     * @param {Array} searchWidgetResults - Array of search results from the widget.
     * @returns {void} - No return value.
     */
    const renderSearchResults = async (searchWidgetResults) => {

        ////////console.log("FUNCTION: renderSearchResults" )
        let fields
        const { querySearchResults } = await import('../arcgis/webmap/webmap')
        const { parcelQueryFields, panelDisplay, primaryResultFeature } = state

        ////////console.log("Query Fields: ", parcelQueryFields)
        if(!parcelQueryFields){
            fields = await loadDataDictionary()
        }
        else{
            fields = parcelQueryFields
        }

        const features = await querySearchResults(searchWidgetResults, fields)

        ////////console.log("queried features: ", features)
        setSearchResults(searchWidgetResults, features)

        //if(!primaryResultFeature){
            setPrimaryResultFeature(features, true)
        //}

        if(panelDisplay !== "resultsList"){
            setPanelDisplay("resultsList")
        }
        
    }

    /**
     * Clears all search results, graphics, and resets relevant states.
     * @returns {void} - No return value.
     */
    const clearResults = async () => {
        //const { removeGraphics } = await import('../arcgis/webmap/webmap')
        
        const {panelDisplaySecondary} = state

        setPrimaryResultFeature(null, true)
        setSearchResults(null, null)
        setSearchParams({})
        setPanelDisplay("resultsList")
        setSearchBufferGeometry(null, null)

        if(["comparablePropertySearch", "nearbyProperties", "resultsListComparables", "resultsListNearby", "propertyDetailComparable", "propertyDetailNearby"].includes(panelDisplaySecondary)){
            setPanelSecondaryVisibility(false)
        }
        const updatedUrl = `${window.location.pathname}`;

        // Use history.pushState to update the URL without refreshing the page
        window.history.pushState({ path: updatedUrl }, '', updatedUrl);
        //setIsQuerying(false)
    }

    /**
     * Clears comparable results and resets secondary panel visibility.
     * @returns {void} - No return value.
     */
    const clearResultsComparables = async () => {
        //const { removeGraphics } = await import('../arcgis/webmap/webmap')

        //const { comparableParcels} = state
        setComparableParcels(null)
        setSecondaryResultFeature(null)

        //removeGraphics("secondary")

       
    }

    /**
     * Searches for comparable properties within a specified query and distance.
     * @param {string} whereQuery - The query to filter comparable properties.
     * @param {number} searchDistance - The distance for searching comparable properties.
     * @returns {void} - No return value.
     */
    //Function to return comparable parcel features
    //in use [v3.0.0-beta.2]
    const searchComparableProperties = async (whereQuery, searchDistance) => {

        const { compareProperities } = await import('../arcgis/search/queryTargetLayer')

        const { primaryResultFeature, parcelQueryFields, screenWidth, comparableParcels } = state     

        let features = await compareProperities(whereQuery, searchDistance, primaryResultFeature, parcelQueryFields)

        setComparableParcels(features)

        ////////console.log("New Comparable features: ", state.comparableParcels)

        if(screenWidth < theme.breakpoints.values.lg){
            setPanelPrimaryVisibility(true)
            setPanelDisplay("resultsListComparables")
        }
        else if (screenWidth >= theme.breakpoints.values.lg){
            setPanelSecondaryVisibility(true)
            setPanelDisplaySecondary("resultsListComparables")
        }
    }

    /**
     * Searches for nearby properties within a specified distance and unit.
     * @param {number} searchDistance - The distance to search for nearby properties.
     * @param {string} units - The units of measurement for the search distance.
     * @returns {void} - No return value.
     */
    //Function to return nearby parcel features
    //in use [v3.0.0-beta.2]
    const searchNearbyProperties = async (searchDistance, units) => {
        setIsQuerying(true)
        const { nearbyProperties } = await import('../arcgis/search/queryTargetLayer')
        const { primaryResultFeature, parcelQueryFields } = state  
        ////////console.log(`Searching for properties within ${searchDistance}`)

        
        let nearbyParcels = await nearbyProperties( searchDistance, units, primaryResultFeature, parcelQueryFields)
        
        ////console.log("nearbyParcels")
        setComparableParcels(nearbyParcels)
        setIsQuerying(false)
    }

    /**
     * Translates the given text into the specified language using the translation dictionary.
     * @param {string} text - The text to translate.
     * @param {number} skipNum - The flag to skip number translation if necessary.
     * @returns {string} - The translated text.
     */
    const translateText =  (text, skipNum) => {

        const {language, textTranslationDictionary} = state

        if (text === null || text === undefined) {
            ////console.log("translateText: text is null or undefined, skipping translation", text)
            return; // Skip null/undefined
        }

        if(textTranslationDictionary === null || textTranslationDictionary === undefined){
            return text
        };

        // If text is a string
        if (typeof text === 'string') {
            ////console.log("translateText: text is a string", text)
            let translation = text;

            //if value match without splitting strings
            const foundText = Object.values(textTranslationDictionary).find(textReplace => textReplace[config.defaultLanguage] === text)
            if(foundText){
                translation = foundText[language]
            }
            else if(!/\d/.test(text)){
                // String does not contain numbers
                const foundText = Object.values(textTranslationDictionary).find(textReplace => textReplace[config.defaultLanguage] === text)
                if(foundText){
                    translation = foundText[language]
                } 
            }
            else if(/\d/.test(text)){
                // String contains both letters and numbers
                // Handle alphanumeric
                const numericValues = text.match(/\d+/g)
                const strings = text.replace(numericValues, "").replace(/[()]/g, "").trim()
                const foundText = Object.values(textTranslationDictionary).find(textReplace => textReplace[config.defaultLanguage] === strings)

                translation =  foundText ? text.replace(strings, foundText[language]) : text
            }
            
            return translation;
        }
        else{
            return text
        }
    }


    const value = {
        mapContainer: state.mapContainer,
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
        returnSearchParam,
        //PANEL CONTROLS
        setInfoPanel,
        infoPanelClosed: state.infoPanelClosed,
        setSearchResultsPanel,
        searchResultsPanelClosed: state.searchResultsPanelClosed,
        setPropertyDetailPanel,
        propertyDetailPanelClosed: state.propertyDetailPanelClosed,
        comparablePanelClosed: state.comparablePanelClosed,
        setComparablePanel,
        nearbyPanelClosed: state.nearbyPanelClosed,
        setNearbyPanel,
        comparisonResultsClosed: state.comparisonResultsClosed,
        setComparisonResultsPanel,
        setComparisonDetailPanel,
        comparisonDetailPanelClosed: state.comparisonDetailPanelClosed,
        togglePanel,
        setLayersPanel,
        layersPanelClosed: state.layersPanelClosed,
        setImageryPanel,
        imageryPanelClosed: state.imageryPanelClosed,
        setPrintPanel,
        printPanelClosed: state.printPanelClosed,
        setMeasurePanel,
        measurePanelClosed: state.measurePanelClosed, 
        setSelectPanel,
        selectPanelClosed: state.selectPanelClosed,
        helpPanelClosed: state.helpPanelClosed,
        setHelpPanel,
        arcgisMapRef,
        deselectParcel,
        //EXPORT DIALOG
        setExportOpen,
        exportOpen:state.exportOpen,
        exportDataSource: state.exportDataSource,
        setFeedbackDialog,
        feedbackOpen: state.feedbackOpen,
        feedbackSource: state.feedbackSource,
        //DEVICE STATE
        setIsMobile,
        isMobile: state.isMobile,
        //GUIDED TOUR STATE
        refSearch,
        tourDialogOpen: state.tourDialogOpen,
        setTourDialogOpen,
        setSuppressTourDialog,
        suppressTourDialog: state.suppressTourDialog

    }

useEffect(() => {
        // Get the locale code for the current language
        const locale_code = config.language_codes[state.language] || "en";
        intl.setLocale(locale_code);
        // Optionally, set the HTML lang attribute for Calcite components
        document.documentElement.lang = locale_code;
        console.log("Esri locale set to:", locale_code);
    }, [state.language]);
        //console.log("AppContext mounted"  )

    useEffect(() => {
        const handleResize = () => {
            ////////console.log("Resize event triggered");
            const width = window.innerWidth
            ////////console.log("window width: ", width)
            setIsMobile(width < 768)
        }
    
        window.addEventListener('resize', handleResize);

        handleResize();
        
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, [window.innerWidth]);

    useEffect(() => {
        //on initial load display info panel

        setPanelPrimaryVisibility(true)
        setPanelDisplay("info")
        
    }, [])

    useEffect(() => {
        const loadParcelFields = async () => {
            let fields = await loadDataDictionary()
            setParcelQueryFields(fields)
            ////////console.log("Parcel query fields: ", fields)
        }

        loadParcelFields();
        ////////console.log("Parcel query fields: ", state.parcelQueryFields)
      },[])


    
    useEffect(() => {
        const handleResize = () => {
            ////////console.log("Resize event triggered");
            const width = window.innerWidth
            ////////console.log("window width: ", width)
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

            //////////console.log("translated help text: ", helpText)

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
    //         ////////console.log("Measure Widget: ", state.measureWidget)
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
    //             //////////console.log("Measure Widget: ", state.measureWidget);
    //             if (state.measureWidget) {
    //                 ////////console.log("Measure Widget: ", state.measureWidget);
    //                 // await state.measureWidget.when();
    //                 state.measureWidget.clear();
    //                 ////////console.log("Destroying Measure Widget: ");
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
