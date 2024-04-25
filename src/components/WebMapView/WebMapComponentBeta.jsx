import { ArcgisMap, ArcgisZoom } from "@arcgis/map-components-react"
import { useEffect, useRef, useState } from "react";
import UseAppContext from "../../contexts/AppContext";
import { createFeatureLayerFromFeatures, removeLayer } from "../../arcgis/layers/layers";
import { theme } from "../../theme";
import MapButtonGroup from "../MapButtonGroup";
import { Box, Fade, Typography, IconButton } from "@mui/material";
import { TableRowsOutlined } from "@mui/icons-material";

const WebMapComponentBeta = () => {

    const { 
        primaryResultFeature, 
        setMapView, 
        queryMapPoint, 
        comparableParcels, 
        secondaryResultFeature,
        screenWidth,
        panelWidgetVisible,
        translateText,
        setShowMapMoblie,
        searchSources
        } = UseAppContext()

    const arcgisMapRef = useRef(null)
    const [mapLoading, setMapLoading] = useState(true)

    const zoomToExtent = async (features) => {

        console.log("zoom to extent: ", features)
        let extent
        console.log("quering extent ")
        extent = await features.queryExtent()

        console.log("queried extent: ", extent)
        arcgisMapRef.current.goTo(extent)
    }

    const addLayerToMap = async (features, title, theme) => {

        console.log("adding layer to map")

        if(arcgisMapRef.current && mapLoading === false){

            let map = arcgisMapRef.current.map
            
            await removeLayer(map, title)

            if(title === "Comparable Parcels"){
                await removeLayer(map, "Selected Comparable Parcel")
            }
           

            if(features){
                let featLayer = await createFeatureLayerFromFeatures(features, title, theme)

                if(featLayer){
                    map.add(featLayer)

                    zoomToExtent(featLayer)
                }
                
            }

        }
    }

    const handleViewClick = async (mapPoint) => {

        await queryMapPoint(mapPoint)

    }

    const handleClick = () => {
        console.log("Setting secondary panel display")
        setShowMapMoblie( false)
    }

    useEffect(() => {

        if(arcgisMapRef && mapLoading === false && searchSources){
            console.log("loading new map: ", arcgisMapRef.current.view)

            let view = arcgisMapRef.current.view
            
            if(screenWidth < theme.breakpoints.values.md){
                view.ui.move("zoom", "bottom-right")
            }

            else{
                view.ui.move("zoom", "top-right")
            }
            
        }

    }, [arcgisMapRef, mapLoading, screenWidth, searchSources])

    useEffect(() => {

        addLayerToMap(primaryResultFeature, "Selected Parcel", theme.layers.primary)

    }, [ primaryResultFeature, arcgisMapRef, mapLoading ])

    useEffect(() => {

        addLayerToMap(comparableParcels, "Comparable Parcels", theme.layers.secondary)

    }, [ comparableParcels, arcgisMapRef, mapLoading ])

    useEffect(() => {

        addLayerToMap(secondaryResultFeature, "Selected Comparable Parcel", theme.layers.secondarySelected)

    }, [ secondaryResultFeature, arcgisMapRef, mapLoading ])

   
    return(
        <Box
        display="flex"
        width="100%"
        height="100%"
        justifyContent={screenWidth < theme.breakpoints.values.md ? "center" : "left"}
        >
        <ArcgisMap
        ref={arcgisMapRef}
        itemId="779a9643c58f4a48a002a9b277a8bcc7"
        // center = "-87.8298, 41.8781"
        // zoom={8}

        onArcgisViewReadyChange={(event) => {
            console.log('MapView ready', event);
            setMapLoading(false)
            setMapView(event.target.view)
            }}
        // onArcgisViewChange={(event) => {
        //     console.log("view change: ", event)
            
        // }}
        onArcgisViewClick={(event) => {
            //console.log("onArcgisViewClick: ", event)
            handleViewClick(event.detail.mapPoint)
        }}
        >   
        </ArcgisMap>
        <Box 
            id="mapButtonGroup"
            // justifyContent={screenWidth < theme.breakpoints.values.md ? "center" : "left"} 
            position="absolute" 
            pt={2}
            pl={screenWidth < theme.breakpoints.values.md ? 0 : 2}
            zIndex={2}
            sx={{boxSizing:"border-box"}}
            height="auto"
            width="auto"
            >
                <MapButtonGroup/>
            </Box>

            <Fade 
                appear
                in={!panelWidgetVisible}>
                    <IconButton 
                    onClick={handleClick}
                    sx={{
                        position: "absolute",
                        bgcolor:theme.palette.primary.main, 
                        zIndex:"modal",
                        display:!panelWidgetVisible && screenWidth <= theme.breakpoints.values.sm ? "flex" : "none",
                        width:50,
                        height:50,
                        flexDirection:"column",
                        bottom:20,
                        boxShadow:5
                        }}>
                        <TableRowsOutlined htmlColor="white"/>
                        <Typography variant="subtitle1" color="white">{translateText("Data")}</Typography>
                    </IconButton>
                </Fade>
        </Box>
        

    )
}

export default WebMapComponentBeta