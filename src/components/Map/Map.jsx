
import UseAppContext from "../../contexts/AppContext";

import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import { config } from "../../data/config";
import { useEffect, useRef, useState } from "react";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";
import ActionBarMap from "../ActionBar/ActionBarMap";

//set view highlight options
//https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html#highlights
const highlights = [
    {
    name: "default",
    color:  "#0D4D96",
    haloOpacity: 1,
    haloColor: "#0D4D96",
    fillOpacity: .1,
    },
    {
    name: "compare",
    color:  "#FFA500",
    haloOpacity: 1,
    haloColor: "#FFA500",
    fillOpacity: 0,
    },
    {
    name: "compare-select",
    color:  "#FFA500",
    haloOpacity: 1,
    haloColor: "#FFA500",
    fillOpacity: .1,
    }
]



const Map = () => {

    const { 
        setMapView, 
        arcgisMapRef,
        primaryResultFeature,
        secondaryResultFeature,
        queryPolygon,
        selectPanelClosed,
        togglePanel,
        searchFeatures,
        isMobile,
        comparableParcels
        } = UseAppContext()
    
    const actionRef = useRef(null)
    const [parcelLayer, setParcelLayer] = useState(null)
    const [highlightSelect, setHighlightSelect] = useState(null)
    const [highlightSelectComparable, setHighlightSelectComparable] = useState(null)
    const [highlightComparable, setHighlightComparable] = useState(null)
    const [clickedFeature, setClickedFeature] = useState(null)
    
    
    const findTargetLayer = (map) => {

        let layer = map.allLayers.find((layer) => {
            ////////console.log("Layer details: ", layer)
            return `${layer.url}/${layer.layerId}` === config.target_layer_url
        })

        return layer
    }

    const zoomToExtent = async (features) => {

        console.log("features selected: ", features)

        let extent

        if(Array.isArray(features)){
            const geometries = features.map((feature) => feature.geometry);
            //console.log("geometries: ", geometries)
            if(geometries?.length > 0){
                extent = geometryEngine.union(geometries);
            }
            
        }

        else{
            // if('geometry' in features){
            //     extent = features.geometry
            // }
            // else{
                //////console.log("zoom to extent: ", features)
                //////console.log("quering extent ")
                extent = await features.queryExtent()
            //}
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

        console.log("Clicked Features: ", features)
        setClickedFeature(features)
          


            
    }


    const handleParcelSelection = async (feature, name) => {

        if(!arcgisMapRef.current?.view){
            return
        }
        
        const view = arcgisMapRef.current?.view

        // console.log("highlighed layer: ", highlightSelect)
                    
        //highlightSelect?.remove();

        const layerView = await view.whenLayerView(parcelLayer)
        const highlight = layerView.highlight(feature, {name: name})

 

        //Zoom to layer
        zoomToExtent(feature)

        return highlight
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


        

        view.highlights = highlights

        setMapView(view)

        //find parcel layer
        const targetLayer = await findTargetLayer(map)
        setParcelLayer(targetLayer)
    }

    //Clear all highlights when parcels are cleared
    useEffect(() => {

        highlightSelect?.remove()

        if(!searchFeatures || !searchFeatures[0]) return

        if(parcelLayer && (primaryResultFeature || clickedFeature)){
            console.log("primary feature selection updated: ", primaryResultFeature? primaryResultFeature : clickedFeature)
            let highlight = handleParcelSelection(primaryResultFeature? primaryResultFeature : clickedFeature, 'default')
            //highlight selection
            setHighlightSelect(highlight)
            if( primaryResultFeature?.length === 1){
                togglePanel('property')
            }
            else{
                togglePanel('search')
            }
        }
        

    }, [primaryResultFeature, parcelLayer, searchFeatures, clickedFeature])


    useEffect(() => {

        highlightComparable?.remove()

        if(!comparableParcels || comparableParcels.length === 0) return
        
        let highlight = handleParcelSelection(comparableParcels, 'compare')
        setHighlightComparable(highlight)

    }, [comparableParcels])

    useEffect(() => {

        highlightSelectComparable?.remove()
        
        if(!secondaryResultFeature) return

        let highlight = handleParcelSelection(secondaryResultFeature, 'compare-select')
        setHighlightSelectComparable(highlight)
        

        
    }, [secondaryResultFeature])

    useEffect(() => {

        if(!arcgisMapRef.current){
            return
        }

        const view = arcgisMapRef.current.view

        // Append ActionBarMap using ref
        if (actionRef.current && isMobile) {
            view.ui.add(actionRef.current, "top-right");
        }
        if(actionRef.current & !isMobile){
            view.ui.remove(actionRef.current);
    }

    }, [isMobile, actionRef, arcgisMapRef])

    return(
        <>
        {
            isMobile ?
            <div ref={actionRef} className="esri-widget">
                <ActionBarMap />
            </div> : null
        }
        

        {/* ArcGIS Map Component */}
        <arcgis-map
            ref={arcgisMapRef}
            item-id={config.webmap_id}
            zoom={8}
            onarcgisViewReadyChange={handleViewReady}
            onarcgisViewClick={(event) => {
                if (selectPanelClosed) {
                    handleViewClick(event);
                }
            }}
        >
            <arcgis-zoom position="top-right" />
        </arcgis-map>
    </>
    )
}

export default Map