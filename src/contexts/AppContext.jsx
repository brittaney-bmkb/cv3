import { createContext, useContext, useEffect, useReducer } from "react";
import AppReducer, { initialState } from '../reducers/AppReducer'
import { useSearchParams } from "react-router-dom";
import { config } from "../data/config";
import { zoomToExtent } from "../arcgis/webmap/webmap";


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

    const loadMap = async () => {

        const {initializeMap} = await import('../arcgis/webmap/webmap')
        const {mapContainer} = state

        let view, searchSources = await initializeMap(mapContainer)

        await loadDataDictionary()

        setMapView(view)
        setSearchSources(searchSources)
        setPrimaryResultFeature(null, true)
    }


    const mapClickEventHandler = async (event) => {

        const { onViewClick, createGraphic, zoomToExtent, removeGraphics } = await import('../arcgis/webmap/webmap')
        const { theme } = await import ('../theme')
        
        const { comparableParcels, primaryResultFeature } = state

        const selectedFeatures = await onViewClick()
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
            removeGraphics("secondary");
            setPrimaryResultFeature(selectedFeatures[0], true)
            setPanelDisplay("resultsList")
            setPanelPrimaryVisibility(true)
            setPanelSecondaryVisibility(false)
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



    
    const loadDataDictionary = async () => {

        const { readFeatureLayerData } = await import('../arcgis/layers/layers')

        let { features } = await readFeatureLayerData(config.data_dictionary, ["*"], "FID IS NOT NULL")

        setDataDictionary(features)

        //to do make sure pin10 id field is included
        //improve this
        let fields = [config.target_layer_id_field]
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


    const renderSearchResults = async () => {
        const { querySearchResults } = await import('../arcgis/webmap/webmap')
        const { searchResults, parcelQueryFields } = state

        console.log("Query Fields: ", parcelQueryFields)

        const features = await querySearchResults(searchResults, parcelQueryFields)
        setSearchResults(searchResults, features)
        setPanelDisplay("resultsList")
    }

    const clearResults = async () => {
        const { removeGraphics } = await import('../arcgis/webmap/webmap')
        
        const {panelDisplaySecondary} = state

        setSearchResults(null, null)
        removeGraphics("primary");
        removeGraphics("secondary");
        setPanelDisplay("resultsList")

        if(["comparablePropertySearch", "nearbyProperties", "resultsListComparables", "resultsListNearby", "propertyDetailComparable", "propertyDetailNearby"].includes(panelDisplaySecondary)){
            setPanelSecondaryVisibility(false)
        }
    }

    const clearResultsComparables = async () => {
        const { removeGraphics } = await import('../arcgis/webmap/webmap')

        const {panelDisplaySecondary} = state
        setComparableParcels(null)
        removeGraphics("secondary")

        if(["nearbyProperties", "comparablePropertySearch", "resultsListComparables", "resultsListNearby", "propertyDetailComparable", "propertyDetailNearby"].includes(panelDisplaySecondary)){
            setPanelSecondaryVisibility(false)
        }
        
    }

    const searchComparableProperties = async (whereQuery, searchDistance) => {

        const { compareProperities } = await import('../arcgis/webmap/webmap')

        const { primaryResultFeature } = state     
        compareProperities(whereQuery, searchDistance, primaryResultFeature)

    }

    const searchNearbyProperties = async (searchDistance) => {

        const { nearbyProperties } = await import('../arcgis/webmap/webmap')
        const { primaryResultFeature, parcelQueryFields } = state  
        console.log(`Searching for properties within ${searchDistance}`)
        let nearbyParcels = await nearbyProperties( searchDistance, primaryResultFeature, parcelQueryFields)
        setComparableParcels(nearbyParcels)
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
        addSecondaryFeatureToMap
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

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>

}

export default function UseAppContext(){
    const context = useContext(AppContext)
    if (context === undefined){
        throw new Error("UseAppContext must be used within AppContext");
    }
    return context
}