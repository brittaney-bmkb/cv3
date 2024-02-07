import { createContext, useContext, useReducer } from "react";
import AppReducer, { initialState } from '../reducers/AppReducer'
import { useSearchParams } from "react-router-dom";
import { config } from "../data/config";


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

    const setPrimaryResultFeature = (feature) => {
        dispatch({
            type:"SET_PRIMARY_RESULT_FEATURE",
             payload: {
                primaryResultFeature: feature,
            }
        })
    } 

    const loadMap = async () => {

        const {initializeMap} = await import('../arcgis/webmap/webmap')
        const {mapContainer} = state

        let view, searchSources = await initializeMap(mapContainer)

        setMapView(view)
        setSearchSources(searchSources)

    }

    const loadDataDictionary = async () => {

        const { readFeatureLayerData } = await import('../arcgis/layers/layers')

        let { features } = await readFeatureLayerData(config.data_dictionary, ["*"], "FID IS NOT NULL")

        console.log("data dictionary: ", features)
    }

    const mapClickEventHandler = async (event) => {

        const { onViewClick } = await import('../arcgis/webmap/webmap')
        const { searchResults } = state
        console.log("Handler Event: ", event)

        const selectedFeatures = await onViewClick()

        setPrimaryResultFeature(selectedFeatures[0])

        // setSearchResults(searchResults, selectedFeatures)
        setPanelDisplay("resultsList")

        setPanelPrimaryVisibility(true)
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

    const selectResultFromList = async (result) => {
        console.log("Result PIN : ", result)
        const { searchFeatures } = state
        const selectedFeature = searchFeatures.filter((feature) => feature.attributes['PIN14'] == result)
        console.log("selectedFeature: ", selectedFeature)

        setPrimaryResultFeature(selectedFeature[0])

        //update graphic in map
        const { createGraphic } = await import('../arcgis/webmap/webmap')

        createGraphic(selectedFeature, true, "darkBlue")

    }


    const renderSearchResults = async () => {
        const { querySearchResults } = await import('../arcgis/webmap/webmap')
        const { searchResults } = state

        const features = await querySearchResults(searchResults)
        setSearchResults(searchResults, features)
        setPanelDisplay("resultsList")
        

    }

    const clearResults = async () => {
        const { removeGraphics } = await import('../arcgis/webmap/webmap')
        
        setSearchResults(null, null)
        removeGraphics();
    }

    const searchComparableProperties = async () => {

        const { compareProperities } = await import('../arcgis/webmap/webmap')
        const { primaryResultFeature } = state

        compareProperities(primaryResultFeature)

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
        loadDataDictionary
    }


    return <AppContext.Provider value={value}>{children}</AppContext.Provider>

}

export default function UseAppContext(){
    const context = useContext(AppContext)
    if (context === undefined){
        throw new Error("UseAppContext must be used within AppContext");
    }
    return context
}