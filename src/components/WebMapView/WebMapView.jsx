
import { useEffect, useRef } from "react";
import UseAppContext from "../../contexts/AppContext";
import { useSearchParams } from "react-router-dom";
import { config } from "../../data/config";

export default function WebMapView(){

    const { primaryResultFeature, renderSearchResults, searchResults, loadMap, setMapContainer, mapContainer, mapClickEventHandler} = UseAppContext()
    const mapDiv = useRef(null)

    //get url parameters
    const [routeParams, setSearchParams] = useSearchParams()

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


    useEffect(() => {

        const updateMap = async () => {
            if(searchResults){
                renderSearchResults()
            }
        }

        updateMap()
    }, [searchResults])


    useEffect(() => {

        const updateUrlParam = async () => {
            if(primaryResultFeature){
                 //update url params for selected feature
                let location = primaryResultFeature.attributes[config.target_layer_id_field]
                setSearchParams({'location': location})
                }
        }

        updateUrlParam()
    }, [primaryResultFeature])

    return (
        <div id="MAPCONTAINER" ref={mapDiv} style={{width: '100%', height: '100%'}} onClick={mapClickEventHandler}></div>
            )            
}
