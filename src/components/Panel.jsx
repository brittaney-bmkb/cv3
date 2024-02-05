import { Box, Paper } from "@mui/material";
import ResultsList from "./ResultsList";
import UseAppContext from "../contexts/AppContext";
import PropertyDetail from "./PropertyDetail/PropertyDetail";

 const Panel = () => {  
    return(
        <Box bgcolor="blueviolet" flex={1} flexDirection="column" sx={{display:{xs:'none', sm:'block'}}}>
            <ResultsList/>
        </Box>
    )
}

export const RightPanel = () => {
    return(
    <Box bgcolor="blueviolet" flex={1} flexDirection="column" sx={{display:{xs:'none', sm:'none', md: 'block'}}}>
    Right Panel
    </Box>
    )
}

export const LeftPanel = () => {

    const { searchFeatures, panelDisplay } = UseAppContext()

    switch(panelDisplay){
        case 'resultsList':
            return (
                <Box bgcolor="blueviolet" flex={1} flexDirection="column" sx={{display:{xs:'none', sm: searchFeatures ? 'block' : 'none'}}}>
                        <ResultsList/>
                </Box>)
        case 'propertyDetail':
            return (
                <Box bgcolor="blueviolet" flex={1} flexDirection="column" sx={{display:{xs:'none', sm: searchFeatures ? 'block' : 'none'}}}>
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