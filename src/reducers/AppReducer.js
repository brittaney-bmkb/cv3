export const initialState = {

    //MAP
    mapView:null,
    mapContainer:null,
    primaryResultFeature: null,
    searchResults: null,
    searchSources: null,
    searchFeatures: null,
    panelDisplay:null,
    panelSecondaryVisible:null,
    panelDisplaySecondary:null,

}

const AppReducer = (state, action) => {

    const {type, payload} = action

    switch(type){
        case "SET_MAP_CONTAINER":
        console.log("SET_MAP_CONTAINER")
        return {
            ...state, 
            mapContainer: payload.mapContainer
        }
        case "SET_MAP_VIEW":
            console.log("SET_MAP_VIEW")
            return{
                ...state,
                mapView:payload.mapView
            }
        case "SET_PRIMARY_RESULT_FEATURE":
            console.log("SET_PRIMARY_RESULT_FEATURE: ", payload.primaryResultFeature)
            return{
                ...state,
                primaryResultFeature:payload.primaryResultFeature
            }
        
        case "SET_SEARCH_RESULT":
            console.log("SET_SEARCH_RESULT")
            return {
                ...state,
                searchResults: payload.searchResults,
                searchFeatures: payload.searchFeatures
            }
        case "SET_SEARCH_SOURCES":
            console.log("SET_SEARCH_SOURCES")
            return {
                ...state,
                searchSources: payload.searchSources,
            }

        case "SET_PANEL_DISPLAY":
            console.log("SET_PANEL_DISPLAY")
            return {
                ...state,
                panelDisplay: payload.panelDisplay,
            }
        case "SET_PANEL_SECONDARY_DISPLAY":
            console.log("SET_PANEL_SECONDARY_DISPLAY")
            return {
                ...state,
                panelDisplaySecondary: payload.panelDisplaySecondary,
            }
        case "SET_PANEL_SECONDARY_VISIBILTIY":
            console.log("SET_PANEL_SECONDARY_VISIBILTIY")
            return {
                ...state,
                panelSecondaryVisible: payload.panelSecondaryVisible,
            }
        default:
            throw new Error(`No valid selection made`)
    }
}

export default AppReducer