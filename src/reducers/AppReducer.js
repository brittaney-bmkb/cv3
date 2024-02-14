export const initialState = {

    //MAP
    mapView:null,
    mapContainer:null,
    primaryResultFeature: null,
    searchResults: null,
    searchSources: null,
    searchFeatures: null,
    panelDisplay:null,
    panelPrimaryVisible:null,
    panelSecondaryVisible:null,
    panelDisplaySecondary:null,
    dataDictionary:null,
    parcelQueryFields: null,
    screenWidth: null,
    newSearch:null,
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
                primaryResultFeature:payload.primaryResultFeature,
                newSearch:payload.newSearch
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
        case "SET_PANEL_PRIMARY_VISIBILTIY":
            console.log("SET_PANEL_PRIMARY_VISIBILTIY")
            return {
                ...state,
                panelPrimaryVisible: payload.panelPrimaryVisible,
            }
        case "SET_PANEL_SECONDARY_VISIBILTIY":
            console.log("SET_PANEL_SECONDARY_VISIBILTIY")
            return {
                ...state,
                panelSecondaryVisible: payload.panelSecondaryVisible,
            }
        case "SET_DATA_DICTIONARY":
            console.log("SET_DATA_DICTIONARY")
            return {
                ...state,
                dataDictionary: payload.dataDictionary,
            }

        case "SET_PARCEL_QUERY_FIELDS":
            console.log("SET_PARCEL_QUERY_FIELDS")
            return {
                ...state,
                parcelQueryFields: payload.parcelQueryFields,
            }

        case "SET_SCREEN_WIDTH":
            console.log("SET_SCREEN_WIDTH")
            return {
                ...state,
                screenWidth: payload.screenWidth,
            }
        default:
            throw new Error(`No valid selection made`)
    }
}

export default AppReducer