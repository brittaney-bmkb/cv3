import { Box, Paper, Typography } from "@mui/material";
import ResultsList from "../ResultList/ResultsList";
import UseAppContext from "../../contexts/AppContext";
import PropertyDetail from "../PropertyDetail/PropertyDetail";
import ComparablePropertySearch from "../ComparablePropertySearch/ComparablePropertySearch";
import BasemapWidget from "../Widgets/BasemapWidget";
import LayersWidget from "../Widgets/LayersWidget";
import MeasureWidget from "../Widgets/MeasureWidget";
import PrintWidget from "../Widgets/PrintWidget";
import PanelHeader from "./PanelHeader";
import { height } from "@mui/system";
import { theme } from "../../theme";
import PanelContent from "./PanelContent";


const Panel = () => {  
    return(
        <Box bgcolor="blueviolet" flex={1} flexDirection="column" sx={{display:{xs:'none', sm:'block'}}}>
            <ResultsList/>
        </Box>
    )
}

export const SecondaryPanel = () => {  

    const { panelSecondaryVisible } = UseAppContext()
    return(
        //sx style this adjust the right left or panel will show up. 
        //sm is a block 
        <Box 
            component={Paper}
            square={true}
            elevation={5}
            p={2} 
            bgcolor="white" 
            flex={1} 
            flexDirection="column" 
            height="100%"
            sx={{display:{xs:'none', sm:'none', md: panelSecondaryVisible ? 'flex' :'none'}}}>
            
            <SecondaryPanelContent/>
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

    const { searchFeatures, panelDisplay, panelPrimaryVisible } = UseAppContext()

    return(
        <Box 
            height="90%"
            bgcolor="white" 
            flex={1}  
            p={2} 
            flexDirection="column" 
            sx={{display:{xs:'none', sm: panelPrimaryVisible ? 'block' : 'none'}, overflowY:"clip"}}>
                <PanelContent display={panelDisplay}/>
            </Box>
        
    )
    // switch(panelDisplay){
    //     case 'resultsList':
    //         return (
    //             <Box 
    //             component={Paper}
    //             square={true}
    //             elevation={5}
    //             p={2} 
    //             bgcolor="white" 
    //             flex={1} 
    //             flexDirection="column" 
    //             sx={{display:{xs:'none', sm: panelPrimaryVisible ? 'flex' : 'none'}}}
    //             >
    //                 <PanelHeader text={"Property Results"} exportButton={true} clearButton={true} results={true} feedbackButton={true}/>
    //                 <Box sx={{ overflowY:"scroll"}} height='100%'>
    //                 <ResultsList/>
    //                 </Box>
                        
    //             </Box>)
    //     case 'propertyDetail':
    //         return (
    //             <Box 
    //             bgcolor="white" 
    //             flex={1}  
    //             p={2} 
    //             flexDirection="column" 
    //             sx={{display:{xs:'none', sm: panelPrimaryVisible ? 'flex' : 'none'}}}>
    //                     <PanelHeader 
    //                     text={"Property Results"} 
    //                     exportButton={true} 
    //                     clearButton={true} 
    //                     feedbackButton={true} 
    //                     backButton={true}
    //                     backButtonComponent={'resultsList'}
    //                     closeButton={true}
    //                     panel={"primary"}
    //                     />
    //                     <PropertyDetail/>
    //             </Box>)

    //     case 'comparablePropertySearch':
    //         return(
    //             // take out display:{xs:'none', sm:'none', md: panelSecondaryVisible ? 'block': null}  
    //             // and put them in a wrapper box 
    //             // replace the bottom panel 
    //             // width id set through flex
    //             // bottom is set through width. 
    //             <Box bgcolor="white" flex={1} flexDirection="column">
    //                 <PanelHeader 
    //                 text={"Comparable Property Search"} 
    //                 closeButton={true}
    //                 panel={"secondary"}
    //                 />
    //                 <ComparablePropertySearch/>
    //             </Box>
    //             )
    //     default:
    //         return null
    // }
}

export const BottomPanel = () => {

    const { panelSecondaryVisible } = UseAppContext()

    return(
    <Box bgcolor="blueviolet" flex={4} flexDirection="column" sx={{display:{xs:'none', sm:panelSecondaryVisible ? 'block' :'none', md: 'none'}}} width="100%" >
        <SecondaryPanelContent/>
        
        {/* <Typography color={theme.palette.primary.main}>
        Bottom Panel
        </Typography> */}
    </Box>
    )
}

export default Panel