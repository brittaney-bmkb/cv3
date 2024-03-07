import { createContext, useContext, useEffect, useReducer } from "react";
import AppReducer, { initialState } from '../reducers/AppReducer'
import { useSearchParams } from "react-router-dom";
import { config } from "../data/config";
import { zoomToExtent } from "../arcgis/webmap/webmap";
import { theme } from "../theme";


export const AppContext = createContext(initialState)

export const AppProvider = ({children}) => {

    const [state, dispatch] = useReducer(AppReducer, initialState)

     //get url parameters
     const [routeParams, setSearchParams] = useSearchParams()

    const setMapContainer = (ref) => {
        dispatch({
            type:"SET_MAP_CONTAINER",
             payload: {
                mapContainer: ref,
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

    const loadMap = async () => {

        const {initializeMap, zoomToExtent} = await import('../arcgis/webmap/webmap')
        const {mapContainer, primaryResultFeature, comparableParcels} = state

        let view, searchSources = await initializeMap(mapContainer)

        await loadDataDictionary()

        setMapView(view)
        setSearchSources(searchSources)
        if(!primaryResultFeature){
            setPrimaryResultFeature(null, true)
        }
        else{
            zoomToExtent(comparableParcels? comparableParcels: [primaryResultFeature])
        }
        
    }



    const mapClickEventHandler = async () => {

        const { onViewClick, createGraphic, zoomToExtent, removeGraphics } = await import('../arcgis/webmap/webmap')
        const { theme } = await import ('../theme')
        
        const { measureWidgetState, comparableParcels, panelSecondaryVisible, primaryResultFeature, panelPrimaryVisible, panelDisplay, parcelQueryFields, panelDisplaySecondary } = state

        if(!measureWidgetState){
        const selectedFeatures = await onViewClick(parcelQueryFields)
        console.log("selectedFeatures: ", selectedFeatures)
        let secondaryFeatures = []
        if(comparableParcels){

            secondaryFeatures = comparableParcels.filter((feature) => feature.attributes['PIN14'] === selectedFeatures[0].attributes['PIN14'])
                                                      .map((feature) => feature)

            console.log("Secondary feature selcted: ", secondaryFeatures)
    
          };
        
        if(secondaryFeatures?.length > 0){
            setSecondaryResultFeature(secondaryFeatures[0])
            setPanelDisplaySecondary("propertyDetailNearby")
            createGraphic(secondaryFeatures, "secondarySelected", theme.palette.primary.light)
            zoomToExtent([secondaryFeatures[0], primaryResultFeature])
        }

        else{
            console.log("App context setting selected parcel", selectedFeatures)
            // if(selectedFeatures.length === 1){
            setPrimaryResultFeature(selectedFeatures, false)

            setSearchResults(null, selectedFeatures)
            createGraphic(selectedFeatures, "primary", theme.palette.primary.main)
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

        

        
    }

    const setSearchResults = (results, features) => {
        dispatch({
            type:"SET_SEARCH_RESULT",
             payload: {
                searchResults: results,
                searchFeatures: features
            }
        })
    }

    const setSearchSources = (searchSources) => {
        dispatch({
            type:"SET_SEARCH_SOURCES",
             payload: {
                searchSources: searchSources,
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

  
    
    const loadDataDictionary = async () => {

        const { readFeatureLayerData } = await import('../arcgis/layers/layers')

        let { features } = await readFeatureLayerData(config.data_dictionary, ["*"], "field IS NOT NULL")

        setDataDictionary(features)

        //to do make sure pin10 id field is included
        //improve this
        //added bclass here because it was no longer being pulled from data dictionary
        let fields = [config.target_layer_id_field,'BCLASS']
        let queryFields = [...fields, ...new Set(features.filter((feature) => feature.attributes['category'] !== null && feature.attributes['type'] !== "calc" && feature.attributes['type'] !== "button")
                                          .map((feature) => feature.attributes['field'].trim())),
                                          ...new Set(features.filter((feature) => feature.attributes['hyperlink_params'] !== null)
                                          .map((feature) => feature.attributes['hyperlink_params'].trim()))]

        console.log("Query Fields: ", queryFields)
        setParcelQueryFields(queryFields)
    }

    const selectResultFromList = async (result) => {
        console.log("Result PIN : ", result)
        const { searchFeatures } = state
        const selectedFeature = searchFeatures.filter((feature) => feature.attributes['PIN14_dash'] == result)
        console.log("selectedFeature: ", selectedFeature)

        setPrimaryResultFeature(selectedFeature[0], false)
  
        //update graphic in map
        const { createGraphic } = await import('../arcgis/webmap/webmap')

        createGraphic(selectedFeature, "primary", "darkBlue")
    }

    const addSecondaryFeatureToMap = async () => {
        const { secondaryResultFeature, primaryResultFeature } = state

        //update graphic in map
        const { createGraphic, zoomToExtent } = await import('../arcgis/webmap/webmap')
        const { theme } = await import ('../theme')

        console.log("creating new graphic for selectedFeature: ", secondaryResultFeature)

        createGraphic([secondaryResultFeature], "secondarySelected", theme.palette.primary.light)
        zoomToExtent([secondaryResultFeature, primaryResultFeature])
    }

    const toggleMapLayer = async (layerName) => {

        //update graphic in map
        const { toggleLayer } = await import('../arcgis/webmap/webmap')

        toggleLayer(layerName)
    }


    const renderSearchResults = async (searchWidgetResults) => {
        const { querySearchResults } = await import('../arcgis/webmap/webmap')
        const { parcelQueryFields, panelDisplay, primaryResultFeature } = state

        console.log("Query Fields: ", parcelQueryFields)

        const features = await querySearchResults(searchWidgetResults, parcelQueryFields)
        setSearchResults(searchWidgetResults, features)

        //if(!primaryResultFeature){
            setPrimaryResultFeature(features, true)
        //}

        if(panelDisplay !== "resultsList"){
            setPanelDisplay("resultsList")
        }
        
    }

    const clearResults = async () => {
        const { removeGraphics } = await import('../arcgis/webmap/webmap')
        
        const {panelDisplaySecondary} = state

        setPrimaryResultFeature(null, true)
        setSearchResults(null, null)
        removeGraphics("primary");
        removeGraphics("secondary");
        setPanelDisplay("resultsList")

        if(["comparablePropertySearch", "nearbyProperties", "resultsListComparables", "resultsListNearby", "propertyDetailComparable", "propertyDetailNearby"].includes(panelDisplaySecondary)){
            console.log("CLEAR RESULTS: closing secondary panel. Secondary Panel =", panelDisplaySecondary )
            setPanelSecondaryVisibility(false)
        }

        //setSearchParams()

        const updatedUrl = `${window.location.pathname}`;

        // Use history.pushState to update the URL without refreshing the page
        window.history.pushState({ path: updatedUrl }, '', updatedUrl);
    }

    const clearResultsComparables = async () => {
        const { removeGraphics } = await import('../arcgis/webmap/webmap')

        const { comparableParcels} = state
        if(comparableParcels){
            setComparableParcels(null)
            removeGraphics("secondary")
        }
       
    }

    const searchComparableProperties = async (whereQuery, searchDistance) => {

        const { compareProperities } = await import('../arcgis/webmap/webmap')

        const { primaryResultFeature, parcelQueryFields, screenWidth } = state     

        let features = await compareProperities(whereQuery, searchDistance, primaryResultFeature, parcelQueryFields)

        console.log("New Comparable features: ", features)
        setComparableParcels(features)

        if(screenWidth < theme.breakpoints.values.lg){
            setPanelPrimaryVisibility(true)
            setPanelDisplay("resultsListComparables")
        }
        else if (screenWidth >= theme.breakpoints.values.lg){
            setPanelSecondaryVisibility(true)
            setPanelDisplaySecondary("resultsListComparables")
        }
    }

    const searchNearbyProperties = async (searchDistance, units) => {
        setIsQuerying(true)
        const { nearbyProperties } = await import('../arcgis/webmap/webmap')
        const { primaryResultFeature, parcelQueryFields } = state  
        console.log(`Searching for properties within ${searchDistance}`)

        
        let nearbyParcels = await nearbyProperties( searchDistance, units, primaryResultFeature, parcelQueryFields)
    
        setComparableParcels(nearbyParcels)
        setIsQuerying(false)
    }

    const translateText = (text) => {

        const {language, textTranslationDictionary} = state

        if(text && textTranslationDictionary){
            //console.log("TRANSLATING TEXT: ", text, language)
            let translation = Object.values(textTranslationDictionary).filter(textReplace => 
                textReplace[config.defaultLanguage] === text)
                .map((textReplace)=> {
                    return textReplace[language]
                })
    
            //console.log("TRANSLATED TEXT: ", translation)
            return translation && translation.length > 0 ? translation[0] : text
        }
        else{
            return text
        }


    }


    const value = {
        mapContainer: state.mapContainer,
        loadMap,
        setMapContainer,
        mapView: state.mapView,
        mapClickEventHandler,
        primaryResultFeature: state.primaryResultFeature,
        setSearchResults,
        searchSources: state.searchSources,
        searchResults: state.searchResults,
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
        setIsQuerying
        
    }


    
    useEffect(() => {
        const handleResize = () => {
            console.log("Resize event triggered");
            const width = window.innerWidth
            console.log("window width: ", width)
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


            let { features } = await readFeatureLayerData(config.translation_text, ["*"], "english IS NOT NULL", false)
            let text = await returnTranslatedText(features)
            setTranslationDictionary(text)
        }
    
         initializeTranslationText();

      }, []);


      useEffect(() => {

        if(state.panelDisplaySecondary !== "measureWidget" || state.panelSecondaryVisible === false){
            console.log("Measure Widget: ", state.measureWidget)
            if(state.measureWidget){
                state.measureWidget.clear()
                setMeasureWidgetState(null)
            }
            
            
        }
    
      }, [state.panelDisplaySecondary, state.panelSecondaryVisible])

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>

}

export default function UseAppContext(){
    const context = useContext(AppContext)
    if (context === undefined){
        throw new Error("UseAppContext must be used within AppContext");
    }
    return context
}