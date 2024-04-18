import { ArcgisMap } from "@arcgis/map-components-react"
import { useEffect, useRef, useState } from "react";

const WebMapComponentBeta = () => {

    const arcgisMapRef = useRef(null)
    const [mapLoading, setMapLoading] = useState(true)

    useEffect(() => {

        if(arcgisMapRef && mapLoading === false){
            console.log(arcgisMapRef.current.view)
        }

    }, [arcgisMapRef, mapLoading])

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