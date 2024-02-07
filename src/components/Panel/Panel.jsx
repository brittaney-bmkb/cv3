import { Box, Paper } from "@mui/material";
import ResultsList from "../ResultList/ResultsList";
import UseAppContext from "../../contexts/AppContext";
import PropertyDetail from "../PropertyDetail/PropertyDetail";
import ComparablePropertySearch from "../ComparablePropertySearch/ComparablePropertySearch";
import BasemapWidget from "../Widgets/BasemapWidget";
import LayersWidget from "../Widgets/LayersWidget";
import MeasureWidget from "../Widgets/MeasureWidget";
import PrintWidget from "../Widgets/PrintWidget";
import PanelHeader from "./PanelHeader";


// const Panel = () => {  
//     return(
//         <Box bgcolor="blueviolet" flex={1} flexDirection="column" sx={{display:{xs:'none', sm:'block'}}}>
//             <ResultsList/>
//         </Box>
//     )
// }

const Panel = () => {  
    return(
        <Box bgcolor="blueviolet" flex={1} flexDirection="column" sx={{display:{xs:'none', sm:'block'}}}>
            <ResultsList/>
        </Box>
    )
}

export const SecondaryPanel = () => {  
    return(
        <Box bgcolor="blueviolet" flex={1} flexDirection="column" sx={{display:{xs:'none', sm:'block'}}}>
            <SecondaryPanelContent/>
        </Box>
    )
}

// reuse panel function or do a new panel and replace the csss with the one in the bottom. 



export const SecondaryPanelContent = () => {

    const { panelSecondaryVisible, panelDisplaySecondary } = UseAppContext()

    switch(panelDisplaySecondary){
        case 'comparablePropertySearch':
            return(
                // take out display:{xs:'none', sm:'none', md: panelSecondaryVisible ? 'block': null}  
                // and put them in a wrapper box 
                // replace the bottom panel 
                // width id set through flex
                // bottom is set through width. 
                <Box bgcolor="white" flex={1} flexDirection="column" sx={{display:{xs:'none', sm:'none', md: panelSecondaryVisible ? 'block': null}}}>
                    <ComparablePropertySearch/>
                </Box>
                )
        case 'measureWidget':
            // Add panel headers 
            // add additional arguments for arguments in there
            // create argument to toggle on and off. 
            return(
                <Box bgcolor="white" flex={1} flexDirection="column" sx={{display:{xs:'none', sm:'none', md: panelSecondaryVisible ? 'block': null}}}>
                    <MeasureWidget/>
                </Box>
                )                
        case 'layersWidget':
            return(
                <Box bgcolor="white" flex={1} flexDirection="column" sx={{display:{xs:'none', sm:'none', md: panelSecondaryVisible ? 'block': null}}}>
                    <LayersWidget/>
                </Box>
            )   
        case 'basemapsWidget':
            return(
                <Box bgcolor="white" flex={1} flexDirection="column" sx={{display:{xs:'none', sm:'none', md: panelSecondaryVisible ? 'block': null}}}>
                    <BasemapWidget/>
                </Box>
            )                                           
        case 'printWidget':
            return(
                <Box bgcolor="white" flex={1} flexDirection="column" sx={{display:{xs:'none', sm:'none', md: panelSecondaryVisible ? 'block': null}}}>
                    <PrintWidget/>
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
                <Box 
                component={Paper}
                square={true}
                elevation={5}
                p={2} 
                bgcolor="white" 
                flex={1} 
                flexDirection="column" 
                sx={{display:{xs:'none', sm: searchFeatures ? 'flex' : 'none'}}}
                >
                        <PanelHeader text={"Property Results"} />
                        <Box sx={{ overflowY:"scroll"}} height='100%'>
                        <ResultsList/>
                        </Box>
                        
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