
import UseAppContext from "../../contexts/AppContext";

import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import { config } from "../../data/config";
import { useEffect } from "react";

const Map = () => {

    const { 
        setMapView, 
        arcgisMapRef,
        primaryResultFeature,
        newSearch
        
        } = UseAppContext()

    const addLayerToMap = async (source, title, theme, type) => {
    
            //////console.log(`adding ${title} layer to map`)
    
            if(arcgisMapRef.current){
    
                let map = arcgisMapRef.current.map
                
                await removeLayer(map, title)
    
                if(title === "Comparable Parcels"){
                    await removeLayer(map, "Selected Comparable Parcel")
                }
                

                //COME BACK HERE AND TRY UPDATING SYMBOLOGY RATHER THAN CREATING NEW FEATURES
                if(source){
                    let featLayer 
                    if(type === "graphics"){
                        featLayer = await createFeatureLayerFromGraphics(source, "OBJECTID", "polygon", title, theme)
                    }
                    if(type === "features"){
                        featLayer = await createFeatureLayerFromFeatures(source, title, theme)
                    }
                    
                    if(featLayer){
                        map.add(featLayer)
                    }
                    
                }
    
            }
        }

    const zoomToExtent = async (features) => {

        let extent

        if(Array.isArray(features)){
            const geometries = features.map((feature) => feature.geometry);
            //console.log("geometries: ", geometries)
            if(geometries?.length > 0){
                extent = geometryEngine.union(geometries);
            }
            
        }

        else{
            if('geometry' in features){
                extent = features.geometry
            }
            else{
                //////console.log("zoom to extent: ", features)
                //////console.log("quering extent ")
                extent = await features.queryExtent()
            }
        }
        
        if(extent){
            arcgisMapRef.current.goTo(extent)
        }
        
    }

    useEffect(() => {
        if(arcgisMapRef.current){

        }
    },[primaryResultFeature, newSearch])

    return(
        <arcgis-map
        ref={arcgisMapRef}
        item-id={config.webmap_id}
        zoom={8}

        onarcgisViewReadyChange={(event) => {
            setMapView(event.target.view)
            }}
        onarcgisViewClick={(event) => {
            
            if(event.detail.native.button === 2){
                return
            }
            else{

                //query map click
            }
        }}
        >   
        <arcgis-zoom position="top-right"/>
        </arcgis-map>
    )
}

export default Map