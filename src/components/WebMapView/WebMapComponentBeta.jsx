import { ArcgisMap } from "@arcgis/map-components-react"
import { useEffect, useRef, useState } from "react";
import UseAppContext from "../../contexts/AppContext";
import { createFeatureLayerFromFeatures, removeLayer } from "../../arcgis/layers/layers";
import { theme } from "../../theme";

const WebMapComponentBeta = () => {

    const { primaryResultFeature, setMapView } = UseAppContext()

    const arcgisMapRef = useRef(null)
    const [mapLoading, setMapLoading] = useState(true)

    const addLayerToMap = async (features, title, theme) => {
        if(arcgisMapRef.current && mapLoading === false){

            let map = arcgisMapRef.current.map
            let view = arcgisMapRef.current.view

            await removeLayer(map, title)

            if(features){
                let featLayer = await createFeatureLayerFromFeatures(features, title, theme)

                map.add(featLayer)

                let extent = await featLayer.queryExtent()

                console.log("queried extent: ", extent)

                arcgisMapRef.current.goTo(extent)

                setMapView(view)
            }

        }
    }

    useEffect(() => {

        if(arcgisMapRef && mapLoading === false){
            console.log(arcgisMapRef.current.view)
        }

    }, [arcgisMapRef, mapLoading])

    useEffect(() => {

        addLayerToMap(primaryResultFeature, "Selected Parcel", theme.layers.primary)

    }, [ primaryResultFeature ])

    return(
        <ArcgisMap
        ref={arcgisMapRef}
        itemId="779a9643c58f4a48a002a9b277a8bcc7"
        onArcgisViewReadyChange={(event) => {
            console.log('MapView ready', event);
            setMapLoading(false)
            
            }}
        >

        </ArcgisMap>
    )
}

export default WebMapComponentBeta