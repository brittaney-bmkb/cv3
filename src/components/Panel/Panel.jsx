import { Box, Paper, Typography } from "@mui/material";
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


const PanelMobile = () => {  

    const { panelDisplay, screenWidth, setPanelDisplay, setPanelPrimaryVisibility } = UseAppContext()

    console.log("Panel display: ", panelDisplay)
    return(
        <Box 
            height={200}
            width="100%"
            display="flex"
            bgcolor="white" 
            pb={3}
            flexGrow={1}  
            flexDirection="column">
                <PanelContent display={panelDisplay}/>
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
            minWidth={300}   
            sx={{display:{xs:'none', sm: panelSecondaryVisible ? 'flex' : 'none'}}}>
                <PanelContent id="panel-content" display={panelDisplaySecondary}/>
        </Box>
    )
}

// reuse panel function or do a new panel and replace the csss with the one in the bottom. 

export const SecondaryPanelContent = () => {

    const { panelDisplaySecondary } = UseAppContext()

    switch(panelDisplaySecondary){
        case 'comparablePropertySearch':
            return(
                // take out display:{xs:'none', sm:'none', md: panelSecondaryVisible ? 'block': null}  
                // and put them in a wrapper box 
                // replace the bottom panel 
                // width id set through flex
                // bottom is set through width. 
                <Box bgcolor="white" flex={1} flexDirection="column">
                    <PanelHeader 
                    text={"Comparable Property Search"} 
                    closeButton={true}
                    panel={"secondary"}
                    />
                    <ComparablePropertySearch/>
                </Box>
                )
        case 'measureWidget':
            // Add panel headers 
            // add additional arguments for arguments in there
            // create argument to toggle on and off. 
            return(
                <Box bgcolor="white" flex={1} flexDirection="column">
                    <MeasureWidget/>
                </Box>
                )                
        case 'layersWidget':
            return(
                <Box bgcolor="white" flex={1} flexDirection="column">
                    <LayersWidget/>
                </Box>
            )   
        case 'basemapsWidget':
            return(
                <Box bgcolor="white" flex={1} flexDirection="column">
                    <BasemapWidget/>
                </Box>
            )                                           
        case 'printWidget':
            return(
                <Box bgcolor="white" flex={1} flexDirection="column">
                    <PrintWidget/>
                </Box>
            )                                   
        default:
            return(
                <Box bgcolor="blueviolet" flex={1} flexDirection="column">
                    Right Panel
                </Box>
                )
    }
    
}

export const LeftPanel = () => {

    const { panelPrimaryVisible, setPanelSecondaryVisibility, panelDisplaySecondary, setPanelDisplaySecondary, panelDisplay, screenWidth, setPanelDisplay, setPanelPrimaryVisibility, primaryResultFeature, panelSecondaryVisible } = UseAppContext()

    useEffect(() => {
        const isPrimaryPanel = ['comparablePropertySearch', 'resultsListComparables', 'nearbyProperties'].includes(panelDisplay);
        const isSecondaryPanel = ['comparablePropertySearch', 'resultsListComparables', 'nearbyProperties'].includes(panelDisplaySecondary);
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
            minWidth={300}  
            flexDirection="column" 
            sx={{display:{xs:'none', sm: panelPrimaryVisible ? 'flex' : 'none'}}}>
                <PanelContent id="panel-content" display={panelDisplay}/>
        </Box>
        
    )
}

export const BottomPanel = () => {

    const { panelSecondaryVisible } = UseAppContext()

    return(
    <Box bgcolor="blueviolet" flex={4} flexDirection="column" sx={{display:{xs:'none', sm:panelSecondaryVisible ? 'block' :'none', md: 'none'}}} width="100%" >
        <SecondaryPanelContent/>
    </Box>
    )
}

export default PanelMobile