import { Box, Dialog, DialogContent, DialogTitle,  Typography, Button, DialogActions } from "@mui/material"
import { theme } from "../../theme"
import { config } from "../../data/config"
import AppImages from "../AppImages/AppImages.js";
import useMediaQuery from '@mui/material/useMediaQuery';
import React, { useEffect, useState } from 'react';
// Inside your component
import UseAppContext from "../../contexts/AppContext"


const Modal = ({ open, imageUrl, onClose }) => {

    const { translateText } = UseAppContext()
    return (
        <Dialog 
        open={open}
        onClose={onClose}
        >
            <DialogContent>
                <img src={imageUrl} alt="Enlarged Image" style={{ maxWidth: '100%', maxHeight: 'calc(80% - 20px)'  }} />    
            </DialogContent>
            <DialogActions>
            <Button variant="text" onClick={onClose} sx={{ textTransform: 'none' }}>
                        <Typography variant="h5" color={theme.palette.primary.main}>
                            {translateText("Close")}
                        </Typography>
                    </Button>
            </DialogActions>
        </Dialog>
    );
}

const HelpContent = ({display}) => {

    const { translateText, language } = UseAppContext()

    //adding imageDirectory and Image
    const [imageDirectory, setImageDirectory] = useState(`${config.image_directory}/${language}`)

    useEffect(() => {
        // Update the image directory based on the language change
        setImageDirectory(`${config.image_directory}/${language}`);
    }, [language]);

    const isMobile = useMediaQuery('(max-width:600px)');

    const [modalOpen, setModalOpen] = useState(false);
    const [enlargedImageUrl, setEnlargedImageUrl] = useState('');

    const handleImageClick = (imageUrl) => {
        setEnlargedImageUrl(imageUrl);
        setModalOpen(true);
    };    

    const handleClose = () => {
        setModalOpen(false)
    }


    switch(display){
        case 0:
            //Overview
            return(
                <Box>
                    <DialogTitle>
                        <Typography variant="h2" color={theme.main.text.dark}>{translateText("help_overview_title")}</Typography>
                    </DialogTitle>
                    <DialogContent>
                        <Box display="flex" flexDirection={{ xs: 'column', md: 'column' }} alignItems="center">
                            <Box flex={1} mr={{ xs: 2, md: 0 }}>
                                <Typography variant="body1" color={theme.main.text.dark}>                                
                                    <p>
                                        {translateText("help_overview_content_0")}
                                        {/* We're here to assist you in navigating through the CookViewer, your gateway to exploring the rich geographical parcel data of Cook County, Illinois. Whether you're a seasoned user or just getting started, our menu offers a variety of options to guide you through your journey. */}
                                    </p>
                                    <p> 
                                        🗺️ {translateText("help_overview_content_1")}
                                        {/*  Explore Map Features: Discover the diverse functionalities available on the CookViewer platform. From searching for addresses to comparable property tools, unleash the full potential of our mapping tools. */}
                                    </p>
                                    <p>
                                        🔍 {translateText("help_overview_content_2")}
                                        {/* Find What You Need: Need assistance locating a parcel? Our search function is at your service. Simply input your query, and let us help you find what you're looking for. */}
                                    </p>
                                    {/* <p>
                                        📚 Access Resources: Dive deeper into the world of geographic data with our collection of resources. Whether you're seeking tutorials, documentation, or additional information, we've got you covered.
                                    </p> */}
                                    <p>
                                        🙋‍♂️ {translateText("help_overview_content_3")}
                                        {/* Get Support: Have questions, encountering issues, have a suggestion? Our support team is here to provide assistance. 
                                        Feel free to reach out for help by submitting feedback, and we'll do our best to ensure your experience with the CookViewer is seamless.     */}
                                    </p>
                                    <p>
                                        {translateText("help_overview_content_4")}
                                        {/* Start exploring now and unlock the wealth of information that CookViewer has to offer! */}
                                    </p>
                                </Typography>
                            </Box>
                        </Box>
                    </DialogContent>
                </Box>
            )        
        case 1:
            return(
                <Box>
                    <DialogTitle>
                        <Typography variant="h2" color={theme.main.text.dark} > 
                        {translateText("help_navbar_title")}
                        {/* Navigation Bar  */}
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <Box display="flex" flexDirection={{ xs: 'column', md: 'column' }} alignItems="center">
                            <Box flex={1} mr={{ xs: 2, md: 0 }}>
                            {isMobile 
                                ? <Typography variant="body1" color={theme.main.text.dark}> 
                                    {translateText("help_navbar_content_0")}
                                    {/* In the navigation bar you can find the search bar, and  */}
                                    <Box component="span" sx={{fontWeight: 'bold'}}> 
                                    {translateText("help_navbar_content_1")}
                                    {/* Help - Feedback - Translate  */}
                                    </Box> 
                                    {translateText("help_navbar_content_2")}
                                    {/* can be found in the top left hamburger icon.  */}
                                    </Typography>  
                                : <Typography variant="body1" color={theme.main.text.dark}>
                                    {translateText("help_navbar_content_3")}
                                    {/* The navigation bar at the top of the screen includes: */}
                                </Typography> } 

                                <ul>
                                    <li> <Typography variant="body1" color={theme.main.text.dark}> 
                                    {translateText("help_navbar_content_4")}
                                    {/* Search bar - description below.  */}
                                    </Typography> </li>
                                    <li> <Typography variant="body1" color={theme.main.text.dark}> 
                                    {translateText("help_navbar_content_5")}
                                    {/* Help button - this dialog box you are currently viewing. */}
                                    </Typography> </li>
                                    <li> <Typography variant="body1" color={theme.main.text.dark}> 
                                    {translateText("help_navbar_content_6")}
                                    {/* Feedback button - opens a survey to submit feedback. */}
                                    </Typography> </li>
                                    <li> <Typography variant="body1" color={theme.main.text.dark}> 
                                    {translateText("help_navbar_content_7")}
                                    {/* Translate button - which allows the user to select the language used in the map.  */}
                                    </Typography> </li>
                                </ul>
                            </Box>
                            <Box flex={6} display="flex" justifyContent="center" padding= '20px' alignItems="center">
                                <img 
                                    src={isMobile ? `${imageDirectory}/${AppImages.navbar_mobile}` : `${imageDirectory}/${AppImages.navbar_desktop}`} 
                                    alt={translateText("help_image_1")}
                                    style={{ maxWidth: "100%", height: "auto" }}
                                    onClick={() => handleImageClick(isMobile ? `${imageDirectory}/${AppImages.navbar_mobile}` : `${imageDirectory}/${AppImages.navbar_desktop}`)}
                                />
                            </Box> 

                        </Box>
                    </DialogContent>
                        {/* Modal Component */}

                <Modal 
                    open={modalOpen}
                    onClose={handleClose}
                    imageUrl={enlargedImageUrl} 
                />  
                </Box>
            )

        case 2:
            return(
                <Box>
                    <DialogTitle>
                        <Typography variant="h2" color={theme.main.text.dark} > 
                        {translateText("help_search_title")}
                        {/* Search  */}
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <Box display="flex" flexDirection={{ xs: 'column', md: 'column' }} alignItems="center">
                            <Box flex={1} mr={{ xs: 2, md: 0 }}>
                                    <Typography variant="body1" color={theme.main.text.dark}>
                                        {translateText("help_search_content_0")}
                                        {/* There are a few different ways to search for a location on the map: The search bar at the top of the screen will accept: */}
                                    </Typography>
                                        <ul>
                                            <li> <Typography variant="body1" color={theme.main.text.dark}> 
                                            {translateText("help_search_content_1")}
                                            {/* 10 digit PIN (1709461015)  */}
                                            </Typography> </li>
                                            <li> <Typography variant="body1" color={theme.main.text.dark}> 
                                            {translateText("help_search_content_2")}
                                            {/* 14 digit PIN (17094610150000)  */}
                                            </Typography> </li>
                                            <li> <Typography variant="body1" color={theme.main.text.dark}> 
                                            {translateText("help_search_content_3")}
                                            {/* 14 digit PIN with dashes (17-09-461-015-0000)  */}
                                            </Typography> </li>
                                            <li> <Typography variant="body1" color={theme.main.text.dark}> 
                                            {translateText("help_search_content_4")}
                                            {/* Property Address (69 W Washington, Chicago)  */}
                                            </Typography> </li>
                                            <li> <Typography variant="body1" color={theme.main.text.dark}> 
                                            {translateText("help_search_content_5")}
                                            {/* Street Intersection (W Washington St & N Dearborn) */}
                                            </Typography> </li>
                                        </ul>
                                    <Typography variant="body1" color={theme.main.text.dark}>
                                        {translateText("help_search_content_6")}
                                        {/* The results of your search will be displayed in the Property Results panel. Click on the desired result to view its details and the map will zoom to that location. */}
                                    </Typography>                                    
                            </Box>
                        <Box flex={6} display="flex" justifyContent="center" padding= '20px' alignItems="center">
                            <img 
                                src={isMobile ? `${imageDirectory}/${AppImages.widget_search_mobile}` : `${imageDirectory}/${AppImages.widget_search_desktop}`} 
                                alt={translateText("help_image_2")}
                                style={{ width: "100%", height: "auto", cursor: "pointer" }}
                                onClick={() => handleImageClick(isMobile ? `${imageDirectory}/${AppImages.widget_search_mobile}` : `${imageDirectory}/${AppImages.widget_search_desktop}`)} // Call handleImageClick when the image is clicked
                            />
                        </Box>
                        </Box>
                    </DialogContent>
                {/* Modal Component */}
                <Modal open={modalOpen} imageUrl={isMobile ? `${imageDirectory}/${AppImages.widget_search_mobile}` : `${imageDirectory}/${AppImages.widget_search_desktop}`}  onClose={handleClose} />                    
                </Box>
            )


        case 3:
            return(
                <Box>
                    <DialogTitle>
                        <Typography variant="h2" color={theme.main.text.dark} > 
                            {translateText("help_property_results_title")}
                            {/* Property Results  */}
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <Box display="flex" flexDirection={{ xs: 'column', md: 'column' }} alignItems="center">
                            <Box flex={1} mr={{ xs: 2, md: 0 }}>
                                <Typography variant="body1" color={theme.main.text.dark}>
                                {translateText("help_property_results_content_0")}
                                {/* After selecting the property you'll be taken to a window with property information. For each property, information is displayed in the Property Results panel. 
                                The top of the panel includes a Result count that displays before selecting a property as well as Clear, Export and Feedback buttons that persist within a selected property result. */}
                                </Typography>
                                    <ul>
                                        <li> <Typography variant="body1" sx={{padding:0}}> 
                                        <Box component="span" sx={{fontWeight: 'bold'}}>
                                            {translateText("help_property_results_content_1")}
                                            {/* Location  */}
                                            </Box> 
                                            {translateText("help_property_results_content_2")}
                                            {/* describes the Township, Municipality, Zoning Information, and Find My District, below which is a link (Political Districts) that opens the Find My District application in a new tab displaying all the political districts a property falls within.  */}
                                            </Typography> </li>
                                        <li> <Typography variant="body1" color={theme.main.text.dark}> 
                                        <Box component="span" sx={{fontWeight: 'bold'}}>
                                            {translateText("help_property_results_content_3")}
                                            {/* Property Comparison */}
                                            </Box> 
                                            {translateText("help_property_results_content_4")} 
                                            {/* includes two different kinds of property comparison searches: */}
                                            </Typography> </li>
                                        {/* <ul>
                                            <li> <Typography variant="body1" color={theme.main.text.dark}> <Box component="span" sx={{fontWeight: 'bold'}}>Compare Properties</Box> button will begin a search based on any combination of comparison criteria. Details about this workflow are below. </Typography> </li>
                                            <li> <Typography variant="body1" color={theme.main.text.dark}> <Box component="span" sx={{fontWeight: 'bold'}}>Nearby Parcels</Box>  button will select the parcels within a user-defined distance around the property. </Typography> </li>

                                        </ul> */}
                                        <li> <Typography variant="body1" color={theme.main.text.dark}> <Box component="span" sx={{fontWeight: 'bold'}}> 
                                        {translateText("help_property_results_content_5")} 
                                        {/* Tax Details  */}
                                        </Box> 
                                        {translateText("help_property_results_content_6")} 
                                        {/* describes the Property Classification, Land Square Footage, Assessor Neighborhood, and Assessor Property Details which is a link that opens the Assessor Website in a new tab displaying information for the selected property.  */}
                                        </Typography> </li>
                                        <li> <Typography variant="body1" color={theme.main.text.dark}> <Box component="span" sx={{fontWeight: 'bold'}}> 
                                        {translateText("help_property_results_content_7")} 
                                        {/* Assessed Value  */}
                                        </Box> 
                                        {translateText("help_property_results_content_8")} 
                                        {/* Assessed Value includes Current Value Description, Total Assessed Value, Land Value, Building Value, and Historical Assessed Values, which is a link that opens the Cook County Open Data portal in a new tab displaying the information for the selected property.  */}
                                        </Typography> </li>

                                        <li> <Typography variant="body1" color={theme.main.text.dark}> <Box component="span" sx={{fontWeight: 'bold'}}> 
                                        {translateText("help_property_results_content_9")} 
                                        {/* Building Characteristics  */}
                                        </Box> 
                                        {translateText("help_property_results_content_10")} 
                                        {/* includes the Estimated Building Square Footage, Construction Type, and Age.  */}
                                        </Typography> </li>
                                        <li> <Typography variant="body1" color={theme.main.text.dark}> <Box component="span" sx={{fontWeight: 'bold'}}> 
                                        {translateText("help_property_results_content_11")} 
                                        {/* Imagery  */}
                                        </Box> 
                                        {translateText("help_property_results_content_12")}  
                                        {/* includes links to the Oblique Imagery Viewer, a display tool for aerial images from a 45-degree angle view, and Historical Photo, a separate tool displaying a historical ground photo image of the property.  */}
                                        </Typography> </li>
                                        {/* <ul>
                                            <li> <Typography variant="body1" color={theme.main.text.dark}> The Oblique Imagery Viewer link opens a new tab that displays the aerial images from a 45-degree angle view. You can browse these aerial photos from Overhead, Looking North, Looking East, Looking South, and Looking West. </Typography> </li>
                                            <li> <Typography variant="body1" color={theme.main.text.dark}> The Historical Photo link opens a new tab displaying a historical ground photo image of the property. </Typography> </li>
                                        </ul> */}
                                        <li> <Typography variant="body1" color={theme.main.text.dark}> <Box component="span" sx={{fontWeight: 'bold'}}> 
                                        {translateText("help_property_results_content_13")} 
                                        {/* Data and Resources  */}
                                        </Box>  
                                        {translateText("help_property_results_content_14")} 
                                        {/* includes links to Clerk Property Records Search, Cook County Property Tax Portal, Historical Single and Multi-Family Improvement Characteristics, and Historical Residential Condominium Unit Characteristics.  */}
                                        </Typography> </li>
                                    </ul>                                  
                            </Box>

                        <Box flex={6} display="flex" justifyContent="center" padding= '20px' alignItems="center">
                            <img 
                                src={isMobile ? `${imageDirectory}/${AppImages.property_results_mobile}` : `${imageDirectory}/${AppImages.property_results_desktop}`} 
                                alt={translateText("help_image_3")}
                                style={{ width: "100%", height: "auto", cursor: "pointer" }}
                                onClick={() => handleImageClick(isMobile ? `${imageDirectory}/${AppImages.property_results_mobile}` : `${imageDirectory}/${AppImages.property_results_desktop}`)} // Call handleImageClick when the image is clicked
                            />
                        </Box>
                        </Box>
                    </DialogContent>
                {/* Modal Component */}
                <Modal open={modalOpen} imageUrl={isMobile ? `${imageDirectory}/${AppImages.property_results_mobile}` : `${imageDirectory}/${AppImages.property_results_desktop}`}  onClose={handleClose}/>                   
                </Box>
            )

        case 4:
            return(
                <Box>
                    <DialogTitle>
                        <Typography variant="h2" color={theme.main.text.dark} > 
                        {translateText("help_compare_properties_title")} 
                        {/* Compare Properties  */}
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <Box display="flex" flexDirection={{ xs: 'column', md: 'column' }} alignItems="center">
                            <Box flex={1} mr={{ xs: 2, md: 0 }}>
                            <Typography variant="body1" color={theme.main.text.dark}>
                            {translateText("help_compare_property_content_0")} 
                                {/* Clicking on the Comparable Properties button you'll will fill out a form. Once these parameters are set, the user can click “Search” and will receive a list of comparable properties much like the results of the initial property search. 
                                The top of the panel includes a Result count that displays before selecting a property as well as Clear, Export and Feedback buttons that persist within a selected property result. */}
                            </Typography>
                            {/* <ul>
                                <li> <Typography variant="body1" color={theme.main.text.dark}> Clear: clear the property results. </Typography> </li>
                                <li> <Typography variant="body1" color={theme.main.text.dark}>Export: export the property results. Choose to export property details, a map of the property, or both.</Typography> </li>
                                <li> <Typography variant="body1" color={theme.main.text.dark}> Feedback: opens a survey to submit feedback. </Typography> </li>
                            </ul> */}
                            <br/>
                            <Typography variant="body1" color={theme.main.text.dark}>
                                {translateText("help_compare_property_content_1")} 
                                {/* Selecting a property will open the Property Details that can be compared to the originally selected property. 
                                At the bottom of the pane, there are back and next arrows that allow the user to flip between the details of each comparable property. */}
                                </Typography>                                    
                            </Box>

                        <Box flex={6} display="flex" justifyContent="center" padding= '20px' alignItems="center">
                            <img 
                                src={isMobile ? `${imageDirectory}/${AppImages.compare_mobile}` : `${imageDirectory}/${AppImages.compare_desktop}`} 
                                alt={translateText("help_image_4")}
                                style={{ width: "100%", height: "auto", cursor: "pointer" }}
                                onClick={() => handleImageClick(isMobile ? `${imageDirectory}/${AppImages.compare_mobile}` : `${imageDirectory}/${AppImages.compare_desktop}`)} // Call handleImageClick when the image is clicked
                            />
                        </Box>
                        </Box>
                    </DialogContent>
                {/* Modal Component */}
                <Modal open={modalOpen} imageUrl={isMobile ? `${imageDirectory}/${AppImages.compare_mobile}` : `${imageDirectory}/${AppImages.compare_desktop}`}  onClose={handleClose} />                   
                </Box>
            )

        case 5:
            return(
                <Box>
                    <DialogTitle>
                        <Typography variant="h2" color={theme.main.text.dark} > 
                        {translateText("help_measure_title")} 
                            {/* Measure  */}
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <Box display="flex" flexDirection={{ xs: 'column', md: 'column' }} alignItems="center">
                            <Box flex={1} mr={{ xs: 2, md: 0 }}>
                                <Typography variant="body1" color={theme.main.text.dark}>
                                {translateText("help_measure_content_0")} 
                                    {/* The measure tool allows you to calculate an estimated area, distance or XY location. Once the desired measurement type and measurement units are 
                                    selected you can click on the map to find your measurement. As you click on the map you will create a vertex for the line or area that you want to 
                                    measure and when you have finished drawing the line or area you want to measure double click and the final measurement will be displayed in the tool window. */}
                                </Typography>                                 
                            </Box>

                            {/* <Box flex={2} display="flex" justifyContent="center" alignItems="center" padding= '10px'>
                                <img 
                                    src={isMobile ? AppImages.navbar_mobile : AppImages.widget_search_desktop} 
                                    alt="Navigation Bar Image" 
                                    style={{ maxWidth: "110%" }} 
                                />
                            </Box> */}
                        <Box flex={6} display="flex" justifyContent="center" padding= '20px' alignItems="center">
                            <img 
                                src={isMobile ? `${imageDirectory}/${AppImages.widget_measure_mobile}` : `${imageDirectory}/${AppImages.widget_measure_desktop}`} 
                                alt={translateText("help_image_5")}
                                style={{ width: "100%", height: "auto", cursor: "pointer" }}
                                onClick={() => handleImageClick(isMobile ? `${imageDirectory}/${AppImages.widget_measure_mobile}` : `${imageDirectory}/${AppImages.widget_measure_desktop}`)} // Call handleImageClick when the image is clicked
                            />
                        </Box>
                        </Box>
                    </DialogContent>
                {/* Modal Component */}
                <Modal open={modalOpen} imageUrl={isMobile ? `${imageDirectory}/${AppImages.widget_measure_mobile}` : `${imageDirectory}/${AppImages.widget_measure_desktop}`}  onClose={handleClose}/>                    
                </Box>
            )

        case 6:
            return(
                <Box>
                    <DialogTitle>
                        <Typography variant="h2" color={theme.main.text.dark} > 
                        {translateText("help_layers_title")}
                        {/* Layers  */}
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <Box display="flex" flexDirection={{ xs: 'column', md: 'column' }} alignItems="center">
                            <Box flex={1} mr={{ xs: 2, md: 0 }}>
                            <Typography variant="body1" color={theme.main.text.dark}>
                                {translateText("help_layers_content_0")}
                                {/* Provides the user with the option to add more layers to the map from a curated list of layers. */}
                            </Typography>                                  
                            </Box>

                        <Box flex={6} display="flex" justifyContent="center" padding= '20px' alignItems="center">
                            <img 
                                src={isMobile ? `${imageDirectory}/${AppImages.widget_layers_mobile}` : `${imageDirectory}/${AppImages.widget_layers_desktop}`} 
                                alt={translateText("help_image_6")} 
                                style={{ width: "100%", height: "auto", cursor: "pointer" }}
                                onClick={() => handleImageClick(isMobile ? `${imageDirectory}/${AppImages.widget_layers_mobile}` : `${imageDirectory}/${AppImages.widget_layers_desktop}`)} // Call handleImageClick when the image is clicked
                            />
                        </Box>
                        </Box>
                    </DialogContent>
                {/* Modal Component */}
                <Modal open={modalOpen} imageUrl={isMobile ? `${imageDirectory}/${AppImages.widget_layers_mobile}` : `${imageDirectory}/${AppImages.widget_layers_desktop}`}  onClose={handleClose} />                    
                </Box>
            )

        case 7:
            return(
                <Box>
                    <DialogTitle>
                        <Typography variant="h2" color={theme.main.text.dark} > 
                        {translateText("help_basemaps_title")}
                        {/* Basemaps  */}
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <Box display="flex" flexDirection={{ xs: 'column', md: 'column' }} alignItems="center">
                            <Box flex={1} mr={{ xs: 2, md: 0 }}>
                            <Typography variant="body1" color={theme.main.text.dark}>
                                {translateText("help_basemaps_content_0")}
                                {/* Provides the user with the option to select a different basemap from a curated list. */}
                            </Typography>                                  
                            </Box>

                        <Box flex={6} display="flex" justifyContent="center" padding= '20px' alignItems="center">
                            <img 
                                src={isMobile ? `${imageDirectory}/${AppImages.widget_basemaps_mobile}` : `${imageDirectory}/${AppImages.widget_basemaps_desktop}`} 
                                alt={translateText("help_image_7")}
                                style={{ width: "100%", height: "auto", cursor: "pointer" }}
                                onClick={() => handleImageClick(isMobile ? `${imageDirectory}/${AppImages.widget_basemaps_mobile}` : `${imageDirectory}/${AppImages.widget_basemaps_desktop}`)} // Call handleImageClick when the image is clicked
                            />
                        </Box>
                        </Box>
                    </DialogContent>
                {/* Modal Component */}
                <Modal open={modalOpen} imageUrl={isMobile ? `${imageDirectory}/${AppImages.widget_basemaps_mobile}` : `${imageDirectory}/${AppImages.widget_basemaps_desktop}`}  onClose={handleClose} />                    
                </Box>
            )
        case 8:
            return(
                <Box>
                    <DialogTitle>
                        <Typography variant="h2" color={theme.main.text.dark} > 
                        {translateText("help_prints_title")}
                        {/* Print  */}
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <Box display="flex" flexDirection={{ xs: 'column', md: 'column' }} alignItems="center">
                            <Box flex={1} mr={{ xs: 2, md: 0 }}>
                            
                            <Typography variant="body1" color={theme.main.text.dark}>
                                {translateText("help_print_content_0")}
                                {/* Click the print tool and follow the dialog to print a pdf of the displayed map. */}
                            </Typography>                                   
                            </Box>

                        <Box flex={6} display="flex" justifyContent="center" padding= '20px' alignItems="center">
                            <img 
                                src={isMobile ? `${imageDirectory}/${AppImages.widget_print_mobile}` : `${imageDirectory}/${AppImages.widget_print_desktop}`} 
                                alt={translateText("help_image_8")}
                                style={{ width: "100%", height: "auto", cursor: "pointer" }}
                                onClick={() => handleImageClick(isMobile ? `${imageDirectory}/${AppImages.widget_print_mobile}` : `${imageDirectory}/${AppImages.widget_print_desktop}`)} // Call handleImageClick when the image is clicked
                            />
                        </Box>
                        </Box>
                    </DialogContent>
                {/* Modal Component */}
                <Modal open={modalOpen} imageUrl={isMobile ? `${imageDirectory}/${AppImages.widget_print_mobile}` : `${imageDirectory}/${AppImages.widget_print_desktop}`}  onClose={handleClose} />                    
                </Box>
            )
            case 9:
                return(
                    <Box>
                        <DialogTitle>
                            <Typography variant="h2" color={theme.main.text.dark} > 
                            {translateText("help_export_title")}
                            {/* Clear, Export and Feedback  */}
                            </Typography>
                        </DialogTitle>
                        <DialogContent>
                            <Box display="flex" flexDirection={{ xs: 'column', md: 'column' }} alignItems="center">
                                <Box flex={1} mr={{ xs: 2, md: 0 }}>
                                
                                    <Typography variant="body1" color={theme.main.text.dark}>
                                    {translateText("help_export_content_0")}
                                    {/* The top of the panels you'll see Clear, Export and Feedback buttons that persist within a selected property result. You can also find a feedback button at the top right on the navigation panel in the app.  */}
                                    </Typography>    
                                    <ul>
                                        <li> <Typography variant="body1" color={theme.main.text.dark}> <Box component="span" sx={{fontWeight: 'bold'}}> 
                                        {translateText("help_export_content_1")}
                                        {/* Clear:  */}
                                        </Box> 
                                        {translateText("help_export_content_2")}
                                        {/* clears the property results in the selected panel.  */}
                                        </Typography> </li>
                                        <li> <Typography variant="body1" color={theme.main.text.dark}> <Box component="span" sx={{fontWeight: 'bold'}}> 
                                        {translateText("help_export_content_3")}
                                        {/* Export:  */}
                                        </Box> 
                                        {translateText("help_export_content_4")}
                                        {/* export the property results. Choose to export property details, a map of the property, or both.  */}
                                        </Typography> </li>
                                        <li> <Typography variant="body1" color={theme.main.text.dark}> <Box component="span" sx={{fontWeight: 'bold'}}> 
                                        {translateText("help_export_content_5")}
                                        {/* Feedback:  */}
                                        </Box> 
                                        {translateText("help_export_content_6")}
                                        {/* opens a survey to submit feedback.  */}
                                        </Typography> </li>                                        
                                    </ul> 
                                </Box>
    
                            <Box flex={6} display="flex" justifyContent="center" padding= '20px' alignItems="center">
                                <img 
                                    src={isMobile ? `${imageDirectory}/${AppImages.user_buttons_desktop}` : `${imageDirectory}/${AppImages.user_buttons_desktop}`} 
                                    alt={translateText("help_image_9")}
                                    style={{ width: "100%", height: "auto", cursor: "pointer" }}
                                    onClick={() => handleImageClick(isMobile ? `${imageDirectory}/${AppImages.user_buttons_desktop}` : `${imageDirectory}/${AppImages.user_buttons_desktop}`)} // Call handleImageClick when the image is clicked
                                />
                            </Box>
                            </Box>
                        </DialogContent>
                    {/* Modal Component */}
                    <Modal open={modalOpen} imageUrl={isMobile ? `${imageDirectory}/${AppImages.user_buttons_desktop}` : `${imageDirectory}/${AppImages.user_buttons_desktop}`}  onClose={handleClose} />                    
                    </Box>
                )
        default:
            return null
    }
}

export default HelpContent
