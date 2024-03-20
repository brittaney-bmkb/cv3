import { Box, Divider, Paper } from "@mui/material"
import PanelHeader from "./PanelHeader"
import ResultsList from "../ResultList/ResultsList"
import ComparablePropertySearch from "../ComparableProperty/ComparablePropertySearch"
import BasemapWidget from "../Widgets/BasemapWidget";
import LayersWidget from "../Widgets/LayersWidget";
import MeasureWidget from "../Widgets/MeasureWidget";
import PrintWidget from "../Widgets/PrintWidget";
import UseAppContext from "../../contexts/AppContext"
import { theme } from "../../theme"
import CompareNearby from "../ComparableProperty/CompareNearby"
import PropertyDetail from "../PropertyDetail/PropertyDetail"
import PropertyPagniation from "../PropertyDetail/PropertyPagnition";
import WebMapView from "../WebMapView/WebMapView";
import LayerListWidgetCustom from "../Widgets/LayerListWidgetCustom";

const PanelContent = ({display}) => {

    const { translateText, screenWidth, primaryResultFeature, searchFeatures, comparableParcels, secondaryResultFeature } = UseAppContext()

    switch(display){
        case 'resultsList':
            return (
                <Box display="flex" flexDirection="column" height="100%" >
                    <PanelHeader
                        text={translateText("Property Results")} 
                        exportButton={true} 
                        clearButton={true} 
                        results={searchFeatures ? searchFeatures.length : 0} 
                        feedbackButton={true}
                        primary={true}
                    />

                    <Box display="flex" flexDirection="column" sx={{ overflowY:"scroll", flexGrow: 1}}>
                        <ResultsList 
                        results={searchFeatures} 
                        primaryLableColor={theme.palette.primary.main}
                        noResultsMessage={"Try a new search using the search by or by clicking in the map"}
                        />
                    </Box>   
                </Box>)
        case 'propertyDetail':
            return (
                <Box display="flex" flexDirection="column" flexGrow={1} minHeight={0}>
                        <PanelHeader 
                        text={"Property Detail"} 
                        exportButton={true} 
                        clearButton={true} 
                        feedbackButton={true} 
                        backButton={true}
                        backButtonComponent={'resultsList'}
                        closeButton={false}
                        panel={"primary"}
                        primary={true}
                        />
                        <Box display="flex" flexDirection="column" flexGrow={1} minHeight={0}>
                            {/* <PropertyDetail property={primaryResultFeature} pinLableColor={theme.palette.primary.main}/> */}
                            <PropertyDetail 
                            property1={primaryResultFeature} 
                            propertyColor1={theme.palette.primary.main}/>
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
                    panel={screenWidth < theme.breakpoints.values.lg ? "primary": "secondary"}
                    backButton={screenWidth < theme.breakpoints.values.lg}
                    backButtonComponent={"propertyDetail"}
                    descriptionText={"Complete the comparable search form to view similar properties. Fields maked with an astrisk (*) are required"}
                    />
                    <Divider/>
                    <Box  display="flex" flexDirection="column" flexGrow={1} minHeight={0}>
                        <ComparablePropertySearch/>
                    </Box>
                    
                </Box>
                )
        case 'nearbyProperties':
        return(
            // take out display:{xs:'none', sm:'none', md: panelSecondaryVisible ? 'block': null}  
            // and put them in a wrapper box 
            // replace the bottom panel 
            // width id set through flex
            // bottom is set through width. 
            <Box  display="flex" flexDirection="column"  flexGrow={1} minHeight={0} >
                <PanelHeader 
                text={"Nearby Parcels"} 
                closeButton={true}
                panel={screenWidth < theme.breakpoints.values.lg? "primary":"secondary"}
                backButton={screenWidth < theme.breakpoints.values.lg}
                backButtonComponent={"propertyDetail"}
                />
                <Divider/>
                <Box  display="flex" width="100%">
                    <CompareNearby/>
                </Box>
                
            </Box>
            )
        case 'resultsListComparables':
            return (
                <Box display="flex" flexDirection="column" flexGrow={1} minHeight={0}>
                    <PanelHeader 
                    text={"Comparable Results"} 
                    exportButton={true} 
                    clearButton={true} 
                    results={comparableParcels ? comparableParcels.length : 0} 
                    feedbackButton={true}
                    backButton={true}
                    backButtonComponent={"comparablePropertySearch"}
                    panel={screenWidth < theme.breakpoints.values.lg? "primary":"secondary"}
                    primary={false}
                    
                    />
                    <Box display="flex" flexDirection="column" sx={{ overflowY:"scroll"}} flexGrow={1} minHeight={0}>
                        <ResultsList 
                        results={comparableParcels} 
                        primaryLableColor={theme.palette.secondary.main}
                        noResultsMessage={"Zero comparable parcels found"}
                        />
                    </Box>   
                </Box>)

        case 'resultsListNearby':
            return (
                <Box display="flex" flexDirection="column" flexGrow={1} minHeight={0}>
                    <PanelHeader 
                    text={"Nearby Results"} 
                    exportButton={true} 
                    clearButton={true} 
                    results={comparableParcels? comparableParcels.length: 0} 
                    feedbackButton={true}
                    backButton={true}
                    backButtonComponent={"nearbyProperties"}
                    panel={screenWidth < theme.breakpoints.values.lg? "primary":"secondary"}
                    primary={false}
                    
                    />
                    <Box display="flex" flexDirection="column" sx={{ overflowY:"scroll"}} flexGrow={1} minHeight={0}>
                        <ResultsList 
                            results={comparableParcels} 
                            primaryLableColor={theme.palette.secondary.main}
                            noResultsMessage={"Zero comparable parcels found"}
                        />
                    </Box>   
                </Box>)

        case 'propertyDetailComparable':
            return (
                <Box display="flex" flexDirection="column"  minHeight={0}>
                        <PanelHeader 
                        text={"Comparable Property"} 
                        exportButton={true} 
                        clearButton={true} 
                        feedbackButton={true} 
                        backButton={true}
                        backButtonComponent={'resultsListComparables'}
                        closeButton={true}
                        panel={screenWidth < theme.breakpoints.values.lg ? "primary":"secondary"}
                        primary={false}
                        />
                        <Box display="flex" flexDirection="column" width="100%" flexGrow={1} minHeight={0}>
                            <PropertyDetail 
                            property1={screenWidth >= theme.breakpoints.values.lg ? null :primaryResultFeature} 
                            property2={secondaryResultFeature} 
                            propertyColor1={theme.palette.primary.main}
                            propertyColor2={theme.palette.secondary.main}/>
                            <PropertyPagniation/>
                        </Box>     
                </Box>)
        case 'propertyDetailNearby':
            return (
                <Box display="flex" flexDirection="column"  minHeight={0}>
                    <PanelHeader 
                        text={"Nearby Property"} 
                        exportButton={true} 
                        clearButton={true} 
                        feedbackButton={true} 
                        backButton={true}
                        backButtonComponent={'resultsListNearby'}
                        closeButton={true}
                        panel={"secondary"}
                        primary={false}
                    />

                   <Box display="flex"  flexDirection="column" width="100%" flexGrow={1} minHeight={0}>
                     <PropertyDetail 
                       property1={screenWidth >= theme.breakpoints.values.lg ? null : primaryResultFeature} 
                       property2={secondaryResultFeature} 
                       propertyColor1={theme.palette.primary.main}
                       propertyColor2={theme.palette.secondary.main}
                      />
                     <PropertyPagniation/>
                   </Box>     

                </Box>)
        case 'measureWidget':
            // Add panel headers 
            // add additional arguments for arguments in there
            // create argument to toggle on and off. 
            return(
                // <Box bgcolor="white" flex={1} flexDirection="column">
                <Box 
                display="flex" 
                flexDirection="column" 
                flexGrow={1} 
                minHeight={0} 
                rowGap={1}>
                    <PanelHeader 
                        text={"Measure"}
                        closeButton={screenWidth < theme.breakpoints.values.lg ?  false : true }
                        panel={"secondary"}
                    />                    
                    <MeasureWidget
                    panel={screenWidth < theme.breakpoints.values.lg? "primary":"secondary"}
                    />
                </Box>
                )                
        case 'layersWidget':
            return(
                <Box display="flex" flexDirection="column" minHeight={0} p={1}>
                    <PanelHeader
                    text={"Map Layers"} 
                    //closeButton={true}
                    panel={"secondary"}
                    />
                    {/* <LayersWidget/> */}
                    <LayerListWidgetCustom/>
                </Box>
            )   
        case 'basemapsWidget':
            return(
                <Box p={2} display="flex" flexDirection="column" rowGap={3} minHeight={0}>
                    <PanelHeader
                    text={"Basemaps"} 
                    closeButton={true}
                    panel={"secondary"}
                    descriptionText={"Select a basemap from the options below to update the map"}
                    />
                    <BasemapWidget/>
                </Box>
            )                                           
        case 'printWidget':
            return(
                <Box p={2} display="flex" flexDirection="column"  minHeight={0}>
                    <PanelHeader
                    text={"Print"} 
                    closeButton={true}
                    panel={"secondary"}
                    // descriptionText={"Print Settings"}
                    />
                    <PrintWidget/>
                </Box>
            )                                   
        default:
            return null
    }
}

export default PanelContent