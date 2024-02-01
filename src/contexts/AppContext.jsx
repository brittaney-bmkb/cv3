import { createContext, useContext, useReducer } from "react";
import AppReducer, { initialState } from '../reducers/AppReducer'

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

    const mapClickEventHandler = async (event) => {

        const { onViewClick } = await import('../arcgis/webmap/webmap')
        const { searchResults } = state
        console.log("Handler Event: ", event)

        const selectedFeature = await onViewClick(event)
        setPrimaryResultFeature(selectedFeature)
        setSearchResults(searchResults, selectedFeature)
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

    const renderSearchResults = async () => {
        const { querySearchResults } = await import('../arcgis/webmap/webmap')
        const { searchResults } = state

        const features = await querySearchResults(searchResults)
        setSearchResults(searchResults, features)

    }

    const clearResults = async () => {
        const { removeHighlight } = await import('../arcgis/webmap/webmap')
        
        removeHighlight();
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
        searchFeatures: state.searchFeatures
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