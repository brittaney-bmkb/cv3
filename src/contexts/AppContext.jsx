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

    const loadMap = async () => {

        const {initializeMap} = await import('../arcgis/webmap/webmap')
        const {mapContainer} = state

        let view, searchSources = await initializeMap(mapContainer)

        setMapView(view)
    }

    const mapClickEventHandler = async (event) => {

        const { onViewClick } = await import('../arcgis/webmap/webmap')

        onViewClick(event)
    }


    const value = {
        mapContainer: state.mapContainer,
        loadMap,
        setMapContainer,
        mapView: state.mapView,
        mapClickEventHandler
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