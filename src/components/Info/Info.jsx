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
                    {translateText("Welcome to CookViewer 3.0 - your ultimate source for Cook County property information! Access detailed property insights with ease, now with a modernized user experience, enhanced features, and expanded language support. Dive into the 'What's New' section to explore the latest updates. We value your feedback, which helps us continue improving to better serve you.", true)}
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

                <Typography variant="h4" color="primary" >
                    {translateText("Whats New?")}
                </Typography>
            </Box>
            {/* CookViewer 3.0.2 */}
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
                    {translateText("CookViewer 3.0.2")}
                </Typography>
                <Typography>
                    {translateText("Release: February 27 2025", true)}
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
                            }}>{translateText("Unincorporated Zoning Layer")} - </span>
                        {translateText("The Unincorporated Zoning layer is now viewable for more zoom levels.")}
                    </Typography>


                    </Stack>
                    <Typography
                    variant="body2"
                    >
                        {translateText("Bug Fixes")}
                    </Typography>
                    <Stack gap={1}>
                    <Typography variant="body1">
                        <span style={{ 
                            fontWeight: 600,
                            fontSize:14
                            }}>{translateText("Missing Translations")} - </span>
                        {translateText("Spanish translations are now enabled for the search bar, including search sources and placeholder text.")}
                    </Typography>
                    <Typography variant="body1">
                        <span style={{ 
                            fontWeight: 600,
                            fontSize:14
                            }}>{translateText("URL Parameter Fix")} - </span>
                        {translateText("Search results now correctly generate pin10 and/or pin14 values in the application URL, allowing users to save search settings and return to their results. Previously, multiple parcel searches could return address=0 when parcel address data was unavailable, preventing users from navigating back to their search results.")}
                    </Typography>
                    <Typography variant="body1">
                        <span style={{ 
                            fontWeight: 600,
                            fontSize:14
                            }}>{translateText("Select Multiple Parcels")} - </span>
                        {translateText("Draw polygon tool “start new” button now triggers a restart.")}
                    </Typography>
                    <Typography variant="body1">
                        <span style={{ 
                            fontWeight: 600,
                            fontSize:14
                            }}>{translateText("Comparable Search")} - </span>
                        {translateText("Search radius option will now filter results based on distance set by the user. Prior to this fix, the search distance set by the user was not impacting the number of results.")}
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

            {/* CookViewer 3.0.1 */}
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
                    {translateText("CookViewer 3.0.1")}
                </Typography>
                <Typography>
                    {translateText("Release: September 26 2024", true)}
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
                            }}>{translateText("District Info")} - </span>
                        {translateText("Users can now view a summary of political and taxing district info by clicking the 'View District Details' link in the the property detail panel or by scrolling to the bottom of the panel")}
                    </Typography>

                    <Typography variant="body1">
                        <span style={{ 
                            fontWeight: 600,
                            fontSize:14
                            }}>{translateText("Highway System Labels")} - </span>
                        {translateText("Users can now view the Highway System layer with labels displayed in the map")}
                    </Typography>

                    </Stack>
                    <Typography
                    variant="body2"
                    >
                        {translateText("Bug Fixes")}
                    </Typography>
                    <Stack gap={1}>
                    <Typography variant="body1">
                        <span style={{ 
                            fontWeight: 600,
                            fontSize:14
                            }}>{translateText("Mobile Search Bar")} - </span>
                        {translateText("The mobile search bar will now load without having to close the Info Panel when the application loads")}
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

            {/* CookViewer 3.0 */}
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
                    {translateText("CookViewer 3.0")}
                </Typography>
                <Typography>
                    {translateText("Release: September 05 2024", true)}
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
                            }}>{translateText("Search")} - </span>
                        {translateText("New capabilities for condominium property searches, including full PIN 14 search functionality. The search widget is now powered by Cook County's parcel dataset and two new address locators that contain address attributes for parcels and street addresses within Cook County, IL. With these upgrades, it offers smarter suggestions and more flexible address matching, making it easier to find what you're looking for.", true)}
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
                            }}>{translateText("Mobile Responsive")} - </span>
                        {translateText("Improved mobile experience, making property information more accessible and user-friendly on smartphones and tablets.")}
                    </Typography>

                    <Typography variant="body1">
                        <span style={{ 
                            fontWeight: 600,
                            fontSize:14
                            }}>{translateText("Historical Imagery")} - </span>
                        {translateText("Users can now see the evolution of properties and landscapes using aerial imagery spanning from 1998 to 2023.")}
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


            {/* CookViewer 3.0 Beta - 2 */}
            {/* <Accordion
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
            </Accordion>     */}

            {/* CookViewer 3.0 Beta - 1 */}
            {/* <Accordion square={true}>
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
            </Accordion> */}

        <Box 
        id="contact-info-container"
        display="flex"
        flexDirection="column"
        rowGap={2}
        >
            <Typography
                variant="h4"
                color="primary"
            >
                {translateText("Contact Us")}
            </Typography>

            <Box 
            id="gis-contact"
            display="flex"
            flexDirection="column"
            rowGap={1}
            >
            <Typography
            variant="body2"
            >
                {translateText("For questions about issues with using CookViewer or other GIS inquiries:")}
            </Typography>
            <Typography
            variant="body1"
            >
                <span>{translateText("Please email the Cook County GIS Department at ")}
                    <a href="mailto:gis@cookcountyil.gov">gis@cookcountyil.gov</a>
                </span>
            </Typography>
            <Typography
            variant="body1"
            >
                <span>161 North Clark Street, Suite 500
                <br /><span>Chicago, Illinois 60601</span>
                </span>
            </Typography>
            </Box>   

            <Box 
            id="assessor-contact"
            display="flex"
            flexDirection="column"
            rowGap={1}
            >
            <Typography
            variant="body2"
            >
                {translateText("For questions about Assessment Information:")}
            </Typography>
            <Typography
            variant="body1"
            >
                <span>{translateText("Please contact the ")}
                    <a href="https://www.cookcountyassessor.com/contact" target="_blank">{translateText("Cook County Assessor's Office")}</a>
                </span>
            </Typography>
            <Typography
            variant="body1"
            >
                <span>118 North Clark Street, Room #320
                <br /><span>Chicago, Illinois 60602</span>
                <br /><span>(312) 443-7550</span>
                </span>
            </Typography>
            </Box>  

            <Box 
            id="parcel-maps-contact"
            display="flex"
            flexDirection="column"
            rowGap={1}
            >
            <Typography
            variant="body2"
            >
                {translateText("For questions about Parcel maps, Legal Descriptions & Taxing Districts:")}
            </Typography>
            <Typography
            variant="body1"
            >
                <span>{translateText("Please email the Cook County Clerk’s Office at ")}
                    <a href="mailto:clerk.maps@cookcountyil.gov">clerk.maps@cookcountyil.gov</a>
                </span>
            </Typography>
            <Typography
            variant="body1"
            >
                <span>118 North Clark Street, Room #434
                <br /><span>Chicago, Illinois 60602</span>
                <br /><span>(312) 603-5640</span>
                </span>
            </Typography>
            </Box>  

            <Box 
            id="plat-request-contact"
            display="flex"
            flexDirection="column"
            rowGap={1}
            >
            <Typography
            variant="body2"
            >
                {translateText("For Plat requests or for other recorded documents:")}
            </Typography>
            <Typography
            variant="body1"
            >
                <span>{translateText("Please email the Cook County Clerk's Recordings Division at ")}
                    <a href="mailto:clerk.recordings@cookcountyil.gov">clerk.recordings@cookcountyil.gov</a>
                </span>
            </Typography>
            <Typography
            variant="body1"
            >
                <span>118 North Clark Street, Room #120
                <br /><span>Chicago, Illinois 60602</span>
                <br /><span>(312) 603-5050</span>
                </span>
            </Typography>
            </Box>           
            
        </Box>
        </Box>
    )
}

export default Info