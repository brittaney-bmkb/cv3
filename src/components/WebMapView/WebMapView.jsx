
import { useEffect, useRef } from "react";
import UseAppContext from "../../contexts/AppContext";

export default function WebMapView(){

    const { loadMap, setMapContainer, mapContainer, mapClickEventHandler} = UseAppContext()
    const mapDiv = useRef(null)

    useEffect(() => {
        const createMap = async () => {
            if(mapDiv.current){
                await setMapContainer(mapDiv.current) 
            }
            if(mapContainer){
                await loadMap()
            }
        }

        createMap();

    }, [mapContainer])

    return (
        <div id="MAPCONTAINER" ref={mapDiv} style={{width: '100%', height: '100%'}} onClick={mapClickEventHandler}></div>
            )            
}
