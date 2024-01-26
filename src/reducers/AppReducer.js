export const initialState = {

    //MAP
    mapView:null,
    mapContainer:null

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
        default:
            throw new Error(`No valid selection made`)
    }
}

export default AppReducer