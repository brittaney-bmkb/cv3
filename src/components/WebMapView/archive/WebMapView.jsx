
import { useEffect, useRef, useState } from "react";
import UseAppContext from "../../../contexts/AppContext";
// import { view } from "../../arcgis/webmap/webmap";
import StyledButtonFilledPrimary, { ToggleIconButton } from "../../Button/Button";
import { Box, Fade, IconButton, Typography } from "@mui/material";
import TableRowsOutlinedIcon from '@mui/icons-material/TableRowsOutlined';
import MapButtonGroup from "../../MapButtonGroup";
import { theme } from "../../../theme";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";


export default function WebMapView(){

    const { comparableParcels, measureWidgetState, measureWidget, queryMapPoint, panelWidgetVisible, setShowMapMoblie, loadMap, setMapContainer, mapContainer, addSecondaryFeatureToMap, secondaryResultFeature, translateText, screenWidth} = UseAppContext()
    const mapDiv = useRef(null)
    const mapButtonGroupRef = useRef(null);
    const toggleButton = useRef(null);
    const [mapButtonsExist, setMapButtonsExist] = useState(false)

    const handleClick = () => {
        console.log("Setting secondary panel display")
        setShowMapMoblie( false)
    }

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
        // Define event handler function
        const handleClick = async (event) => {
            // console.log("measure widget state: ", measureWidgetState);
            // console.log("measure widget: ", measureWidget);
            // if (measureWidget && measureWidgetState) {
            //     console.log("Measure session. Blocking map view click");
            // } else {
            //     console.log("WEBMAPVIEW: Click event emitted: ", event);
            //     console.log("measure widget state: ", measureWidgetState);
                let point = event.mapPoint;
                console.log("View Map Point", point);

                // if(comparableParcels){
                //     console.log("comparable parcels detected")
                //     await querySecondaryPoint(point)
                // }
                //else{
                    await queryMapPoint(point, comparableParcels)
                //}
                
            //}
        };
    
        // Watch for the click event on the view
        const watcher = reactiveUtils.on(
            () => view,
            "click",
            handleClick // Pass the handleClick function directly
        );
    
        // Cleanup function
        return () => {
            watcher.remove();
        };
    },[comparableParcels]);


    useEffect(() => {
        const updateMap = async () => {
            if(secondaryResultFeature)
            addSecondaryFeatureToMap()
        }

        updateMap()
    },[secondaryResultFeature])

    return (
        <Box width='100%' height='100%' display="flex" alignItems={screenWidth <= theme.breakpoints.values.md ? "center" : "left"} justifyContent={screenWidth <= theme.breakpoints.values.md ? "center" : "left"} position="relative">
        <div 
        id="MAPCONTAINER" 
        ref={mapDiv} 
        style={{width: '100%', height: '100%', zIndex: 1}} 
        // onClick={mapClickEventHandler}
        >

        </div>
                <Box 
                display="flex" 
                id="mapButtonGroup"  
                ref={mapButtonGroupRef}
                justifyContent={screenWidth < theme.breakpoints.values.md ? "center" : "left"}
                pt={2}
                sx={{boxSizing:"border-box"}}
                position="absolute"
                zIndex={2}
                top={1}
                height="auto"
                width="auto"
                // ref={mapButtonGroupRef}
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
                <TableRowsOutlinedIcon htmlColor="white"/>
                <Typography variant="subtitle1" color="white">{translateText("Data")}</Typography>
            </IconButton>
        </Fade>

        </Box>

            )            
}
