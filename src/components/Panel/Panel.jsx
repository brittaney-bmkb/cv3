import { Box, Paper, Slide, Typography } from "@mui/material";
import ResultsList from "../ResultList/ResultsList";
import UseAppContext from "../../contexts/AppContext";
import PropertyDetail from "../PropertyDetail/PropertyDetail";
import ComparablePropertySearch from "../ComparableProperty/ComparablePropertySearch";
import BasemapWidget from "../Widgets/BasemapWidget";
import LayersWidget from "../Widgets/LayersWidget";
import MeasureWidget from "../Widgets/MeasureWidget";
import PrintWidget from "../Widgets/PrintWidget";
import PanelHeader from "./PanelHeader";
import { height } from "@mui/system";
import { theme } from "../../theme";
import PanelContent from "./PanelContent";
import { useEffect, useState } from "react";
import WebMapView from "../WebMapView/WebMapView";
import { ToggleIconButton } from "../Button/Button";
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';


const PanelMobile = () => {  

    const { panelDisplay, translateText, showMapMobile, setShowMapMoblie } = UseAppContext()

    const handleClick = () => {
        setShowMapMoblie(true)
    }

    return(
        <Box 
            id="mobile-panel"
            height={200}
            width="100%"
            display="flex"
            bgcolor="white" 
            //pb={3}
            flex={1}
            flexGrow={1}  
            flexDirection="column">
                {showMapMobile === true ? <WebMapView/> : 
                <PanelContent display={panelDisplay}/>}
                <Box display={showMapMobile === false ? "flex" : "none"} justifyContent="center">
                    <ToggleIconButton
                    text={translateText("Map")}
                    icon={<MapOutlinedIcon/>}
                    onClick={handleClick}
                    />
                </Box>
                
        </Box>
    )
}

export const SecondaryPanel = () => {  

    const { panelSecondaryVisible, panelDisplaySecondary } = UseAppContext()

    return(
        //sx style this adjust the right left or panel will show up. 
        //sm is a block 
        <Box 
            id="right-panel"
            minHeight={0}
            bgcolor="white" 
            flex={1}
            flexGrow={1}
            minWidth={350} 
            p={2}  
            sx={{boxSizing:"border-box",
                display:{xs:'none', sm: 'none', md: panelSecondaryVisible? 'flex':"none", lg:panelSecondaryVisible? 'flex':"none"}}}>
                <PanelContent id="panel-content" display={panelDisplaySecondary}/>
        </Box>
    )
}

export const WidgetPanel = () => {

    const { panelDisplayWidget, panelWidgetVisible } = UseAppContext()

    return(
        <Box
            id="widget-panel"
            minHeight={0}
            bgcolor="white" 
            flex={1}
            flexGrow={1}
            width={350} 
            height={"100%"}
            p={2} 
            sx={{boxSizing:"border-box",
            zIndex:"modal",
            position:"fixed",
            right:0,
            display:{xs:'none', sm: 'none', md: panelWidgetVisible? 'flex':"none", lg:panelWidgetVisible? 'flex':"none"}
            }}
            >
            <PanelContent id="panel-widget" display={panelDisplayWidget}/>
        </Box>
    )
}



export const LeftPanel = () => {

    const { panelPrimaryVisible, setPanelSecondaryVisibility, panelDisplaySecondary, setPanelDisplaySecondary, panelDisplay, screenWidth, setPanelDisplay, setPanelPrimaryVisibility, primaryResultFeature, panelSecondaryVisible } = UseAppContext()

    useEffect(() => {
        const secondaryDisplays = ["propertyDetailComparable","propertyDetailNearby", "comparablePropertySearch", "resultsListComparables", "nearbyProperties"]
        const isPrimaryPanel = secondaryDisplays.includes(panelDisplay);
        const isSecondaryPanel = secondaryDisplays.includes(panelDisplaySecondary);
        const isLargeScreen = screenWidth >= theme.breakpoints.values.lg
      
        // Determine the display value based on the current panel and screen width
        const displayValue = (screenWidth >= theme.breakpoints.values.lg && isSecondaryPanel) ? panelDisplay : panelDisplaySecondary;
      
        // Set visibility and display values accordingly
        // setPanelPrimaryVisibility(true);
        if(isLargeScreen && isPrimaryPanel){
            setPanelSecondaryVisibility(true)
            setPanelDisplaySecondary(panelDisplay)
            setPanelDisplay("propertyDetail")
        }

        if(!isLargeScreen && isSecondaryPanel){
            setPanelSecondaryVisibility(false)
            setPanelDisplay(panelDisplaySecondary)
        }
      
      }, [screenWidth]);
      
      

    return(
        <Box 
            id="left-panel"
            minHeight={0}
            bgcolor="white" 
            flex={1}
            minWidth={350}  
            flexDirection="column" 
            p={2}  
            sx={{boxSizing:"border-box", display:{xs:'none', sm: panelPrimaryVisible ? 'flex' : 'none'}}}>
                <PanelContent id="panel-content" display={panelDisplay}/>
        </Box>
        
    )
}

export const BottomPanel = () => {

    const { panelWidgetVisible, panelDisplayWidget } = UseAppContext()

    const widgetDisplayed = ["measureWidget","layersWidget","basemapsWidget","printWidget"].includes(panelDisplayWidget)

    return(
        <Slide direction="up" in={panelWidgetVisible} mountOnEnter unmountOnExit>
            <Box 
            id="bottom-panel"
            // minHeight={0}
            height="auto"
            maxHeight="50vh"
            minHeight={250}
            bgcolor="white" 
            flexDirection="column"  
            p={2}  
            sx={{
                boxSizing:"border-box",
                display:{
                    xs:panelWidgetVisible && widgetDisplayed ? 'flex' :'none', 
                    sm:panelWidgetVisible && widgetDisplayed ? 'flex' :'none', 
                    md: 'none'}, 
                }} 
                width="100%" 
                >
                <PanelContent id="panel-content" display={panelDisplayWidget}/>
            </Box>
        </Slide>

    )
}

export default PanelMobile