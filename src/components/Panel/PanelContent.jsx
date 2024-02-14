import { Box, Divider, Paper } from "@mui/material"
import PanelHeader from "./PanelHeader"
import ResultsList from "../ResultList/ResultsList"
import PropertyDetail from "../PropertyDetail/PropertyDetail"
import ComparablePropertySearch from "../ComparablePropertySearch/ComparablePropertySearch"
import BasemapWidget from "../Widgets/BasemapWidget";
import LayersWidget from "../Widgets/LayersWidget";
import MeasureWidget from "../Widgets/MeasureWidget";
import PrintWidget from "../Widgets/PrintWidget";
import UseAppContext from "../../contexts/AppContext"
import { theme } from "../../theme"

const PanelContent = ({display}) => {

    const { screenWidth } = UseAppContext()

    switch(display){
        case 'resultsList':
            return (
                <Box display="flex" flexDirection="column" height="100%" >
                    <PanelHeader text={"Property Results"} exportButton={true} clearButton={true} results={true} feedbackButton={true}/>
                    <Box display="flex" flexDirection="column" sx={{ overflowY:"scroll", flexGrow: 1}}>
                        <ResultsList/>
                    </Box>   
                </Box>)
        case 'propertyDetail':
            return (
                <Box display="flex" flexDirection="column" flexGrow={1} minHeight={0}>
                        <PanelHeader 
                        text={"Property Results"} 
                        exportButton={true} 
                        clearButton={true} 
                        feedbackButton={true} 
                        backButton={true}
                        backButtonComponent={'resultsList'}
                        closeButton={false}
                        panel={"primary"}
                        />
                        <Box display="flex" flexDirection="column" flexGrow={1} minHeight={0}>
                            <PropertyDetail/>
                        </Box>
                        
                </Box>)

        case 'comparablePropertySearch':
            return(
                // take out display:{xs:'none', sm:'none', md: panelSecondaryVisible ? 'block': null}  
                // and put them in a wrapper box 
                // replace the bottom panel 
                // width id set through flex
                // bottom is set through width. 
                <Box  display="flex" flexDirection="column" flexGrow={1} minHeight={0}>
                    <PanelHeader 
                    text={"Comparable Search"} 
                    closeButton={true}
                    panel={"secondary"}
                    backButton={screenWidth < theme.breakpoints.values.lg}
                    backButtonComponent={"propertyDetail"}
                    />
                    <Divider/>
                    <Box  display="flex" flexDirection="column" flexGrow={1} minHeight={0}>
                        <ComparablePropertySearch/>
                    </Box>
                    
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
            return null
    }
}

export default PanelContent