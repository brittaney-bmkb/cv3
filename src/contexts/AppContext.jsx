import { createContext, useContext, useEffect, useReducer } from "react";
import AppReducer, { initialState } from '../reducers/AppReducer'
import { config } from "../data/config";
import { returnLatLong } from "../arcgis/webmap/webmap";
import { theme } from "../theme";


export const AppContext = createContext(initialState)

export const AppProvider = ({children}) => {

    const [state, dispatch] = useReducer(AppReducer, initialState)

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

    const setCoordinates = (x, y) => {
        dispatch({
            type:"SET_COORDINATES",
             payload: {
                x: x,
                y: y
            }
        })
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


    const queryMapPoint = async (point) => {
        
        let fields 
        setCoordinates(point.x, point.y)
        console.log("x/y", point.x, point.y)

        const { screenWidth, panelSecondaryVisible, panelPrimaryVisible, panelDisplay, parcelQueryFields, comparableParcels, primaryResultFeature} = state
        const { peformQueryFeatures, createGraphic, zoomToExtent, removeGraphics } = await import('../arcgis/webmap/webmap')


        console.log("Passing query fields: ", parcelQueryFields)

        if(!parcelQueryFields){
            fields = await loadDataDictionary()
        }
        else{
            fields = parcelQueryFields
        }

        let selectedFeatures = await peformQueryFeatures(point, fields)

        console.log("Queried Features: ", selectedFeatures)

        //check if queried features are secondary comparables
        console.log("comparableParcels: ", comparableParcels)

        let secondaryFeatures = []
        if(comparableParcels){
            secondaryFeatures = comparableParcels.filter((feature) => feature.attributes['PIN14'] === selectedFeatures[0].attributes['PIN14'])
            console.log("Secondary feature selected: ", secondaryFeatures)
        
            if(secondaryFeatures?.length > 0){
                setSecondaryResultFeature(secondaryFeatures[0])
                if(screenWidth < theme.breakpoints.values.lg){
                    setPanelDisplay("propertyDetailNearby")
                }
                else{
                    setPanelDisplaySecondary("propertyDetailNearby")
                }
                
                createGraphic(secondaryFeatures, "secondarySelected", theme.palette.secondary.main)
                zoomToExtent([secondaryFeatures[0], primaryResultFeature])
            }
        
        }

        else{
            setPrimaryResultFeature(selectedFeatures, false)
            setSearchResults(null, selectedFeatures)
            createGraphic(selectedFeatures, "primary", theme.palette.primary.main)
            zoomToExtent(selectedFeatures)

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

    // const mapClickEventHandler = async () => {

    //     const { onViewClick, createGraphic, zoomToExtent, removeGraphics } = await import('../arcgis/webmap/webmap')
    //     const { theme } = await import ('../theme')
        
    //     const { measureWidgetState, comparableParcels, panelSecondaryVisible, primaryResultFeature, panelPrimaryVisible, panelDisplay, parcelQueryFields, panelDisplaySecondary } = state

    //     if(measureWidgetState !== true){
    //         const point = await returnLatLong()

    //         const selectedFeatures = await onViewClick(parcelQueryFields)
    //         console.log("selectedFeatures: ", selectedFeatures)
            
    //         setCoordinates(point.x, point.y)
    //         console.log("x/y", point.x, point.y)

            
    //         let secondaryFeatures = []
    //         if(comparableParcels){
    //             console.log("Secondary feature selected: ", secondaryFeatures)
    //             secondaryFeatures = comparableParcels.filter((feature) => feature.attributes['PIN14'] === selectedFeatures[0].attributes['PIN14'])

    //         };
            
    //         if(secondaryFeatures?.length > 0){
    //             setSecondaryResultFeature(secondaryFeatures[0])
    //             setPanelDisplaySecondary("propertyDetailNearby")
    //             createGraphic(secondaryFeatures, "secondarySelected", theme.palette.secondary.main)
    //             //zoomToExtent([secondaryFeatures[0], primaryResultFeature])
    //         }

    //         else{
    //             console.log("App context setting selected parcel", selectedFeatures)
    //             // if(selectedFeatures.length === 1){
    //             setPrimaryResultFeature(selectedFeatures, false)

    //             setSearchResults(null, selectedFeatures)
    //             createGraphic(selectedFeatures, "primary", theme.palette.primary.main)
    //             if(!panelDisplay || panelDisplay !== "resultsList"){
    //                 setPanelDisplay("resultsList")
    //             }
                
    //             if(!panelPrimaryVisible || panelPrimaryVisible === false){
    //                 setPanelPrimaryVisibility(true)
    //             }

    //             if(panelSecondaryVisible === true && ["propertyDetailNearby","propertyDetailComparable","resultsListNearby","resultsListComparables","nearbyProperties","comparablePropertySearch"].includes(panelDisplaySecondary)){
    //                 setPanelSecondaryVisibility(false)
    //             }
                
    //             if(comparableParcels){
    //                 clearResultsComparables()
    //             } 
    //         }

    // }   
    // }

    const returnLocationFeatures = async (coordinates) => {

        const { queryLocationResults, createGraphic } = await import("../arcgis/webmap/webmap")

        const { parcelQueryFields } = state

        let features = await queryLocationResults(coordinates, parcelQueryFields)

        setPrimaryResultFeature(features, true)
        setSearchResults(null, features)
        createGraphic(features, "primary", theme.palette.primary.main)
    }
  
    
    const loadDataDictionary = async () => {

        const { readFeatureLayerData } = await import('../arcgis/layers/layers')

        //const { parcelQueryFields } = state

        let { features } = await readFeatureLayerData(config.data_dictionary, ["*"], "field IS NOT NULL")

        //console.log("DATA DICTIONARY: ", features)
        setDataDictionary(features)

        //to do make sure pin10 id field is included
        //improve this
        //added bclass here because it was no longer being pulled from data dictionary
        let fields = [config.target_layer_id_field,'BCLASS']
        let queryFields = [...fields, ...new Set(features.filter((feature) => feature.attributes['category'] !== null && feature.attributes['type'] !== "calc" && feature.attributes['type'] !== "button")
                                          .map((feature) => feature.attributes['field'].trim())),
                                          ...new Set(features.filter((feature) => feature.attributes['hyperlink_params'] !== null)
                                          .map((feature) => feature.attributes['hyperlink_params'].trim()))]

        //console.log("Query Fields: ", queryFields)
        //setParcelQueryFields(queryFields)

        //console.log("loadDataDictionary - parcel query fields: ", parcelQueryFields)
        return queryFields
    }

    const selectResultFromList = async (result) => {
        console.log("Result PIN : ", result)
        const { searchFeatures } = state
        const selectedFeature = searchFeatures.filter((feature) => feature.attributes['PIN14_dash'] == result)
        console.log("selectedFeature: ", selectedFeature)

        setPrimaryResultFeature(selectedFeature[0], false)
  
        //update graphic in map
        const { createGraphic } = await import('../arcgis/webmap/webmap')

        createGraphic(selectedFeature, "primary", theme.palette.primary.main)
    }

    const addSecondaryFeatureToMap = async () => {
        const { secondaryResultFeature, primaryResultFeature, comparableParcels } = state

        //update graphic in map
        const { createGraphic, zoomToExtent, updateSecondaryGraphic } = await import('../arcgis/webmap/webmap')
        const { theme } = await import ('../theme')

        console.log("creating new graphic for selectedFeature: ", secondaryResultFeature)

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


    const renderSearchResults = async (searchWidgetResults) => {
        let fields
        const { querySearchResults } = await import('../arcgis/webmap/webmap')
        const { parcelQueryFields, panelDisplay, primaryResultFeature } = state

        console.log("Query Fields: ", parcelQueryFields)
        if(!parcelQueryFields){
            fields = await loadDataDictionary()
        }
        else{
            fields = parcelQueryFields
        }

        const features = await querySearchResults(searchWidgetResults, fields)
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
        setComparableParcels(null)
        removeGraphics("secondary")

       
    }

    const searchComparableProperties = async (whereQuery, searchDistance) => {

        const { compareProperities, zoomToExtent } = await import('../arcgis/webmap/webmap')

        const { primaryResultFeature, parcelQueryFields, screenWidth, comparableParcels } = state     

        let features = await compareProperities(whereQuery, searchDistance, primaryResultFeature, parcelQueryFields)

        setComparableParcels(features)

        let zoomFeatures = [
            ...[primaryResultFeature],
            ...features
        ]

        zoomToExtent(zoomFeatures)

        console.log("New Comparable features: ", state.comparableParcels)

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
        const { nearbyProperties, zoomToExtent } = await import('../arcgis/webmap/webmap')
        const { primaryResultFeature, parcelQueryFields } = state  
        console.log(`Searching for properties within ${searchDistance}`)

        
        let nearbyParcels = await nearbyProperties( searchDistance, units, primaryResultFeature, parcelQueryFields)
        
        let zoomFeatures = [
            ...[primaryResultFeature],
            ...nearbyParcels
        ]

        zoomToExtent(zoomFeatures)

        setComparableParcels(nearbyParcels)
        setIsQuerying(false)
    }

    const translateText = (text) => {

        const {language, textTranslationDictionary} = state

        if(text && textTranslationDictionary){
            
            if(Object.keys(textTranslationDictionary).includes(text)){
                return textTranslationDictionary[text][language]
            }

            else{

                let numericValues
                let textToReplace = text
                if(text.match(/\d+/g) && !text.includes("-")){
                //&& text.match(/[()]/g)){
                    numericValues = text.match(/\d+/g)

                    //replace numeric and parentheses 
                    textToReplace = text.replace(numericValues, "").replace(/[()]/g, "").trim()

                    //console.log("Found numeric values: ", numericValues, textToReplace)
                }

                let translation = Object.values(textTranslationDictionary).filter(textReplace => 
                    textReplace[config.defaultLanguage] === textToReplace)
                    .map((textReplace)=> {
                        return textReplace[language]
                    })

                //console.log("TRANSLATED TEXT: ", translation)
                if(translation && translation.length){
                    if(numericValues && text !== config.bannerHeader ){
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
        mapView: state.mapView,
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
        
    }

    useEffect(() => {

        console.log("comparable parcels updated", state.comparableParcels)
    }, [state.comparableParcels])

    useEffect(() => {
        const loadParcelFields = async () => {
            let fields = await loadDataDictionary()
            setParcelQueryFields(fields)
            console.log("Parcel query fields: ", fields)
        }

        loadParcelFields();
        console.log("Parcel query fields: ", state.parcelQueryFields)
      },[])


    
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

            //general translated text
            let { features } = await readFeatureLayerData(config.translation_text, ["*"], "english IS NOT NULL", false)
            let generalText = await returnTranslatedText(features)

            //help translated text
            let helpData = await readFeatureLayerData(config.translation_text_help, ["*"], "english IS NOT NULL", false)
            let helpText = await returnTranslatedText(helpData.features)

            //console.log("translated help text: ", helpText)

            let text = {
                ...generalText,
                ...helpText
            }

            setTranslationDictionary(text)
        }
    
         initializeTranslationText();

      }, []);




    //   useEffect(() => {

    //     if(state.panelDisplayWidget !== "measureWidget" || state.panelWidgetVisible === false){
    //         console.log("Measure Widget: ", state.measureWidget)
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
    //             //console.log("Measure Widget: ", state.measureWidget);
    //             if (state.measureWidget) {
    //                 console.log("Measure Widget: ", state.measureWidget);
    //                 // await state.measureWidget.when();
    //                 state.measureWidget.clear();
    //                 console.log("Destroying Measure Widget: ");
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