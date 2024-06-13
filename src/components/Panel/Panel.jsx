import { Box, Fade, IconButton, Paper, Slide, Typography } from "@mui/material";
import UseAppContext from "../../contexts/AppContext";
import { theme } from "../../theme";
import PanelContent from "./PanelContent";
import { useEffect } from "react";
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import WebMapComponentBeta from "../WebMapView/WebMapComponentBeta";


const PanelMobile = () => {  

    const { panelDisplay, translateText, showMapMobile, setShowMapMoblie } = UseAppContext()

    const handleClick = () => {
        setShowMapMoblie(true)
    }

    return(
        <Box 
            id="mobile-panel"
            height="100%"
            width="100vw"
            display="flex"
            bgcolor="white" 
            alignItems="center" 
            justifyContent="center"
            flex={1}
            flexGrow={1}  
            flexDirection="column">
                <Box
                 display="flex"
                 pb={!showMapMobile? 6 : 0}
                 
                 height="100%"
                 width="100vw"
                 sx={{boxSizing:"border-box"}}
                >
                {
                showMapMobile === true ? <WebMapComponentBeta/> : 
                <PanelContent display={panelDisplay}/>
                }
                </Box>
                
                <Fade
                appear
                in={!showMapMobile}
                >
                    <IconButton 
                        onClick={handleClick}
                        sx={{
                            position: "absolute",
                            bgcolor:theme.palette.primary.main, 
                            zIndex:"modal",
                            display:!showMapMobile ? "flex" : "none",
                            width:50,
                            height:50,
                            flexDirection:"column",
                            bottom:20,
                            //left:"45%",
                            boxShadow:5
                            }}>
                            <MapOutlinedIcon htmlColor="white"/>
                            <Typography variant="subtitle1" color="white">{translateText("Map")}</Typography>
                    </IconButton>
                </Fade>
                {/* <Box display={showMapMobile === false ? "flex" : "none"} justifyContent="center">
                    <ToggleIconButton
                    text={translateText("Map")}
                    icon={<MapOutlinedIcon/>}
                    onClick={handleClick}
                    />
                </Box> */}
                
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

    const { setSelectMultiple, selectMultiple, panelDisplayWidget, panelWidgetVisible, panelSecondaryVisible } = UseAppContext()

    //turn off select multiple parcels if navigating way from select display
    useEffect(() => {

        if((panelDisplayWidget !== "select" || !panelWidgetVisible) && selectMultiple){
            setSelectMultiple(false)
        }

    }, [panelDisplayWidget])

    return(
        <Box
            id="widget-panel"
            minHeight={0}
            bgcolor="white" 
            flex={1}
            flexGrow={1}
            minWidth={300} 
            maxWidth={350} 
            height={"100%"}
            p={2} 
            sx={{boxSizing:"border-box",
            zIndex:100,
            position:panelSecondaryVisible ? "absolute": "relative",
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
            sx={{
                boxSizing:"border-box", 
                display:{xs:'none', sm: panelPrimaryVisible ? "flex" : "none" },
                boxShadow: 1
                }}>
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