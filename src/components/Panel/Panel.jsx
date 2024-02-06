import { Box, Paper } from "@mui/material";
import ResultsList from "../ResultList/ResultsList";
import UseAppContext from "../../contexts/AppContext";
import PropertyDetail from "../PropertyDetail/PropertyDetail";
import ComparablePropertySearch from "../ComparablePropertySearch/ComparablePropertySearch";
import PanelHeader from "./PanelHeader";

 const Panel = () => {  
    return(
        <Box bgcolor="blueviolet" flex={1} flexDirection="column" sx={{display:{xs:'none', sm:'block'}}}>
            <ResultsList/>
        </Box>
    )
}

export const RightPanel = () => {

    const { panelSecondaryVisible, panelDisplaySecondary } = UseAppContext()

    switch(panelDisplaySecondary){
        case 'comparablePropertySearch':
            return(
                <Box bgcolor="white" flex={1} flexDirection="column" sx={{display:{xs:'none', sm:'none', md: panelSecondaryVisible ? 'block': null}}}>
                    <ComparablePropertySearch/>
                </Box>
                )
        default:
            return(
                <Box bgcolor="blueviolet" flex={1} flexDirection="column" sx={{display:{xs:'none', sm:'none', md: panelSecondaryVisible ? 'block': null}}}>
                    Right Panel
                </Box>
                )
    }
    
}

export const LeftPanel = () => {

    const { searchFeatures, panelDisplay } = UseAppContext()

    switch(panelDisplay){
        case 'resultsList':
            return (
                <Box p={2} bgcolor="white" flex={1} flexDirection="column" sx={{display:{xs:'none', sm: searchFeatures ? 'block' : 'none'}}}>
                        <PanelHeader text={"Property Results"}/>
                        <ResultsList/>
                </Box>)
        case 'propertyDetail':
            return (
                <Box bgcolor="white" flex={1} flexDirection="column" sx={{display:{xs:'none', sm: searchFeatures ? 'block' : 'none'}}}>
                        <PropertyDetail/>
                </Box>)
        default:
            return null
    }
}

export const BottomPanel = () => {
    return(
    <Box bgcolor="blueviolet" flex={4} flexDirection="column" sx={{display:{xs:'none', sm:'block', md: 'none'}}} width="100%">
    Bottom Panel
    </Box>
    )
}

export default Panel