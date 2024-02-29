
import { useEffect, useRef, useState } from "react";
import UseAppContext from "../../contexts/AppContext";
import { view } from "../../arcgis/webmap/webmap";
import StyledButtonFilledPrimary, { ToggleIconButton } from "../Button/Button";
import { Box } from "@mui/material";
import TableRowsOutlinedIcon from '@mui/icons-material/TableRowsOutlined';
import MapButtonGroup from "../MapButtonGroup";
import { theme } from "../../theme";


export default function WebMapView(){

    const { panelDisplaySecondary, setShowMapMoblie, loadMap, setMapContainer, mapContainer, mapClickEventHandler, addSecondaryFeatureToMap, secondaryResultFeature, translateText, screenWidth} = UseAppContext()
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

            // if(view){
            //     if(!view.ui.find("mapButtonGroup")){
            //         setMapButtonsExist(true)
            //         view.ui.add("mapButtonGroup", "manual")
            //     }
                
            //     view.ui.add("toggleButton", "manual")
            // }
        }

        createMap();

    }, [mapContainer])

    // useEffect(() => {
    //     const updateButtonStyle = async () => {
    //         if(mapButtonGroupRef.current && view.ui.find("mapButtonGroup")){
    //             //remove esri widget style
                
    //             mapButtonGroupRef.current.style.boxShadow = "none"
    //             mapButtonGroupRef.current.style.position = "relative"
    //         }
    //     }

    //     updateButtonStyle();

    // }, [mapButtonGroupRef])

    useEffect(() => {
        const updateMap = async () => {
            if(secondaryResultFeature)
            addSecondaryFeatureToMap()
        }

        updateMap()
    },[secondaryResultFeature])

    return (
        <Box width='100%' height='100%' display="flex" justifyContent="center" position="relative">
        <div id="MAPCONTAINER" ref={mapDiv} style={{width: '100%', height: '100%'}} onClick={mapClickEventHandler}></div>
                <Box 
                display="flex" 
                id="mapButtonGroup"  ref={mapButtonGroupRef}
                justifyContent={screenWidth < theme.breakpoints.values.md ? "center" : "left"}
                p={2}
                position="absolute"
                top={1}
                // ref={mapButtonGroupRef}
                >

                    <MapButtonGroup/>
                    
                    </Box>
                   
        <Box 
        display={{xs:"flex", sm: "none"}}
        id="toggleButton" 
        ref={toggleButton} 
        position="absolute"
        bottom={1}
        left="45%">
            <ToggleIconButton 
            text={translateText("Data")}
            icon={<TableRowsOutlinedIcon/>}
            onClick={handleClick}
            /></Box>
        </Box>

            )            
}
