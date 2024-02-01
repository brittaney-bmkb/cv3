export const initialState = {

    //MAP
    mapView:null,
    mapContainer:null,
    primaryResultFeature: null,
    searchResults: null,
    searchSources: null

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
            }
        case "SET_SEARCH_SOURCES":
            console.log("SET_SEARCH_SOURCES")
            return {
                ...state,
                searchSources: payload.searchSources,
            }
        default:
            throw new Error(`No valid selection made`)
    }
}

export default AppReducer