
import UseAppContext from "../../contexts/AppContext";

import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import { config } from "../../data/config";
import { useEffect, useState } from "react";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";

const Map = () => {

    const { 
        setMapView, 
        arcgisMapRef,
        primaryResultFeature,
        newSearch,
        queryPolygon,
        selectPanelClosed,
        togglePanel,
        searchFeatures
        } = UseAppContext()

    const [parcelLayer, setParcelLayer] = useState(null)
    const [highlightSelect, setHighlightSelect] = useState(null)
    
    
    const findTargetLayer = (map) => {

        let layer = map.allLayers.find((layer) => {
            ////////console.log("Layer details: ", layer)
            return `${layer.url}/${layer.layerId}` === config.target_layer_url
        })

        return layer
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

    const handleViewClick = async (event) => {

        console.log("Map Clicked")
        
        if(!arcgisMapRef.current){
            return
        }

        const view = arcgisMapRef.current.view

        //prevent selection using right mouse click
        if(event.detail.native.button === 2){
            return
        }
        //select parcel using screen point
        let mapPoint = event.detail.mapPoint;

        const features = await queryPolygon(mapPoint, true) 
          
        if( features?.length === 1){
            togglePanel('property')
        }
        else{
            togglePanel('search')
        }

            
    }

    const handleParcelSelection = async () => {

        if(!arcgisMapRef.current?.view){
            return
        }
        
        const view = arcgisMapRef.current?.view

        console.log("highlighed layer: ", highlightSelect)
                    
        highlightSelect?.remove();

        const layerView = await view.whenLayerView(parcelLayer)
        const highlight = layerView.highlight(primaryResultFeature, {name: "default"})

        //highlight selection
        setHighlightSelect(highlight)

        //Zoom to layer
        zoomToExtent(primaryResultFeature)
    }

    const handleViewReady = async (event) => {

        if(!arcgisMapRef.current){
            return
        }

        const map = arcgisMapRef.current.map
        const view = arcgisMapRef.current.view

        //prevent map rotation
        view.constraints = {
            rotationEnabled: false
        }

        //set view highlight options
        const highlights = [
            {
            name: "default",
            color:  "#0D4D96",
            haloOpacity: 1,
            haloColor: "#0D4D96",
            fillOpacity: 0.1,
            }
        ]

        view.highlights = highlights

        setMapView(view)

        //find parcel layer
        const targetLayer = await findTargetLayer(map)
        setParcelLayer(targetLayer)
    }

    //Clear all highlights when parcels are cleared
    useEffect(() => {

        console.log("primary feature selection updated: ", primaryResultFeature)

        if(!searchFeatures || !searchFeatures[0]){
            highlightSelect?.remove()
        }
        else{
            if(parcelLayer){
                handleParcelSelection()
            }
        }

    }, [primaryResultFeature, parcelLayer, searchFeatures])

    return(
        <arcgis-map
        ref={arcgisMapRef}
        item-id={config.webmap_id}
        zoom={8}

        onarcgisViewReadyChange={(event) => {handleViewReady(event)}}
        onarcgisViewClick={(event) => {
            if(selectPanelClosed){
                handleViewClick(event)
            }
            
        }}
        >   
        <arcgis-zoom position="top-right"/>
        </arcgis-map>
    )
}

export default Map