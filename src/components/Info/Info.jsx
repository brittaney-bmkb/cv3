import { Accordion, AccordionDetails, AccordionSummary, Box, Link, Stack, Typography } from "@mui/material"
import UseAppContext from "../../contexts/AppContext"
import { ExpandMore, Search, SelectAllOutlined } from "@mui/icons-material"
import { CalciteIcon } from "@esri/calcite-components-react"
import { theme } from "../../theme"

const Info = () => {

    const {translateText} = UseAppContext()

    return(
        <Box
        display="flex"
        flexDirection="column"
        rowGap={2}
        p={2}
        >
            <Box
            id="welcome-message"
            display="flex"
            >
                <Typography
                variant="body1"
                >
                    {translateText("Welcome to CookViewer 3.0 Beta – your go-to for property information! With enhanced features, expanded language support, and thanks to your invaluable feedback, we've made improvements to better serve you. We hear you and are implementing your suggestions! Discover comprehensive property details at your fingertips. Explore the What's New section to learn about recent updates.")}
                </Typography>
            </Box>

            <Box
            id="getting-started"
            display="flex"
            flexDirection="column"
            rowGap={2}
            >
                <Typography
                variant="h4"
                color="primary"
                >
                    {translateText("To get started, you can:")}
                </Typography>
                <Stack 
                id="select"
                direction="row" 
                gap={1}>
                    <CalciteIcon icon="select" scale="m"/>
                    <Stack>
                    <Typography
                    variant="body2"
                    >
                        {translateText("Select a location on the map")}
                    </Typography>
                    <Typography
                    variant="body1"
                    >
                        {translateText("Click or tap on a specific property to view details")}
                    </Typography>
                    </Stack>
                </Stack>

                <Stack 
                id="search"
                direction="row" 
                gap={1}>
                    {/* <CalciteIcon icon="search" scale="m"/> */}
                    <Search/>
                    <Stack>
                    <Typography
                    variant="body2"
                    >
                        {translateText("Search by PIN, address, or intersection")}
                    </Typography>
                    <Typography
                    variant="body1"
                    >
                        {translateText("Type parcel identification number (PIN10 or PIN14), address, or intersection into the search box. Or enter a portion of a PIN to find all properties for an area-section-quadrant or block", true)}
                    </Typography>
                    </Stack>
                </Stack>

                <Stack 
                id="select-multiple"
                direction="row" 
                gap={1}>

                    <CalciteIcon icon="add-in-new" scale="m"/>

                    {/* <Search/> */}
                    <Stack>
                    <Typography
                    variant="body2"
                    >
                        {translateText("Select Multiple Parcels")}
                    </Typography>
                    <Typography
                    variant="body1"
                    >
                        {translateText("Use the 'Select Multiple Parcels' tool to choose multiple parcels by either clicking in the map or drawing a shape around them", true)}
                    </Typography>
                    </Stack>
                </Stack>

                <Typography
                variant="h4"
                color="primary"
                >
                    {translateText("Whats New?")}
                </Typography>
            </Box>

             <Accordion
            defaultExpanded
            square={true}
            >
            <AccordionSummary
            expandIcon={<ExpandMore/>}
            >   
            <Stack gap={1}>
                <Typography
                variant="body2"
                >
                    {translateText("CookViewer 3.0 Beta-3")}
                </Typography>
                <Typography>
                    {translateText("Release: July 15 2024", true)}
                </Typography>
            </Stack>
                
            </AccordionSummary>
            <AccordionDetails>

                <Stack gap={2}>
                    <Typography
                    variant="body2"
                    >
                        {translateText("Enhancements")}
                    </Typography>
                    <Stack gap={1}>
                    <Typography variant="body1">
                        <span style={{ 
                            fontWeight: 600,
                            fontSize:14
                            }}>{translateText("Measure Widget BETA")} - </span>
                        {translateText("Users can now measure distance and area using the measure widget")}
                    </Typography>

                    <Typography variant="body1">
                        <span style={{ 
                            fontWeight: 600,
                            fontSize:14
                            }}>{translateText("Select Multiple Parcels")} - </span>
                        {translateText("Users can now select multiple parcels by clicking parcels in the map or drawing a shape around them")}
                    </Typography>

                    <Typography variant="body1">
                        <span style={{ 
                            fontWeight: 600,
                            fontSize:14
                            }}>{translateText("Find Parcel Dimensions")} - </span>
                        {translateText("Users can view parcel dimensions using the Tax Map Viewer application found in the Data and Resources section at the bottom of the property detail")}
                    </Typography>
                    </Stack>

                    <Typography
                    variant="body2"
                    >
                        {`${translateText("Read detailed ")} `}
                        <span>
                            <Link
                            target="_blank"
                            rel="noopener"
                            href="https://cookviewer3-info-cookcountyil.hub.arcgis.com/"
                            aria-label={translateText("Read more detailed release notes.")} 
                            >
                                {translateText("release notes.") }
                            </Link>
                        </span>

                    </Typography>
                </Stack>
            </AccordionDetails>
            </Accordion>    

            <Accordion
            square={true}
            >
            <AccordionSummary
            expandIcon={<ExpandMore/>}
            >   
            <Stack gap={1}>
                <Typography
                variant="body2"
                >
                    {translateText("CookViewer 3.0 Beta-2")}
                </Typography>
                <Typography>
                    {translateText("Release: May 17 2024", true)}
                </Typography>
            </Stack>
                
            </AccordionSummary>
            <AccordionDetails>

                <Stack gap={2}>
                    <Typography
                    variant="body2"
                    >
                        {translateText("Enhancements")}
                    </Typography>
                    <Stack gap={1}>
                    <Typography variant="body1">
                        <span style={{ 
                            fontWeight: 600,
                            fontSize:14
                            }}>{translateText("Layer Labeling")} - </span>
                        {translateText("Layer information, including commissioner districts, townships, municipalities, etc., is now presented without overlap, enhancing readability and user experience")}
                    </Typography>

                    <Typography variant="body1">
                        <span style={{ 
                            fontWeight: 600,
                            fontSize:14
                            }}>{translateText("Parcel Labeling")} - </span>
                        {translateText("PINs are now prominently displayed and easily readable even when aerial images are chosen, resolving a reported usability concern")}
                    </Typography>

                    <Typography variant="body1">
                        <span style={{ 
                            fontWeight: 600,
                            fontSize:14
                            }}>{translateText("Search for Portion of a PIN")} - </span>
                        {translateText("Users can now enter a portion of a PIN to find all properties for an area-section-quadrant or block")}
                    </Typography>
                    </Stack>

                    <Typography
                    variant="body2"
                    >
                        {translateText("Fixes")}
                    </Typography>
                    <Stack gap={1}>
                    <Typography variant="body1">
                        <span style={{ 
                            fontWeight: 600,
                            fontSize:14
                            }}>{translateText("Printing")} - </span>
                        {translateText("Resolved an issue affecting map printouts where comparable parcels were incorrectly displayed as grey blocks. With this fix, comparable parcels are now accurately depicted on the printed map and included in the map legend as intended")}
                    </Typography>
                    </Stack>

                    <Typography
                    variant="body2"
                    >
                        {`${translateText("Read detailed ")} `}
                        <span>
                            <Link
                            target="_blank"
                            rel="noopener"
                            href="https://cookviewer3-info-cookcountyil.hub.arcgis.com/"
                            aria-label={translateText("Read more detailed release notes.")} 
                            >
                                {translateText("release notes.") }
                            </Link>
                        </span>

                    </Typography>
                </Stack>
            </AccordionDetails>
            </Accordion>    
        <Accordion
        square={true}
        
        >
            <AccordionSummary
            expandIcon={<ExpandMore/>}
            >   
            <Stack gap={1}>
                <Typography
                variant="body2"
                >
                    {translateText("CookViewer 3.0 Beta-1")}
                </Typography>
                <Typography>
                    {translateText("Release: April 12 2024", true)}
                </Typography>
            </Stack>
                
            </AccordionSummary>
            <AccordionDetails>

                <Stack gap={2}>
                    <Typography
                    variant="body2"
                    >
                        {translateText("Enhancements")}
                    </Typography>
                    <Stack gap={1}>
                    <Typography variant="body1">
                        <span style={{ 
                            fontWeight: 600,
                            fontSize:14
                            }}>{translateText("Search by PIN14", true)} - </span>
                        {translateText("New capabilities for condominium property searches, including full PIN 14 search functionality", true)}
                    </Typography>
                    <Typography variant="body1">
                        <span style={{ 
                            fontWeight: 600,
                            fontSize:14
                            }}>{translateText("Spanish Language Support")} - </span>
                        {translateText("Expanded language support for English and Spanish")}
                    </Typography>

                    <Typography variant="body1">
                        <span style={{ 
                            fontWeight: 600,
                            fontSize:14
                            }}>{translateText("Mobile Accessibility")} - </span>
                        {translateText("Improved mobile experience, making property information more accessible and user-friendly on smartphones and tablets")}
                    </Typography>

                    <Typography variant="body1">
                        <span style={{ 
                            fontWeight: 600,
                            fontSize:14
                            }}>{translateText("Historical Imagery")} - </span>
                        {translateText("Users can now see the evolution of properties and landscapes using aerial imagery spanning from 1998 to 2023", true)}
                    </Typography>
                    </Stack>

                    <Typography
                    variant="body2"
                    >
                        {`${translateText("Read detailed ")} `}
                        <span>
                            <Link
                            target="_blank"
                            rel="noopener"
                            href="https://cookviewer3-info-cookcountyil.hub.arcgis.com/"
                            aria-label={translateText("Read more detailed release notes.")} 
                            > 
                                {translateText("release notes.")}
                            </Link>
                        </span>

                    </Typography>
                </Stack>
            </AccordionDetails>
        </Accordion>
            


        </Box>
    )
}

export default Info