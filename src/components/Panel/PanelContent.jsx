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
import PrintWidgetCustom, { PrintWidgetPane } from "../Widgets/PrintWidgetCustom";
import { config } from "../../data/config";

const PanelContent = ({display}) => {

    const { translateText, screenWidth, primaryResultFeature, searchFeatures, comparableParcels, secondaryResultFeature } = UseAppContext()

    switch(display){
        case 'resultsList':
            return (
                <Box display="flex" flexDirection="column" height="100%" width="100%">
                    <PanelHeader
                        text={"Property Results"} 
                        exportButton={true} 
                        clearButton={true} 
                        results={searchFeatures ? searchFeatures.length : 0} 
                        feedbackButton={true}
                        primary={true}
                        divider={true}
                    />

                    <Box display="flex" flexDirection="column" sx={{ overflowY:"scroll", flexGrow: 1}}>
                        <ResultsList 
                        results={searchFeatures} 
                        primaryLableColor={theme.palette.primary.main}
                        noResultsMessage={config.no_results_message}
                        />
                    </Box>   
                </Box>)
        case 'propertyDetail':
            return (
                <Box display="flex" flexDirection="column" flexGrow={1} minHeight={0} height="100%" width="100%">
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
                
                <Box  display="flex" flexDirection="column" flexGrow={1} minHeight={0} rowGap={1}>
                    <PanelHeader 
                    text={"Comparable Search"} 
                    closeButton={true}
                    panel={screenWidth < theme.breakpoints.values.lg ? "primary": "secondary"}
                    backButton={screenWidth < theme.breakpoints.values.lg}
                    backButtonComponent={"propertyDetail"}
                    descriptionText={"Complete the comparable search form to view similar properties"}
                    divider={true}
                    />
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
                divider={true}
                />
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
                    divider={true}
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
                    divider={true}
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
                        panel={screenWidth < theme.breakpoints.values.lg ? "primary":"secondary"}
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
                rowGap={1}
                divider={true}
                >
                    <PanelHeader 
                        text={translateText("Measure")}
                        closeButton={true}
                        panel={"widget"}
                        descriptionText={translateText("Measure Widget Coming Soon")}
                    />                    
                    {/* <MeasureWidget
                        panel={screenWidth < theme.breakpoints.values.lg? "primary":"secondary"}
                    /> */}
                </Box>
                )                
        case 'layersWidget':
            return(
                <Box display="flex" flexDirection="column" minHeight={0}>
                    <PanelHeader
                    text={translateText("Layers")} 
                    closeButton={true}
                    descriptionText={translateText("Select layers to update the map. Layers that are greyed out are not visible at current map zoom level.")}
                    panel={"widget"}
                    divider={true}
                    />
                    {/* <LayersWidget/> */}
                    <LayerListWidgetCustom/>
                </Box>
            )   
        case 'basemapsWidget':
            return(
                <Box display="flex" flexDirection="column" rowGap={3} minHeight={0}>
                    <PanelHeader
                    text={translateText("Basemaps")} 
                    closeButton={true}
                    panel={"widget"}
                    descriptionText={translateText("Select a basemap from the options below to update the map")}
                    divider={true}
                    />
                    <BasemapWidget/>
                </Box>
            )                                           
        case 'printWidget':
            return(
                <Box 
                display="flex" 
                flexDirection="column"  
                minHeight={0} 
                width="100%"
                sx={{boxSizing:"border-box"}}
                divider={true}
                >
                    <PanelHeader
                    text={translateText("Print")} 
                    closeButton={true}
                    panel={"widget"}
                    // descriptionText={"Print Settings"}
                    />
                    {/* <PrintWidget/> */}
                    <PrintWidgetPane/>
                </Box>
            )                                   
        default:
            return null
    }
}

export default PanelContent