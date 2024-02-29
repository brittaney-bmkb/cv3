
import { useEffect, useRef } from "react";
import UseAppContext from "../../contexts/AppContext";
import { view } from "../../arcgis/webmap/webmap";
import StyledButtonFilledPrimary, { ToggleIconButton } from "../Button/Button";
import { Box } from "@mui/material";
import TableRowsOutlinedIcon from '@mui/icons-material/TableRowsOutlined';
import MapButtonGroup from "../MapButtonGroup";
import { theme } from "../../theme";


export default function WebMapView(){

    const { loadMap, setMapContainer, mapContainer, mapClickEventHandler, addSecondaryFeatureToMap, secondaryResultFeature, translateText, screenWidth} = UseAppContext()
    const mapDiv = useRef(null)
    const mapButtonGroupRef = useRef(null);
    const toggleButton = useRef(null);

    useEffect(() => {
        const createMap = async () => {
            if(mapDiv.current){
                await setMapContainer(mapDiv.current) 
            }
            if(mapContainer){
                await loadMap()
                view.ui.add("mapButtonGroup", "manual")
                view.ui.add("toggleButton", "manual")
            }
        }

        createMap();

    }, [mapContainer])

    useEffect(() => {
        const updateButtonStyle = async () => {
            if(mapButtonGroupRef.current){
                //remove esri widget style
                mapButtonGroupRef.current.style.boxShadow = "none"
                mapButtonGroupRef.current.style.position = "relative"
            }
        }

        updateButtonStyle();

    }, [mapButtonGroupRef])

    useEffect(() => {
        const updateMap = async () => {
            if(secondaryResultFeature)
            addSecondaryFeatureToMap()
        }

        updateMap()
    },[secondaryResultFeature])

    return (
        <Box width='100%' height='100%'>
        <div id="MAPCONTAINER" ref={mapDiv} style={{width: '100%', height: '100%'}} onClick={mapClickEventHandler}></div>
        <Box 
        display="flex" 
        id="mapButtonGroup" 
        justifyContent={screenWidth < theme.breakpoints.values.md ? "center" : "left"}
        p={2}
        alignContent="center"
        ref={mapButtonGroupRef}>
            <MapButtonGroup/></Box>
        <Box 
        display={{xs:"block", sm: "none"}}
        id="toggleButton" 
        ref={toggleButton} 
        bottom={20} 
        left="45%">
            <ToggleIconButton 
            text={translateText("Data")}
            icon={<TableRowsOutlinedIcon/>}
            /></Box>
        </Box>

            )            
}
