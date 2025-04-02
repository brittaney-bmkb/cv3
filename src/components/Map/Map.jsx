
import UseAppContext from "../../contexts/AppContext";

import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-legend";
import * as unionOperator from "@arcgis/core/geometry/operators/unionOperator.js";

import { config } from "../../data/config";
import { useEffect, useRef, useState } from "react";
import ActionBarMap from "../ActionBar/ActionBarMap";


//set view highlight options
//https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html#highlights
const highlights = [
    {
    name: "default", //this is the highlight config for the primary selected parcel
    color:  "#FFD700",
    haloOpacity: 1,
    haloColor: "#FFD700",
    fillOpacity: .1,
    },
    {
    name: "compare", //this is the highlight for comparables - will eventually be used for nearby
    color:  "#FFA500",
    haloOpacity: 1,
    haloColor: "#FFA500",
    fillOpacity: 0,
    },
    {
    name: "compare-select", //this is the highlight for comparable parcel that is selected - will eventually be used for nearby
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

        if(!features) return;

        let extent

        if(Array.isArray(features)){
            const geometries = features.map((feature) => feature.geometry);
            console.log("geometries: ", geometries)
            if(geometries?.length > 0){
                extent = unionOperator.executeMany(geometries);
            }
            
        }

        else{
               extent = features.geometry
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

        if(!arcgisMapRef.current) return;

        const view = arcgisMapRef.current.view

        if(!view || !parcelLayer) return;
        
        const layerView = await view.whenLayerView(parcelLayer)
        const highlight = await layerView.highlight(feature, {name: name})


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

        const primarySelection = async () => {

  
            if (!arcgisMapRef.current) return;
    
            const map = arcgisMapRef.current.map;
            
            if (!map) return;
    
            console.log("Updating labels")
            const targetLayer  = map.allLayers.find((layer) => layer.title === config.target_layer_name)
            //if targetlayer is not visible turn it on
            if(!targetLayer.visible || !targetLayer.parent.visible){
                targetLayer.visible = true
                targetLayer.parent.visible = true
            }


            console.log("highlightSelect: ", highlightSelect)
            highlightSelect?.remove()
    
            if(!searchFeatures || !searchFeatures[0]){
                highlightSelect?.remove()
            }
    
            if(parcelLayer && (primaryResultFeature || clickedFeature)){
                console.log("primary feature selection updated: ", primaryResultFeature? primaryResultFeature : clickedFeature)
                let highlight = await handleParcelSelection(primaryResultFeature? primaryResultFeature : clickedFeature, 'default')
                //highlight selection
                setHighlightSelect(highlight)
                if( primaryResultFeature?.length === 1){
                    togglePanel('property')
                }
                else{
                    togglePanel('search')
                }
            }
        }
        
        primarySelection()

    }, [primaryResultFeature, parcelLayer, searchFeatures, clickedFeature])


    useEffect(() => {

        const highlightComparables = async () => {
            console.log("highlightComparable: ", highlightComparable)
            highlightComparable?.remove()

            if(!comparableParcels || comparableParcels.length === 0){
                highlightComparable?.remove()
            }
            
            let highlight = await handleParcelSelection(comparableParcels, 'compare')
            setHighlightComparable(highlight)
        } 

        highlightComparables()


    }, [comparableParcels])

    useEffect(() => {

        const highlightSelectedComparable = async () => {
            highlightSelectComparable?.remove()
        
            if(!secondaryResultFeature){
                highlightSelectComparable?.remove()
            }
    
            let highlight = await handleParcelSelection(secondaryResultFeature, 'compare-select')
            setHighlightSelectComparable(highlight)
        }

        highlightSelectedComparable()

        
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
            {/* <arcgis-legend position="bottom-right" legend-style="classic"></arcgis-legend> */}
        </arcgis-map>
    </>
    )
}

export default Map